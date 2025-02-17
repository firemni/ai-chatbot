'use client';

import { useEffect } from 'react';
import { ResearchChat } from '../components/ResearchChat';
import { useThemeStore } from '../utils/theme';

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply theme when component mounts or theme changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white 
                    dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Roo Code Boss Research Chat
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 
                     hover:bg-gray-300 dark:hover:bg-gray-600
                     transition-colors"
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
  );
}