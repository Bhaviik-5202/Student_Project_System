import { createContext } from "react";

/**
 * Constants for available themes
 */
export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

/**
 * Constants for theme modes
 */
export const THEME_MODES = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
};

/**
 * Context object for theme state
 */
export const ThemeContext = createContext(null);
