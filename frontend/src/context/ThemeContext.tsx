import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextValue = {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "app.theme";

function applyThemeClasses(darkMode: boolean) {
  const root = document.documentElement;
  if (darkMode) {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_STORAGE_KEY) || "{}");
      if (typeof saved.darkMode === "boolean") return saved.darkMode;
    } catch {}
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const state = { darkMode };
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
    applyThemeClasses(darkMode);
  }, [darkMode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      darkMode,
      setDarkMode,
      toggleDarkMode: () => setDarkMode((v) => !v),
    }),
    [darkMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
