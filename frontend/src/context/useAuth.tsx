import { useContext } from "react";
import { AuthContext } from "../context/auth-context";

/**
 * Custom hook to access authentication context
 * @returns {UserAuth} Authentication context value
 * @throws {Error} If used outside of AuthProvider
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
