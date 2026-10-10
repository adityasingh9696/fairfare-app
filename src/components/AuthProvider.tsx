"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "traveller" | "admin" | null;

interface AuthContextType {
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  role: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    // Load auth state from local storage for demo persistence
    const savedRole = localStorage.getItem("demo_role") as UserRole;
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);

  const login = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole) {
      localStorage.setItem("demo_role", newRole);
    }
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem("demo_role");
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
