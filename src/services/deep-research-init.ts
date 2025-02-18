import DeepResearch from 'deep-research';

let deepResearchInstance: DeepResearch | null = null;

export function initializeDeepResearch() {
  if (!deepResearchInstance) {
    deepResearchInstance = new DeepResearch({
      firecrawlKey: process.env.NEXT_PUBLIC_FIRECRAWL_KEY,
      openAIKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
      openAIModel: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4-turbo-preview',
      openAIEndpoint: process.env.NEXT_PUBLIC_OPENAI_ENDPOINT,
      maxDepth: 3,
      minConfidence: 0.7,
      breadth: 4,
      concurrencyLimit: 2,
      timeout: 60000
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