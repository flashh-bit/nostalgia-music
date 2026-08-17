"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { themes, Theme } from "@/lib/themes";

type ThemeContextValue = {
  themeId: string | null;
  activeTheme: Theme;
  setThemeId: (id: string) => void;
  autoRotateInterval: number | null;
  setAutoRotateInterval: (ms: number | null) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // null = not yet mounted (avoid SSR/hydration mismatch)
  const [themeId, setThemeIdState] = useState<string | null>(null);
  const [autoRotateInterval, setAutoRotateState] = useState<number | null>(null);

  useEffect(() => {
    setThemeIdState(localStorage.getItem("vibe") ?? themes[0].id);
    const savedAuto = localStorage.getItem("autoRotateInterval");
    if (savedAuto) setAutoRotateState(Number(savedAuto));
  }, []);

  function setThemeId(id: string) {
    setThemeIdState(id);
    localStorage.setItem("vibe", id);
  }

  function setAutoRotateInterval(ms: number | null) {
    setAutoRotateState(ms);
    if (ms === null) localStorage.removeItem("autoRotateInterval");
    else localStorage.setItem("autoRotateInterval", ms.toString());
  }

  const activeTheme = themes.find((t) => t.id === themeId) ?? themes[0];

  // Auto-rotate logic
  useEffect(() => {
    if (!autoRotateInterval) return;
    
    const timer = setInterval(() => {
      setThemeIdState((currentId) => {
        // Pick a random theme different from the current one
        const others = themes.filter(t => t.id !== currentId);
        const next = others[Math.floor(Math.random() * others.length)];
        localStorage.setItem("vibe", next.id);
        return next.id;
      });
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [autoRotateInterval]);

  return (
    <ThemeContext.Provider value={{ themeId, activeTheme, setThemeId, autoRotateInterval, setAutoRotateInterval }}>
      <div
        style={{ "--accent": activeTheme.accent } as React.CSSProperties}
        className="contents"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
