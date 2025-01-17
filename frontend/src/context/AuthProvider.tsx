/**
 * @fileoverview Authentication context provider and related types for managing user authentication state
 */

import { useState, useEffect, useContext, createContext } from "react";
import { User, UserAuth } from "./types";
import {
  loginUser,
  checkAuthStatus,
  logoutUser,
  signupUser,
} from "../helpers/api-communicators";

const AuthContext = createContext<UserAuth | null>(null);

/**
 * Authentication Provider Component
 * Manages authentication state and provides auth-related methods to children
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const data = await checkAuthStatus();
        if (data) {
          setUser({ email: data.email, name: data.name });
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    }
    checkStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name, email, password);
    if (data) {
      setUser({ email: data.email, name: data.name });
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    await logoutUser();
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload();
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access authentication context
 * @returns {UserAuth} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => useContext(AuthContext);
