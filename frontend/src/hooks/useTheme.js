import { useContext } from "react";
import { ThemeContext } from "../context/themeContextUtils";

/**
 * Custom hook to access theme state and methods
 * @throws {Error} If used outside of ThemeProvider
 * @returns {Object} Theme context value
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined || context === null) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default useTheme;
