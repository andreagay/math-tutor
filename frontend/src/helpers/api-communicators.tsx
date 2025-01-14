import axios from "axios";

/**
 * Authenticates a user with their email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns The response data from the server
 * @throws Error if login fails (status code != 200)
 */
export const loginUser = async (email: string, password: string) => {
  // Send POST request to login endpoint with credentials
  const response = await axios.post("/users/login", { email, password });
  if (response.status !== 200) {
    throw new Error("Failed to login");
  }
  const data = await response.data;
  return data;
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  // Send POST request to signup endpoint with credentials
  const response = await axios.post("/users/signup", { name, email, password });
  if (response.status !== 201) {
    throw new Error("Failed to signup");
  }
  const data = await response.data;
  return data;
};

/**
 * Checks if the user is currently authenticated
 * @returns The authentication status from the server
 * @throws Error if status check fails (status code != 200)
 */
export const checkAuthStatus = async () => {
  try {
    const response = await axios.get("/users/auth-status");
    if (response.status !== 200) {
      throw new Error("Failed to check auth status");
    }
    const data = await response.data;
    return data;
  } catch (error) {
    // Return null instead of throwing error for 401
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const sendChatRequest = async (message: string) => {
  const response = await axios.post("/chat/new", { message });
  if (response.status !== 200) {
    throw new Error("Unable to send chat request");
  }
  const data = await response.data;
  return data;
};

export const getChatHistory = async () => {
  const response = await axios.get("/chat/all-chats");
  if (response.status !== 200) {
    throw new Error("Unable to send chat history");
  }
  const data = await response.data;
  return data;
};

export const deleteChatHistory = async () => {
  const response = await axios.delete("/chat/delete");
  if (response.status !== 200) {
    throw new Error("Unable to delete chat history");
  }
  const data = await response.data;
  return data;
};

export const logoutUser = async () => {
  const response = await axios.get("/users/logout");
  if (response.status !== 200) {
    throw new Error("Unable to logout user");
  }
  const data = await response.data;
  return data;
};
