import React, { createContext, useCallback, useContext, useState } from "react";
import axios from "axios";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await axios.post<{ token: string }>(
      `${import.meta.env.VITE_SERVER_URL}/auth`,
      { email, password },
    );
    localStorage.setItem("token", response.data.token);
    setToken(response.data.token);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
