import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";

/**
 * Theme Context for managing light/dark mode and system preferences
 */
const ThemeContext = createContext(null);

/**
 * User-selectable theme modes
 */
const THEME_MODES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
});

/**
 * Actual UI theme states
 */
const THEMES = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

const THEME_STORAGE_KEY = "app_theme_mode";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

/**
 * Hook to access and control the application theme
 * @returns {Object} Theme state and control methods
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export { THEMES, THEME_MODES };
export default ThemeContext;

/**
 * Provider component for theme management logic
 */
export const ThemeProvider = ({ children }) => {
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
    [],
  );

  /**
   * Detect current system color scheme preference
   */
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

  const [systemTheme, setSystemTheme] = useState(getSystemTheme());

  const [themeMode, setThemeMode] = useState(() => {
    const savedMode = safeLocalStorage.getItem(THEME_STORAGE_KEY);
    if (savedMode && Object.values(THEME_MODES).includes(savedMode)) {
      return savedMode;
    }
    return THEME_MODES.AUTO;
  });

  const appliedTheme = useMemo(() => {
    if (themeMode === THEME_MODES.AUTO) {
      return systemTheme;
    }
    return themeMode === THEME_MODES.DARK ? THEMES.DARK : THEMES.LIGHT;
  }, [themeMode, systemTheme]);

  /**
   * Effect to apply theme classes and attributes to the document root
   */
  useEffect(() => {
    try {
      safeLocalStorage.setItem(THEME_STORAGE_KEY, themeMode);
      const root = document.documentElement;

      if (appliedTheme === THEMES.DARK) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }

      root.setAttribute("data-theme", appliedTheme);
      root.setAttribute("data-theme-mode", themeMode);

      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          appliedTheme === THEMES.DARK ? "#0f172a" : "#ffffff",
        );
      }
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }, [appliedTheme, themeMode, safeLocalStorage]);

  /**
   * Effect to listen for changes in system color scheme
   */
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia(DARK_MODE_QUERY);
      const handleChange = (e) => {
        setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error("Error setting up system theme listener:", error);
    }
  }, []);

  /**
   * Toggle between light and dark modes
   */
  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      if (prevMode === THEME_MODES.AUTO) {
        return appliedTheme === THEMES.LIGHT
          ? THEME_MODES.DARK
          : THEME_MODES.LIGHT;
      }
      return prevMode === THEME_MODES.LIGHT
        ? THEME_MODES.DARK
        : THEME_MODES.LIGHT;
    });
  }, [appliedTheme]);

  /**
   * Manually set the theme mode
   * @param {string} newMode - 'light', 'dark', or 'auto'
   */
  const setThemeModeValue = useCallback((newMode) => {
    if (Object.values(THEME_MODES).includes(newMode)) {
      setThemeMode(newMode);
    } else {
      console.warn(`Invalid theme mode: ${newMode}. Using auto mode.`);
      setThemeMode(THEME_MODES.AUTO);
    }
  }, []);

  const setAutoMode = useCallback(() => {
    setThemeMode(THEME_MODES.AUTO);
  }, []);

  const resetTheme = useCallback(() => {
    safeLocalStorage.removeItem(THEME_STORAGE_KEY);
    setThemeMode(THEME_MODES.AUTO);
  }, [safeLocalStorage]);

  const isAutoMode = useMemo(() => themeMode === THEME_MODES.AUTO, [themeMode]);
  const isDarkMode = useMemo(() => appliedTheme === THEMES.DARK, [appliedTheme]);

  const contextValue = useMemo(
    () => ({
      themeMode,
      theme: appliedTheme,
      isDarkMode,
      isAutoMode,
      systemTheme,
      toggleTheme,
      setThemeMode: setThemeModeValue,
      setAutoMode,
      resetTheme,
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
    ],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
