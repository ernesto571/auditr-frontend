import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import { Loader } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { fetchProfile, error } = useAuthStore();

  useEffect(() => {
    fetchProfile()
      .then(() => navigate("/dashboard", { replace: true }))
      .catch(() => navigate("/login", { replace: true }));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
          <Loader className="size-10 animate-spin orange" />
          <p className="font-jet black mt-3">Authentication failed. Redirecting...</p>;
      </div>
    )
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
          <Loader className="size-10 animate-spin orange" />
          <p className="font-jet black mt-3"> Redirecting to dashboard...</p>;
      </div>
    )
  }

}