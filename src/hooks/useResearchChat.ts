import { useState, useCallback } from 'react';
import { useChat } from './useChat';
import { useResearch } from './useResearch';
import { useResearchStore } from '../utils/research-store';
import { getCachedQueries, findSimilarQueries } from '../utils/research-store';
import { ModelType } from '../../../src/ai/models/model-factory';
import { ResearchResult } from '../services/ResearchService';

export interface ResearchChatOptions {
  model: ModelType;
  autoResearch?: boolean;
  similarityThreshold?: number;
}

export function useResearchChat({
  model,
  autoResearch = true,
  similarityThreshold = 0.7,
}: ResearchChatOptions) {
  const [isResearching, setIsResearching] = useState(false);
  const { messages, sendMessage, isLoading: isChatLoading } = useChat(model);
  const { performResearch, expandContext, isLoading: isResearchLoading } = useResearch();
  const {
    currentQuery,
    selectedResult,
    setCurrentQuery,
    addResult,
    selectResult,
  } = useResearchStore();

  const shouldResearch = useCallback((content: string): boolean => {
    if (!autoResearch) return false;

    // Check if content is a question or contains research indicators
    const isQuestion = content.includes('?');
    const hasResearchKeywords = /research|find|explain|how|what|why|when|where|who/i.test(content);
    const isLongEnough = content.split(' ').length >= 3;

    return (isQuestion || hasResearchKeywords) && isLongEnough;
  }, [autoResearch]);

  const enrichMessageWithResearch = useCallback(async (content: string): Promise<string> => {
    // Check for similar cached queries first
    const similarQueries = findSimilarQueries(content, similarityThreshold);
    if (similarQueries.length > 0) {
      // Use the most similar cached result
      const mostSimilarQuery = similarQueries[0];
      const cachedResult = useResearchStore.getState().results.get(mostSimilarQuery);
      if (cachedResult) {
        setCurrentQuery(mostSimilarQuery);
        selectResult(cachedResult);
        return content;
      }
    }

    // Perform new research
    setIsResearching(true);
    try {
      const researchResult: ResearchResult = await performResearch(content);
      if (!researchResult) {
        throw new Error('Research failed to return results');
      }

      setCurrentQuery(content);
      addResult(content, researchResult);
      selectResult(researchResult);

      // Enhance the message with research context
      const enhancedContent = await expandContext(content, researchResult.content);
      return enhancedContent || content;
    } catch (error) {
      console.error('Research error:', error);
      return content;
    } finally {
      setIsResearching(false);
    }
  }, [performResearch, expandContext, similarityThreshold, setCurrentQuery, selectResult, addResult]);

  const handleSendMessage = useCallback(async (content: string) => {
    let enhancedContent = content;
    
    if (shouldResearch(content)) {
      enhancedContent = await enrichMessageWithResearch(content);
    }

    await sendMessage(enhancedContent);
  }, [sendMessage, shouldResearch, enrichMessageWithResearch]);

  return {
    messages,
    sendMessage: handleSendMessage,
    isLoading: isChatLoading || isResearchLoading || isResearching,
    currentResearch: selectedResult,
    currentQuery,
    cachedQueries: getCachedQueries(),
  };
}