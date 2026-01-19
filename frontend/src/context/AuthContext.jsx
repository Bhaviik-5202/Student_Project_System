import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { NotificationProvider } from "./NotificationContext";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProviderInner = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Initialize auth state
  useEffect(() => {
    try {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth init error:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  // Login
  const login = useCallback(async (email, password, role) => {
    try {
      setIsLoading(true);
      await new Promise((res) => setTimeout(res, 1000));

      const demoCredentials = {
        "admin@university.edu": { password: "admin123", role: "admin" },
        "faculty@university.edu": { password: "faculty123", role: "faculty" },
        "student@university.edu": { password: "student123", role: "student" },
      };

      let userRole = role;

      if (demoCredentials[email]) {
        const expected = demoCredentials[email];
        if (password !== expected.password && role !== expected.role) {
          return { success: false, message: "Invalid credentials" };
        }
        userRole = expected.role;
      }

      if (!email || !password || !userRole) {
        return { success: false, message: "Missing credentials" };
      }

      const userData = {
        id: Date.now(),
        email,
        role: userRole,
        name: email.split("@")[0].replace(/[.-]/g, " "),
        avatar: `https://ui-avatars.com/api/?name=${
          email.split("@")[0]
        }&background=random`,
        token: `mock-jwt-${Date.now()}`,
      };

      localStorage.setItem("auth_token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  const hasRole = useCallback((role) => user?.role === role, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }) => {
  return (
    <NotificationProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </NotificationProvider>
  );
};

export default AuthContext;
