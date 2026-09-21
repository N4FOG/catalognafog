import { create } from 'zustand';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const THEME_STORAGE_KEY = 'rawell_theme_v3';

function getInitialTheme(): 'light' | 'dark' {
  // Garante que SEMPRE que entrar venha no tema claro, nunca no escuro
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch {}
  return 'light';
}

function applyThemeToDOM(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    root.classList.add('dark');
    document.body?.classList.add('dark');
  } else {
    root.classList.remove('dark');
    document.body?.classList.remove('dark');
  }
}

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
    applyThemeToDOM(theme);
    set({ theme });
  }
}));

