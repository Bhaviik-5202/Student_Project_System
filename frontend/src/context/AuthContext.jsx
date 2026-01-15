import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

const AuthContext = createContext(null);

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

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Login function with proper demo credentials
  const login = useCallback(async (email, password, role) => {
    try {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Demo credentials
      const demoCredentials = {
        "admin@university.edu": { password: "admin123", role: "admin" },
        "faculty@university.edu": { password: "faculty123", role: "faculty" },
        "student@university.edu": { password: "student123", role: "student" },
      };

      // Check if email exists in demo credentials
      if (demoCredentials[email]) {
        const expected = demoCredentials[email];

        // For demo purposes, accept if either:
        if (password === expected.password || role === expected.role) {
          const userData = {
            id: Date.now(),
            email,
            role: role || expected.role,
            name: email.split("@")[0].replace(".", " ").replace("-", " "),
            avatar: `https://ui-avatars.com/api/?name=${
              email.split("@")[0]
            }&background=random`,
            token: `mock-jwt-token-${Date.now()}`,
          };

          // Store in localStorage
          localStorage.setItem("auth_token", userData.token);
          localStorage.setItem("user", JSON.stringify(userData));

          // Update state
          setUser(userData);
          setIsAuthenticated(true);

          return {
            success: true,
            user: userData,
            message: "Login successful!",
          };
        }
      }

      // If using demo fill, accept any valid email with demo role
      if (email && password && role) {
        const userData = {
          id: Date.now(),
          email,
          role,
          name: email.split("@")[0].replace(".", " ").replace("-", " "),
          avatar: `https://ui-avatars.com/api/?name=${
            email.split("@")[0]
          }&background=random`,
          token: `mock-jwt-token-${Date.now()}`,
        };

        localStorage.setItem("auth_token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);

        return {
          success: true,
          user: userData,
          message: "Demo login successful!",
        };
      }

      return {
        success: false,
        message: "Invalid credentials or role mismatch",
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  const value = {
    // State
    user,
    isLoading,
    isAuthenticated,

    // Methods
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
