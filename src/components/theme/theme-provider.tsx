"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// Color theme types
export type ColorTheme = "default" | "coffee" | "mint" | "berry";

type ThemeContextType = {
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default");

  // Save color theme in local storage
  useEffect(() => {
    // Load color theme from local storage on page load
    const savedColorTheme = localStorage.getItem("color-theme") as ColorTheme;
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
      document.documentElement.setAttribute(
        "data-color-theme",
        savedColorTheme
      );
    }
  }, []);

  // Update color theme
  const handleSetColorTheme = (theme: ColorTheme) => {
    setColorTheme(theme);
    localStorage.setItem("color-theme", theme);
    document.documentElement.setAttribute("data-color-theme", theme);
  };

  return (
    <ThemeContext.Provider
      value={{ colorTheme, setColorTheme: handleSetColorTheme }}
    >
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </ThemeContext.Provider>
  );
}

// Hook for using color theme
export const useColorTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ThemeProvider");
  }
  return context;
};
