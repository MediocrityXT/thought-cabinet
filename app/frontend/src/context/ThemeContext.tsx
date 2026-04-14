import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getThemeConfig, updateThemeConfig } from '../lib/api';
import type { ThemeName } from '../lib/types';

type ThemeContextValue = {
  theme: ThemeName;
  loading: boolean;
  error: string | null;
  setTheme: (theme: ThemeName) => Promise<void>;
  refreshTheme: () => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const cached = window.localStorage.getItem('thoughtcabinet.theme') as ThemeName | null;
    return cached ?? 'NEON';
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTheme = useCallback(async () => {
    try {
      setError(null);
      const config = await getThemeConfig();
      setThemeState(config.activeTheme);
      window.localStorage.setItem('thoughtcabinet.theme', config.activeTheme);
    } catch (loadError) {
      console.error('Failed to fetch theme config', loadError);
      setError('Theme config unavailable, using NEON fallback.');
      setThemeState('NEON');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTheme();
  }, [loadTheme]);

  async function setTheme(nextTheme: ThemeName) {
    setThemeState(nextTheme);
    window.localStorage.setItem('thoughtcabinet.theme', nextTheme);
    setError(null);
    try {
      const config = await updateThemeConfig(nextTheme);
      setThemeState(config.activeTheme);
      window.localStorage.setItem('thoughtcabinet.theme', config.activeTheme);
    } catch (updateError) {
      console.error('Failed to update theme config', updateError);
      setError('Theme update failed. Local UI state may be out of sync.');
    }
  }

  const refreshTheme = useCallback(async () => {
    await loadTheme();
  }, [loadTheme]);

  return (
    <ThemeContext.Provider value={{ theme, loading, error, setTheme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
