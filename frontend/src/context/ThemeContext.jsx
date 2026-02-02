import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const ThemeContext = createContext(null);

// Available theme modes (what user selects)
const THEME_MODES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
});

// Actual applied themes (what gets applied to UI)
const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

// Storage key
const THEME_STORAGE_KEY = "app_theme_mode";

// System preference media query
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export { THEMES, THEME_MODES };
export default ThemeContext;

export const ThemeProvider = ({ children }) => {
  // Safe localStorage wrapper
  const safeLocalStorage = useMemo(
    () => ({
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error(`Error reading ${key} from localStorage:`, error);
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
          return true;
        } catch (error) {
          console.error(`Error writing ${key} to localStorage:`, error);
          return false;
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
          return true;
        } catch (error) {
          console.error(`Error removing ${key} from localStorage:`, error);
          return false;
        }
      },
    }),
    []
  );

  // Get system theme preference
  const getSystemTheme = useCallback(() => {
    if (typeof window === "undefined") return THEMES.LIGHT;

    try {
      return window.matchMedia(DARK_MODE_QUERY).matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    } catch (error) {
      console.error("Error detecting system theme:", error);
      return THEMES.LIGHT;
    }
  }, []);

  // Track system theme separately for auto mode
  const [systemTheme, setSystemTheme] = useState(getSystemTheme());

  // Initialize theme mode from localStorage (light, dark, or auto)
  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = safeLocalStorage.getItem(THEME_STORAGE_KEY);

    // Validate saved mode
    if (savedMode && Object.values(THEME_MODES).includes(savedMode)) {
      return savedMode;
    }

    // Default to auto mode
    return THEME_MODES.AUTO;
  });

  // Calculate the actual applied theme based on mode
  const appliedTheme = useMemo(() => {
    if (themeMode === THEME_MODES.AUTO) {
      return systemTheme;
    }
    return themeMode === THEME_MODES.DARK ? THEMES.DARK : THEMES.LIGHT;
  }, [themeMode, systemTheme]);

  // Apply theme to document
  useEffect(() => {
    try {
      // Save mode to localStorage
      safeLocalStorage.setItem(THEME_STORAGE_KEY, themeMode);

      // Apply to document
      const root = document.documentElement;

      if (appliedTheme === THEMES.DARK) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }

      // Set data attributes for CSS
      root.setAttribute("data-theme", appliedTheme);
      root.setAttribute("data-theme-mode", themeMode);

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          appliedTheme === THEMES.DARK ? "#0f172a" : "#ffffff"
        );
      }
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }, [appliedTheme, themeMode, safeLocalStorage]);

  // Listen for system theme changes (important for auto mode)
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

      const handleChange = (e) => {
        const newSystemTheme = e.matches ? THEMES.DARK : THEMES.LIGHT;
        setSystemTheme(newSystemTheme);
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      }
      // Legacy browsers
      else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error("Error setting up system theme listener:", error);
    }
  }, []);

  // Toggle between light and dark (skips auto)
  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      if (prevMode === THEME_MODES.AUTO) {
        // If in auto, toggle based on current applied theme
        return appliedTheme === THEMES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
      }
      return prevMode === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    });
  }, [appliedTheme]);

  // Set specific theme mode (light, dark, or auto)
  const setThemeModeValue = useCallback((newMode) => {
    if (Object.values(THEME_MODES).includes(newMode)) {
      setThemeMode(newMode);
    } else {
      console.warn(`Invalid theme mode: ${newMode}. Using auto mode.`);
      setThemeMode(THEME_MODES.AUTO);
    }
  }, []);

  // Set to auto mode
  const setAutoMode = useCallback(() => {
    setThemeMode(THEME_MODES.AUTO);
  }, []);

  // Reset theme (clear preference and use auto)
  const resetTheme = useCallback(() => {
    safeLocalStorage.removeItem(THEME_STORAGE_KEY);
    setThemeMode(THEME_MODES.AUTO);
  }, [safeLocalStorage]);

  // Check if currently in auto mode
  const isAutoMode = useMemo(() => themeMode === THEME_MODES.AUTO, [themeMode]);

  // Check if dark mode is active (regardless of how it was set)
  const isDarkMode = useMemo(() => appliedTheme === THEMES.DARK, [appliedTheme]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      // Current mode (light, dark, auto)
      themeMode,
      // Actually applied theme (light or dark)
      theme: appliedTheme,
      // Convenience booleans
      isDarkMode,
      isAutoMode,
      // System preference
      systemTheme,
      // Actions
      toggleTheme,
      setThemeMode: setThemeModeValue,
      setAutoMode,
      resetTheme,
      // Constants for external use
      THEMES,
      THEME_MODES,
    }),
    [
      themeMode,
      appliedTheme,
      isDarkMode,
      isAutoMode,
      systemTheme,
      toggleTheme,
      setThemeModeValue,
      setAutoMode,
      resetTheme,
    ]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
