import { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";

export const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const mockUsers = {
        admin: {
          id: 1,
          name: "Admin User",
          email: "admin@university.edu",
          role: "admin",
          avatar: null,
        },
        faculty: {
          id: 2,
          name: "Dr. Sarah Johnson",
          email: "faculty@university.edu",
          role: "faculty",
          avatar: null,
        },
        student: {
          id: 3,
          name: "John Smith",
          email: "student@university.edu",
          role: "student",
          avatar: null,
        },
      };

      if (
        (email === "admin@university.edu" &&
          password === "admin123" &&
          role === "admin") ||
        (email === "faculty@university.edu" &&
          password === "faculty123" &&
          role === "faculty") ||
        (email === "student@university.edu" &&
          password === "student123" &&
          role === "student")
      ) {
        const userData = mockUsers[role];
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        toast.success("Login successful! Welcome back.");
        return { success: true, user: userData };
      } else {
        toast.error("Invalid credentials. Please try again.");
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
