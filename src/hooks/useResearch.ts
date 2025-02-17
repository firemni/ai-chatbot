import { useState } from 'react';
import { ResearchService, ResearchResult } from '../services/ResearchService';

export function useResearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const researchService = new ResearchService();

  const performResearch = async (query: string): Promise<ResearchResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const researchResult = await researchService.researchTopic(query);
      setResult(researchResult);
      return researchResult;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to perform research';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const expandContext = async (topic: string, context: string): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      const expandedContext = await researchService.expandContext(topic, context);
      return expandedContext;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to expand context';
      setError(errorMessage);
      return context; // Return original context on error
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestedQueries = async (query: string): Promise<string[]> => {
    try {
      setError(null);
      const suggestions = await researchService.suggestRelatedQueries(query);
      return suggestions;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to get suggestions';
      setError(errorMessage);
      return [];
    }
  };

  return {
    isLoading,
    error,
    result,
    performResearch,
    expandContext,
    getSuggestedQueries,
  };
}