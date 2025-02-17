import { useState, useCallback } from 'react';
import { ModelType } from '../../../src/ai/models/model-factory';
import { useResearch } from './useResearch';
import { ResearchResult } from '../services/ResearchService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResearchChatOptions {
  model: ModelType;
  autoResearch?: boolean;
  similarityThreshold?: number;
}

export function useResearchChat({
  model,
  autoResearch = true,
  similarityThreshold = 0.7,
}: ResearchChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResearching, setIsResearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const [selectedResult, setSelectedResult] = useState<ResearchResult | null>(null);
  const { performResearch, expandContext, isLoading: isResearchLoading } = useResearch();

  const shouldResearch = useCallback((content: string): boolean => {
    if (!autoResearch) return false;

    // Check if content is a question or contains research indicators
    const isQuestion = content.includes('?');
    const hasResearchKeywords = /research|find|explain|how|what|why|when|where|who/i.test(content);
    const isLongEnough = content.split(' ').length >= 3;

    return (isQuestion || hasResearchKeywords) && isLongEnough;
  }, [autoResearch]);

  const enrichMessageWithResearch = useCallback(async (content: string): Promise<string> => {
    setIsResearching(true);
    try {
      const researchResult = await performResearch(content);
      setCurrentQuery(content);
      setSelectedResult(researchResult);

      // Enhance the message with research context
      const enhancedContent = await expandContext(content, researchResult.content);
      return enhancedContent || content;
    } catch (error) {
      console.error('Research error:', error);
      return content;
    } finally {
      setIsResearching(false);
    }
  }, [performResearch, expandContext]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    // Check if we should perform research
    let assistantContent = content;
    if (shouldResearch(content)) {
      assistantContent = await enrichMessageWithResearch(content);
    }

    // Add assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: assistantContent,
    };
    setMessages(prev => [...prev, assistantMessage]);
  }, [shouldResearch, enrichMessageWithResearch]);

  return {
    messages,
    sendMessage,
    isLoading: isResearching || isResearchLoading,
    currentResearch: selectedResult,
    currentQuery,
  };
}