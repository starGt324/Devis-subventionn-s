// pages/SsoCallback.tsx (or wherever fits your structure)
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Optional, if you need custom logic post-callback

export default function SsoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("SSO Callback loaded"); // For debugging
  }, []);

  // Optional: Add custom logic after auth completes (e.g., navigate based on query params)
  // But let <AuthenticateWithRedirectCallback /> handle the default redirect

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-gray-600 mt-2">Please wait while we finish signing you in.</p>
      </div>
      <AuthenticateWithRedirectCallback
        // Optional props: Customize redirect after success
        afterSignInUrl="/auth-redirect" // Or "/" or "/client/dashboard"
        afterSignUpUrl="/auth-redirect" // Matches your force_redirect_url
      />
    </div>
  );
}