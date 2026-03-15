import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import toast from "react-hot-toast";

import { LOCAL_STORAGE_KEYS } from "../utils/constants";
import authService from "../services/authService";

/**
 * Authentication Context for managing user sessions and permissions
 */
const AuthContext = createContext(null);

// Token expiry configuration
const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000;
const TOKEN_REFRESH_WARNING = 60 * 60 * 1000;

const STORAGE_KEYS = Object.freeze({
  TOKEN: LOCAL_STORAGE_KEYS.TOKEN,
  USER: LOCAL_STORAGE_KEYS.USER,
  USER_ROLE: LOCAL_STORAGE_KEYS.USER_ROLE,
  REFRESH_TOKEN: LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
  TIMESTAMP: "token_timestamp",
});

/**
 * Custom hook to access authentication state and methods
 * @throws {Error} If used outside of AuthProvider
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * AuthProvider component that wraps the application and provides auth state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiringSoon, setSessionExpiringSoon] = useState(false);

  /**
   * Safe localStorage wrapper with error handling
   */
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
      clear: () => {
        try {
          Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
          });
          return true;
        } catch (error) {
          console.error("Error clearing localStorage:", error);
          return false;
        }
      },
    }),
    [],
  );

  /**
   * Check if the authentication token has expired
   * @param {number} tokenTimestamp - The timestamp when the token was issued
   * @returns {boolean} True if expired
   */
  const isTokenExpired = useCallback((tokenTimestamp) => {
    if (!tokenTimestamp) return true;
    const now = Date.now();
    return now - tokenTimestamp > TOKEN_EXPIRY_TIME;
  }, []);

  /**
   * Clear all authentication data from state and storage
   */
  const clearAuthData = useCallback(() => {
    safeLocalStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiringSoon(false);
  }, [safeLocalStorage]);

  /**
   * Initialize authentication status on mount
   */
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = safeLocalStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = safeLocalStorage.getItem(STORAGE_KEYS.USER);
        const tokenTimestamp = safeLocalStorage.getItem(STORAGE_KEYS.TIMESTAMP);

        const isAuthPage = ["/login", "/register"].includes(
          window.location.pathname,
        );

        if (token && storedUser && tokenTimestamp) {
          const timestamp = parseInt(tokenTimestamp, 10);
          if (isTokenExpired(timestamp)) {
            if (!isAuthPage) {
              console.warn("Token expired, clearing auth data");
              clearAuthData();
              toast.error("Your session has expired. Please login again.");
            }
          } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
            const timeRemaining = TOKEN_EXPIRY_TIME - (Date.now() - timestamp);
            if (timeRemaining <= TOKEN_REFRESH_WARNING) {
              setSessionExpiringSoon(true);
            }
          }
        } else if (!isAuthPage) {
          clearAuthData();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [clearAuthData, isTokenExpired, safeLocalStorage]);

  /**
   * Log into the application
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Status of the login attempt
   */
  const login = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }
      const res = await authService.login(email, password);
      if (res.success) {
        const { user, token } = res.data;
        setUser(user);
        setIsAuthenticated(true);
        safeLocalStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
        return { success: true, user, token };
      } else {
        return { success: false, message: res.message || "Login failed" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  }, [safeLocalStorage]);

  /**
   * Log out from the application
   * @param {boolean} showMessage - Whether to display a logout toast
   */
  const logout = useCallback(
    (showMessage = true) => {
      clearAuthData();
      if (showMessage) {
        toast.success("Logged out successfully");
      }
    },
    [clearAuthData],
  );

  /**
   * Register a new user account
   * @param {Object} formData - New user data
   * @returns {Promise<Object>} Status of the registration attempt
   */
  const register = useCallback(async (formData) => {
    try {
      setIsLoading(true);
      const res = await authService.register(formData);
      if (res.success) {
        toast.success("Registration successful! Please login.");
        return { success: true, data: res.data };
      } else {
        return {
          success: false,
          message: res.message || "Registration failed",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || "Registration failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update the current user's locally stored profile data
   * @param {Object} updates - Attributes to update
   * @returns {Object} Updated status and user data
   */
  const updateUser = useCallback(
    (updates) => {
      try {
        if (!user) {
          return { success: false, message: "No user logged in" };
        }

        const updatedUser = {
          ...user,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        safeLocalStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(updatedUser),
        );
        setUser(updatedUser);

        toast.success("Profile updated successfully");
        return { success: true, user: updatedUser };
      } catch (error) {
        console.error("Update user error:", error);
        return { success: false, message: "Failed to update user profile" };
      }
    },
    [user, safeLocalStorage],
  );

  /**
   * Check if the authenticated user has a specific role
   * @param {string} role - The role to check for
   * @returns {boolean} True if user has the role
   */
  const hasRole = useCallback((role) => user?.role === role, [user]);

  /**
   * Check if the authenticated user has any of the specified roles
   * @param {string[]} roles - Array of roles to check against
   * @returns {boolean} True if user has any of the roles
   */
  const hasAnyRole = useCallback(
    (roles) => {
      if (!user?.role || !Array.isArray(roles)) return false;
      return roles.includes(user.role);
    },
    [user],
  );

  /**
   * Extend the current session duration
   * @returns {Object} Session refresh status
   */
  const refreshSession = useCallback(() => {
    try {
      if (!user || !isAuthenticated) {
        return { success: false, message: "No active session to refresh" };
      }

      const newTimestamp = Date.now();
      safeLocalStorage.setItem(STORAGE_KEYS.TIMESTAMP, newTimestamp.toString());
      setSessionExpiringSoon(false);

      toast.success("Session refreshed successfully");
      return { success: true };
    } catch (error) {
      console.error("Session refresh error:", error);
      return { success: false, message: "Failed to refresh session" };
    }
  }, [user, isAuthenticated, safeLocalStorage]);

  /**
   * Calculate session time remaining in milliseconds
   * @returns {number} Time remaining
   */
  const getSessionTimeRemaining = useCallback(() => {
    try {
      const tokenTimestamp = safeLocalStorage.getItem(STORAGE_KEYS.TIMESTAMP);
      if (!tokenTimestamp) return 0;

      const timestamp = parseInt(tokenTimestamp, 10);
      const elapsed = Date.now() - timestamp;
      const remaining = TOKEN_EXPIRY_TIME - elapsed;

      return Math.max(0, remaining);
    } catch (error) {
      console.error("Error getting session time:", error);
      return 0;
    }
  }, [safeLocalStorage]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      sessionExpiringSoon,
      login,
      logout,
      register,
      updateUser,
      hasRole,
      hasAnyRole,
      refreshSession,
      getSessionTimeRemaining,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      sessionExpiringSoon,
      login,
      logout,
      register,
      updateUser,
      hasRole,
      hasAnyRole,
      refreshSession,
      getSessionTimeRemaining,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
