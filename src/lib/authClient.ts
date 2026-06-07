import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.DEV 
      ? "http://localhost:3001" 
      : import.meta.env.VITE_BACKEND_URL,
  fetchOptions: {
      credentials: "include",
  }
  
});

export const { signIn, signUp, signOut, getSession } = authClient;