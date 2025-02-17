'use client';

import { useState } from 'react';
import { ModelSelector } from './ModelSelector';
import { ChatBox } from './ChatBox';
import { ResearchVisualization } from './ResearchVisualization';
import { LoadingIndicator } from './LoadingIndicator';
import { useResearchChat } from '../hooks/useResearchChat';
import { ModelType } from '../../../src/ai/models/model-factory';

export function ResearchChat() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const {
    messages,
    sendMessage,
    isLoading,
    currentResearch,
    currentQuery,
  } = useResearchChat({
    model: selectedModel,
    autoResearch: true,
    similarityThreshold: 0.7,
  });

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
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Research visualization sidebar */}
      <div className="w-96 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Research Panel
          </h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingIndicator message="Researching..." />
            </div>
          ) : currentResearch ? (
            <ResearchVisualization research={currentResearch} />
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
              {currentQuery && (
                <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                  Researching: {currentQuery}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}