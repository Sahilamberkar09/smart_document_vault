import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount (via cookie)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiRequest("/auth/profile", "GET");
        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest("/auth/login", "POST", { email, password });
    setUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const data = await apiRequest("/auth/register", "POST", {
      name,
      email,
      password,
    });
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", "POST");
    } catch (err) {
      console.error("Logout error", err);
    }
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
