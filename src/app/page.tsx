'use client';

import { useState } from 'react';
import { ResearchChat } from '../components/ResearchChat';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
        <div className="container mx-auto px-4">
          <header className="py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Roo Code Boss Research Chat
            </h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </header>
          
          <main className="py-4">
            <ResearchChat />
          </main>

          <footer className="py-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Powered by multi-model AI and deep research capabilities</p>
          </footer>
        </div>
      </div>
    </div>
  );
}