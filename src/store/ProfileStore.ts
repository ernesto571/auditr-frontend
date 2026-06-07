import toast from "react-hot-toast";
import axios from "../lib/axios"
import { create } from "zustand";
import { useAuthStore } from "./AuthStore";

interface FormData {
  first_name?: string;
  last_name?: string;
}

interface Profile {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
    last_login: string ;
}
interface ProfileState {
    profile: Profile | null;
    formData: FormData;
    profileLoading: boolean;
    profileUpdating: boolean;
    profileDeleting: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: FormData) => Promise<void>;
    deleteAccount: () => Promise<void>;
    setFormData: (data: Partial<FormData>) => void;
    clearProfile: () => void;
}

const initialFormData: FormData = { first_name:"" , last_name:"" };

export const useProfileStore = create<ProfileState>((set) => ({
    profile: null,
    formData: initialFormData,
    profileLoading: false,
    profileUpdating: false,
    profileDeleting: false,
    error: null,
    clearProfile: () => set({ profile: null, profileLoading: false }),

    fetchProfile: async () => {
        console.log("📡 fetchProfile: sending request...");
        set({ profileLoading: true });
        try {
            const res = await axios.get("/user/profile");
            const data = res.data.user;
            console.log("🟢 fetchProfile: backend response", data);
            set({ profile: data, formData: { first_name: data.first_name ?? "", last_name: data.last_name ?? "" }, profileLoading: false });
        } catch (err: any) {
            console.error("🔴 fetchProfile failed:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ profileLoading: false });
            if (err.response?.status === 401 || err.response?.status === 404) set({ profile: null });
            throw err;
        }
    },

    updateProfile: async (data) => {
        console.log("📡 updateProfile: starting...", data);
        set({  profileUpdating: true, error: null });

        try {
            const res = await axios.patch("/user/profile", data)
            const update = res.data.user;
            console.log("🟢 fetchProfile: backend response", data);
            set({ profile: update, profileUpdating: false, });
            // update in authstore too
            useAuthStore.setState((state) => ({
                user: state.user
                  ? { ...state.user, name: `${update.first_name} ${update.last_name}` }
                  : null,
            }));
            toast.success("Profile Updated")
        } catch (err : any) {
           const message = err.response?.data?.message
           console.error("❌ runAudit: error", message);
            set({ error: message, profileUpdating: false });
        }

    },

    deleteAccount: async () => {
        console.log("📡 deleteAccount: sending request...");
        set({ profileDeleting: true });
        try {
            const res = await axios.delete("/user/delete");
            console.log("✅ Account deleted", res.data.deletedUser);
            set({ profile: null, profileDeleting: false });
            window.location.href = "/";
        } catch (err: any) {
            console.error("🔴 deleteAccount failed:", {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message,
            });
            set({ profileDeleting: false });
            toast.error("Failed to delete account.");
        }
    },

    setFormData: (data) => {
        set((state) => ({ formData: { ...state.formData, ...data } }));
    }
}))