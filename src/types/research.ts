export interface Node {
  id: string;
  label: string;
  type: 'concept' | 'fact' | 'source';
}

export interface Edge {
  source: string;
  target: string;
  relationship: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export interface SearchResult {
  summary: string;
  sources: string[];
  confidence: number;
  relatedTopics: string[];
}

export interface ResearchSession {
  search(): Promise<SearchResult>;
  generateKnowledgeGraph(): Promise<Graph>;
  synthesizeResults(): Promise<{
    summary: string;
    sources: string[];
    confidence: number;
    relatedTopics: string[];
  }>;
}

export interface DeepResearchConfig {
  maxDepth: number;
  minConfidence: number;
  includeKnowledgeGraph: boolean;
}

export interface DeepResearch {
  createSession(query: string): Promise<ResearchSession>;
  expandContext(topic: string, existingContext: string): Promise<{
    enhancedContext: string;
  }>;
  suggestQueries(query: string): Promise<{
    queries: string[];
  }>;
}

export interface ResearchVisualization {
  graph: Graph;
  searchResults: SearchResult;
  relatedQueries: string[];
}