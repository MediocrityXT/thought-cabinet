import { createContext, useContext, useEffect, useEffectEvent, useState } from 'react';
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
  const [theme, setThemeState] = useState<ThemeName>('NEON');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTheme = useEffectEvent(async () => {
    try {
      setError(null);
      const config = await getThemeConfig();
      setThemeState(config.activeTheme);
    } catch (loadError) {
      console.error('Failed to fetch theme config', loadError);
      setError('Theme config unavailable, using NEON fallback.');
      setThemeState('NEON');
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void loadTheme();
  }, [loadTheme]);

  async function setTheme(nextTheme: ThemeName) {
    setThemeState(nextTheme);
    setError(null);
    try {
      const config = await updateThemeConfig(nextTheme);
      setThemeState(config.activeTheme);
    } catch (updateError) {
      console.error('Failed to update theme config', updateError);
      setError('Theme update failed. Local UI state may be out of sync.');
    }
  }

  async function refreshTheme() {
    setLoading(true);
    await loadTheme();
  }

  return (
    <ThemeContext.Provider value={{ theme, loading, error, setTheme, refreshTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
