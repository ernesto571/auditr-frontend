import { Routes, Route, Navigate} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AuthListener from "./hooks/AuthListener";
import { useAuthStore } from "./store/AuthStore";
import type React from "react";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import History from "./pages/History";
import SavedReport from "./pages/SavedReport";
import ProfilePage from "./pages/ProfilePage";

interface RouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { user, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!user) {
      toast.error("Sign in to view this page.");
      return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


function App() {


  return (
    <>
      <AuthListener />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/saved-reports" element={<ProtectedRoute><SavedReport /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0a0a08",
            color: "#f2f0e8",
            borderRadius: "0px",
            border: "1px solid #f2f0e8",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.78rem",
            letterSpacing: "0.05em",
            padding: "10px 16px",
          },
          success: {
            iconTheme: { primary: "#1a5c35", secondary: "#f2f0e8" },
          },
          error: {
            iconTheme: { primary: "#c0392b", secondary: "#f2f0e8" },
          },
        }}
      />
    </>
  );
}

export default App;