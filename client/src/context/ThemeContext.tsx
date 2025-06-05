import React, { createContext, useContext, useEffect, useState } from "react";

// Platform detection
const isWeb = typeof window !== "undefined" && typeof document !== "undefined";

// For React Native
let AsyncStorage: any = null;
let Appearance: any = null;
let Platform: any = null;
if (!isWeb) {
  // Dynamically require to avoid breaking web
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
  Appearance = require("react-native").Appearance;
  Platform = require("react-native").Platform;
}

type Theme = "light" | "dark";
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      if (isWeb) {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") {
          setTheme(stored);
        } else {
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          setTheme(prefersDark ? "dark" : "light");
        }
      } else {
        try {
          const stored = await AsyncStorage.getItem("theme");
          if (stored === "light" || stored === "dark") {
            setTheme(stored);
          } else {
            const colorScheme = Appearance.getColorScheme();
            setTheme(colorScheme === "dark" ? "dark" : "light");
          }
        } catch {
          setTheme("light");
        }
      }
    };
    loadTheme();
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (isWeb) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } else {
      AsyncStorage.setItem("theme", theme).catch(() => {});
      // Optionally, you can use a library like react-native-appearance or a custom solution to apply theme to your app styles
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}; 