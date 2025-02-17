'use client';

import { ResearchChat } from '../../src/components/ResearchChat';

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Research Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Ask questions and explore topics with AI-powered research
        </p>
      </header>
      <ResearchChat />
    </div>
  );
}