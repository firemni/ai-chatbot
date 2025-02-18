import { deepResearch } from '../lib/deep-research/deep-research';

let deepResearchInstance: any | null = null; // Keep 'any' for now

export async function initializeDeepResearch() {
  if (!deepResearchInstance) {
    // deepResearch is an async function, so we need to await it.
    // We provide dummy values for query, breadth, and depth, as they are required.
    deepResearchInstance = await deepResearch({
      query: '',
      breadth: 1,
      depth: 1,
    });
  }
  return deepResearchInstance;
}

export function getDeepResearch() {
  if (!deepResearchInstance) {
    throw new Error("DeepResearch not initialized. Call initializeDeepResearch first.");
  }
  return deepResearchInstance;
}