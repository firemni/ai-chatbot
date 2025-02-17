import { DeepResearch } from '../../../deep-research/src';

export interface ResearchResult {
  content: string;
  sources: string[];
  confidence: number;
  relatedTopics: string[];
  knowledgeGraph?: {
    nodes: Array<{
      id: string;
      label: string;
      type: 'concept' | 'fact' | 'source';
    }>;
    edges: Array<{
      from: string;
      to: string;
      label: string;
    }>;
  };
}

export class ResearchService {
  private deepResearch: DeepResearch;

  constructor() {
    this.deepResearch = new DeepResearch({
      maxDepth: 3,
      minConfidence: 0.7,
      includeKnowledgeGraph: true
    });
  }

  async researchTopic(query: string): Promise<ResearchResult> {
    try {
      // Initialize research session
      const session = await this.deepResearch.createSession(query);

      // Perform deep search
      const searchResults = await session.search();

      // Generate knowledge graph
      const graph = await session.generateKnowledgeGraph();

      // Synthesize findings
      const synthesis = await session.synthesizeResults();

      return {
        content: synthesis.summary,
        sources: synthesis.sources,
        confidence: synthesis.confidence,
        relatedTopics: synthesis.relatedTopics,
        knowledgeGraph: {
          nodes: graph.nodes.map(node => ({
            id: node.id,
            label: node.label,
            type: node.type
          })),
          edges: graph.edges.map(edge => ({
            from: edge.source,
            to: edge.target,
            label: edge.relationship
          }))
        }
      };
    } catch (error) {
      console.error('Research error:', error);
      throw new Error('Failed to perform research');
    }
  }

  async expandContext(topic: string, existingContext: string): Promise<string> {
    try {
      // Use deep research to expand context
      const expansion = await this.deepResearch.expandContext(topic, existingContext);
      return expansion.enhancedContext;
    } catch (error) {
      console.error('Context expansion error:', error);
      throw new Error('Failed to expand context');
    }
  }

  async suggestRelatedQueries(query: string): Promise<string[]> {
    try {
      // Generate related queries based on the knowledge graph
      const suggestions = await this.deepResearch.suggestQueries(query);
      return suggestions.queries;
    } catch (error) {
      console.error('Query suggestion error:', error);
      throw new Error('Failed to suggest related queries');
    }
  }
}