'use client';

import { LoadingIndicator } from './LoadingIndicator';
import { ModelSelector } from './ModelSelector';
import { ChatBox } from './ChatBox';
import { ResearchVisualization } from './ResearchVisualization';
import { useResearchChat } from '../hooks/useResearchChat';
import { ModelType } from '../../../src/ai/models/model-factory';
import { useThemeStore } from '../utils/theme';
import { useState, useEffect } from 'react';

export function ResearchChat() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('gemini');
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const {
    messages,
    sendMessage,
    isLoading,
    currentResearch,
    currentQuery,
    cachedQueries,
  } = useResearchChat({
    model: selectedModel,
    autoResearch: true,
    similarityThreshold: 0.7,
  });

  useEffect(() => {
    // Apply theme when component mounts or theme changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
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

      {/* Research sidebar */}
      <div className="w-96 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Research Panel</h2>
          {isLoading ? (
            <LoadingIndicator message="Researching..." />
          ) : currentResearch ? (
            <ResearchVisualization research={currentResearch} />
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <p>Ask a question to see research results</p>
              {cachedQueries.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Previous Research Topics</h3>
                  <ul className="space-y-2">
                    {cachedQueries.map((query) => (
                      <li
                        key={query}
                        className="text-sm cursor-pointer hover:text-blue-500 
                                 dark:hover:text-blue-400"
                        onClick={() => sendMessage(query)}
                      >
                        {query}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}