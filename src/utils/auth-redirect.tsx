// pages/AuthRedirect.tsx
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

const AuthRedirect = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(true);

useEffect(() => {
  if (!isLoaded || !user) return;

  const registerUser = async () => {
    const clerkId = user.id;

    try {
      // 1️⃣ Check if user exists in backend
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${clerkId}/role`);
      const backendRole = res.data.role;

      // ✅ User exists → redirect to dashboard
      if (backendRole === "provider") navigate("/provider/dashboard", { replace: true });
      else navigate("/client/dashboard", { replace: true });

    } catch (err: any) {
      if (err.response?.status === 404) {
        // ❌ User not found → redirect to /sign-up to choose role
        console.log("User not in backend yet → redirect to /sign-up");
        navigate("/sign-up", { replace: true });
      } else {
        console.error("Error checking backend user:", err);
        navigate("/", { replace: true }); // fallback
      }
    } finally {
      setIsRedirecting(false);
    }
  };

  registerUser();
}, [isLoaded, user, navigate]);


  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Redirecting...</p>
      </div>
    );
  }

  return null;
};

export default AuthRedirect;
