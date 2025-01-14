/**
 * Represents a user's basic information
 */
export type User = {
  name: string;
  email: string;
};

/**
 * Represents the authentication context state and methods
 */
export type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
