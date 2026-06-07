import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signIn, signUp, signOut, getSession } from "../lib/authClient";

interface FormData {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isGoogleLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  formData: FormData;
  signup: (data: FormData) => Promise<void>;
  login: (data: FormData) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setFormData: (data: Partial<FormData>) => void;
  clearError: () => void;
}

const initialFormData: FormData = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      formData: initialFormData,
      isGoogleLoading: false,
      isInitialized: false,
      error: null,

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await signUp.email({
            email: data.email,
            password: data.password,
            name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
          });
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          const session = await getSession();
          set({ user: (session.data?.user as User) ?? null, isLoading: false, isInitialized: true });
        } catch (err) {
          set({ error: "Signup failed. Please try again.", isLoading: false });
        }
      },

      login: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error } = await signIn.email({
            email: data.email,
            password: data.password,
          });
          if (error) {
            set({ error: error.message, isLoading: false });
            return;
          }
          set({ user: (authData?.user as User) ?? null, isLoading: false, isInitialized: true });
        } catch (err) {
          set({ error: "Login failed. Please try again.", isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut();
          set({ user: null, isLoading: false, isInitialized: true });
        } catch (err) {
          set({ user: null, isLoading: false });
        }
      },

      fetchProfile: async () => {
        const { isInitialized, isLoading } = get();
        if (isInitialized || isLoading) return;

        set({ isLoading: true });
        try {
          const { data } = await getSession();
          set({ user: (data?.user as User) || null, isInitialized: true, isLoading: false });
        } catch (err) {
          set({ user: null, isInitialized: true, isLoading: false });
        }
      },

      loginWithGoogle: async () => {
        set({ isGoogleLoading: true, error: null });
        try {
          const { error } = await signIn.social({
            provider: "google",
            callbackURL: `${window.location.origin}/auth/callback`,
          });
          if (error) set({ error: error.message, isGoogleLoading: false });
        } catch (err) {
          set({ error: "Google login failed.", isGoogleLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      setFormData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);