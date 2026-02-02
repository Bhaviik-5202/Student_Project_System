import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

// Demo credentials for testing
const DEMO_CREDENTIALS = Object.freeze({
  "admin@university.edu": { password: "admin123", role: "admin", name: "Admin User" },
  "faculty@university.edu": { password: "faculty123", role: "faculty", name: "Faculty Member" },
  "student@university.edu": { password: "student123", role: "student", name: "Student User" },
});

// Token expiry time (24 hours in milliseconds)
const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000;

// Refresh warning time (1 hour before expiry)
const TOKEN_REFRESH_WARNING = 60 * 60 * 1000;

// Storage keys
const STORAGE_KEYS = Object.freeze({
  TOKEN: "auth_token",
  USER: "user",
  TIMESTAMP: "token_timestamp",
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiringSoon, setSessionExpiringSoon] = useState(false);

  // Safe localStorage wrapper (memoized)
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
    []
  );

  // Check if token is expired
  const isTokenExpired = useCallback((tokenTimestamp) => {
    if (!tokenTimestamp) return true;
    const now = Date.now();
    return now - tokenTimestamp > TOKEN_EXPIRY_TIME;
  }, []);

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    safeLocalStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiringSoon(false);
  }, [safeLocalStorage]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = safeLocalStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = safeLocalStorage.getItem(STORAGE_KEYS.USER);
        const tokenTimestamp = safeLocalStorage.getItem(STORAGE_KEYS.TIMESTAMP);

        if (token && storedUser && tokenTimestamp) {
          const timestamp = parseInt(tokenTimestamp, 10);

          // Check if token is expired
          if (isTokenExpired(timestamp)) {
            console.warn("Token expired, clearing auth data");
            clearAuthData();
            toast.error("Your session has expired. Please login again.");
          } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);

            // Check if session is expiring soon
            const timeRemaining = TOKEN_EXPIRY_TIME - (Date.now() - timestamp);
            if (timeRemaining <= TOKEN_REFRESH_WARNING) {
              setSessionExpiringSoon(true);
            }
          }
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

  // Login
  const login = useCallback(async (email, password, role) => {
    try {
      setIsLoading(true);

      // Input validation
      if (!email || !password) {
        return { success: false, message: "Email and password are required" };
      }

      // Simulate API delay
      await new Promise((res) => setTimeout(res, 1000));

      // Check demo credentials
      let userRole = role;
      let userName = email.split("@")[0].replace(/[.-]/g, " ");

      if (DEMO_CREDENTIALS[email]) {
        const expected = DEMO_CREDENTIALS[email];
        // Check password OR role mismatch
        if (password !== expected.password || (role && role !== expected.role)) {
          return { success: false, message: "Invalid email, password, or role" };
        }
        userRole = expected.role;
        userName = expected.name;
      } else if (!role) {
        return { success: false, message: "Role is required for non-demo accounts" };
      }

      const timestamp = Date.now();
      const userData = {
        id: timestamp,
        email,
        role: userRole,
        name: userName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`,
        createdAt: new Date().toISOString(),
      };

      const token = `mock-jwt-${timestamp}-${btoa(email)}`;

      // Store auth data
      safeLocalStorage.setItem("auth_token", token);
      safeLocalStorage.setItem("user", JSON.stringify(userData));
      safeLocalStorage.setItem("token_timestamp", timestamp.toString());

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData, token };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || "Login failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(
    (showMessage = true) => {
      clearAuthData();
      if (showMessage) {
        toast.success("Logged out successfully");
      }
    },
    [clearAuthData]
  );

  // Register
  const register = useCallback(async (email, password, name, role) => {
    try {
      setIsLoading(true);

      // Input validation
      if (!email || !password || !name || !role) {
        return { success: false, message: "All fields are required" };
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, message: "Invalid email format" };
      }

      // Password validation
      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" };
      }

      // Simulate API delay
      await new Promise((res) => setTimeout(res, 1000));

      // Check if email already exists (demo only)
      if (DEMO_CREDENTIALS[email]) {
        return { success: false, message: "Email already registered" };
      }

      const timestamp = Date.now();
      const userData = {
        id: timestamp,
        email,
        role,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        createdAt: new Date().toISOString(),
      };

      const token = `mock-jwt-${timestamp}-${btoa(email)}`;

      // Store auth data
      safeLocalStorage.setItem("auth_token", token);
      safeLocalStorage.setItem("user", JSON.stringify(userData));
      safeLocalStorage.setItem("token_timestamp", timestamp.toString());

      setUser(userData);
      setIsAuthenticated(true);
      setSessionExpiringSoon(false);

      toast.success(`Welcome, ${name}! Your account has been created.`);
      return { success: true, user: userData, token };
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: error.message || "Registration failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update user profile
  const updateUser = useCallback((updates) => {
    try {
      if (!user) {
        return { success: false, message: "No user logged in" };
      }

      const updatedUser = { ...user, ...updates, updatedAt: new Date().toISOString() };
      safeLocalStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast.success("Profile updated successfully");
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update user error:", error);
      return { success: false, message: "Failed to update user profile" };
    }
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => user?.role === role, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles) => {
      if (!user?.role || !Array.isArray(roles)) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  // Refresh session (extend token validity)
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

  // Get session time remaining
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

  // Memoize context value to prevent unnecessary re-renders
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
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
