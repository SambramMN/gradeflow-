import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useTheme() {
  const { state, updateSettings } = useApp();
  const theme = state.settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      const handler = (e: MediaQueryListEvent) => {
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const toggleTheme = () => {
    updateSettings({ theme: theme === 'dark' ? 'light' : 'dark' });
  };

  return { theme, toggleTheme };
}
