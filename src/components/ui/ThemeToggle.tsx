import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import { triggerHaptic } from '../../utils/haptics';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  const handleClick = () => {
    triggerHaptic(15);
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/80 dark:border-slate-700 active:scale-95 overflow-hidden group"
      aria-label="Alternar tema"
      title="Alternar Tema Claro/Escuro"
    >
      {theme === 'dark' ? (
        <Sun
          size={18}
          strokeWidth={2.5}
          className="text-amber-400 group-hover:text-amber-300 transition-colors group-hover:rotate-45"
        />
      ) : (
        <Moon
          size={18}
          strokeWidth={2.5}
          className="text-indigo-600 group-hover:text-indigo-700 transition-colors group-hover:-rotate-12"
        />
      )}
    </button>
  );
};
