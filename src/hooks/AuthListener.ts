// AuthListener.tsx
import { useEffect } from "react";
import { useAuthStore } from "../store/AuthStore";

export default function AuthListener() {
  const { fetchProfile, user } = useAuthStore();

  useEffect(() => {
    if (user) return; // already have user, skip
    const load = async () => {
      try {
        await fetchProfile(); // calls getSession() from Better Auth client
      } catch (err) {
        console.error("Not authenticated", err);
      }
    };
    load();
  }, []);

  return null;
}