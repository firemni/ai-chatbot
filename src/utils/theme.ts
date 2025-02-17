import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface StoredTheme {
  state: {
    isDarkMode: boolean;
  };
  version: number;
}

const initialState: ThemeState = {
  isDarkMode: false,
  toggleDarkMode: () => void 0, // Will be replaced by the store implementation
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...initialState,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export function initializeTheme(): void {
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const storedTheme = localStorage.getItem('theme-storage');

  // Use stored theme if available, otherwise use system preference
  const isDarkMode = storedTheme
    ? (JSON.parse(storedTheme) as StoredTheme).state.isDarkMode
    : prefersDark;

  // Apply theme
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!storedTheme) {
        // Only auto-switch if user hasn't manually set a preference
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });

  // Initialize the store with the correct value
  useThemeStore.setState({ isDarkMode });
}

export function formatMarkdown(text: string): string {
  // Basic markdown formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/\n/g, '<br>');
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}