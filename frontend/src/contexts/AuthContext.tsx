"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, setAuthToken, removeAuthToken } from "@/lib/api";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol_nombre: "Cliente" | "Soporte" | "Administrador";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      // Only try to refresh if we have a token
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await authAPI.me();
      setUser(data.user);
    } catch (error) {
      // If token is invalid, remove it
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setAuthToken(data.token); // Store the JWT token
    setUser(data.user);
  };

  const register = async (nombre: string, email: string, password: string) => {
    const data = await authAPI.register(nombre, email, password);
    setAuthToken(data.token); // Store the JWT token
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if the API call fails, we should still clear the local token
      console.error("Logout error:", error);
    } finally {
      removeAuthToken(); // Remove the JWT token
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

