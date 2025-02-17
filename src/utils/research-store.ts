import { create } from 'zustand';
import { ResearchResult } from '../services/ResearchService';

interface ResearchState {
  currentQuery: string | null;
  results: Map<string, ResearchResult>;
  selectedResult: ResearchResult | null;
  isLoading: boolean;
  error: string | null;
  setCurrentQuery: (query: string | null) => void;
  addResult: (query: string, result: ResearchResult) => void;
  selectResult: (result: ResearchResult | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearResults: () => void;
}

const initialState = {
  currentQuery: null,
  results: new Map(),
  selectedResult: null,
  isLoading: false,
  error: null,
};

export const useResearchStore = create<ResearchState>()((set) => ({
  ...initialState,
  setCurrentQuery: (query) => set({ currentQuery: query }),
  addResult: (query, result) =>
    set((state) => ({
      results: new Map(state.results).set(query, result),
    })),
  selectResult: (result) => set({ selectedResult: result }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearResults: () =>
    set({
      currentQuery: null,
      results: new Map(),
      selectedResult: null,
      error: null,
    }),
}));

export function getCachedResult(query: string): ResearchResult | undefined {
  const state = useResearchStore.getState();
  return state.results.get(query);
}

export function getCachedQueries(): string[] {
  const state = useResearchStore.getState();
  return Array.from(state.results.keys());
}

export function findSimilarQueries(query: string, threshold = 0.7): string[] {
  const state = useResearchStore.getState();
  const cachedQueries = Array.from(state.results.keys());
  
  return cachedQueries.filter((cachedQuery) => {
    const similarity = calculateSimilarity(query.toLowerCase(), cachedQuery.toLowerCase());
    return similarity >= threshold;
  });
}

function calculateSimilarity(str1: string, str2: string): number {
  // Simple Levenshtein distance-based similarity
  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  return 1 - distance / maxLength;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[str1.length][str2.length];
}