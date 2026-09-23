import { create } from 'zustand';

export type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getStoredTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('treadcode_theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return 'dark'; // default to dark
};

const applyDocumentTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  }
};

// Initial run on module load
const initialTheme = getStoredTheme();
applyDocumentTheme(initialTheme);

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: initialTheme,
  isLight: initialTheme === 'light',
  toggleTheme: () => {
    set((state) => {
      const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('treadcode_theme', nextTheme);
      }
      applyDocumentTheme(nextTheme);
      return {
        theme: nextTheme,
        isLight: nextTheme === 'light',
      };
    });
  },
  setTheme: (theme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('treadcode_theme', theme);
    }
    applyDocumentTheme(theme);
    set({
      theme,
      isLight: theme === 'light',
    });
  },
}));
