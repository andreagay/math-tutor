import { createContext } from "react";
import { UserAuth } from "./types";

// Initialize auth context with null - will be populated by AuthProvider
export const AuthContext = createContext<UserAuth | null>(null);
