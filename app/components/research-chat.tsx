'use client';

import { useState } from 'react';
import { ModelSelector } from '@/app/components/model-selector';
import { ChatBox } from '@/app/components/chat-box';
import { ResearchVisualization } from '@/app/components/research-visualization';
import { LoadingIndicator } from '@/app/components/loading-indicator';

type ModelType = 'gemini' | 'openai' | 'openrouter';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ResearchState {
  messages: Message[];
  isLoading: boolean;
  currentResearch: ResearchResult | null;
  currentQuery: string | null;
}

// Mock research result type
interface ResearchResult {
  content: string;
  sources: string[];
  relatedTopics: string[];
  confidence: number;
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

export function ResearchChat() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const [state, setState] = useState<ResearchState>({
    messages: [],
    isLoading: false,
    currentResearch: null,
    currentQuery: null,
  });

  // Mock research function
  const performResearch = async (query: string): Promise<ResearchResult> => {
    return {
      content: `Research results for: ${query}`,
      sources: ['Source 1', 'Source 2'],
      relatedTopics: ['Topic 1', 'Topic 2'],
      confidence: 0.85,
      knowledgeGraph: {
        nodes: [
          { id: '1', label: query, type: 'concept' },
          { id: '2', label: 'Related concept', type: 'fact' }
        ],
        edges: [
          { from: '1', to: '2', label: 'relates to' }
        ]
      }
    };
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content }],
      isLoading: true
    }));

    try {
      // Simulate research
      const research = await performResearch(content);
      
      // Add assistant message with research results
      setState(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { role: 'assistant', content: research.content }
        ],
        currentResearch: research,
        currentQuery: content,
        isLoading: false
      }));
    } catch (error) {
      console.error('Research error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-lg shadow-lg
                    bg-white dark:bg-gray-900 border dark:border-gray-800">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col border-r dark:border-gray-800">
        <div className="p-4 border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <ChatBox
            messages={state.messages}
            onSendMessage={handleSendMessage}
            isLoading={state.isLoading}
          />
        </div>
      </div>

      {/* Research visualization sidebar */}
      <div className="w-96 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Research Panel
          </h2>
          
          {state.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingIndicator message="Researching..." />
            </div>
          ) : state.currentResearch ? (
            <ResearchVisualization research={state.currentResearch} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 
                          text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mb-4 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p>Ask a question to see research results</p>
              {state.currentQuery && (
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  Researching: {state.currentQuery}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}