import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { websiteSettingApi } from '../lib/api';
import { DEFAULT_THEME, mergeTheme, applyThemeAsCssVars } from '../lib/themePresets';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

const getDesignTokens = (mode, palette) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: palette.primary },
          secondary: { main: palette.secondary },
          background: { default: palette.background, paper: palette.surface },
          text: { primary: palette.text, secondary: palette.textSecondary },
          divider: palette.border,
        }
      : {
          primary: { main: palette.primary },
          secondary: { main: palette.secondary },
          background: { default: palette.background, paper: palette.surface },
          text: { primary: palette.text, secondary: palette.textSecondary },
          divider: palette.border,
        }),
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 700 },
    h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
  },
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });
  const [customTheme, setCustomTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('custom-theme');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [themeLoaded, setThemeLoaded] = useState(!!customTheme);

  const fetchTheme = useCallback(async () => {
    try {
      const res = await websiteSettingApi.get();
      if (res.data?.theme) {
        const merged = mergeTheme(res.data.theme);
        setCustomTheme(merged);
        localStorage.setItem('custom-theme', JSON.stringify(merged));
      }
    } catch {
    } finally {
      setThemeLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!customTheme) {
      fetchTheme();
    } else {
      setThemeLoaded(true);
    }
  }, [customTheme, fetchTheme]);

  const effectiveTheme = useMemo(() => {
    return customTheme || DEFAULT_THEME;
  }, [customTheme]);

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  }, [mode]);

  useEffect(() => {
    if (themeLoaded) {
      applyThemeAsCssVars(effectiveTheme, mode);
    }
  }, [effectiveTheme, mode, themeLoaded]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const currentPalette = useMemo(() => {
    return mode === 'dark' ? effectiveTheme.dark : effectiveTheme.light;
  }, [effectiveTheme, mode]);

  const theme = useMemo(() => {
    return createTheme(getDesignTokens(mode, currentPalette));
  }, [mode, currentPalette]);

  const updateTheme = useCallback((newTheme) => {
    const merged = mergeTheme(newTheme);
    setCustomTheme(merged);
    localStorage.setItem('custom-theme', JSON.stringify(merged));
  }, []);

  const value = useMemo(() => ({
    mode,
    toggleTheme,
    isDark: mode === 'dark',
    customTheme: effectiveTheme,
    updateTheme,
    fetchTheme,
  }), [mode, effectiveTheme, updateTheme, fetchTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
