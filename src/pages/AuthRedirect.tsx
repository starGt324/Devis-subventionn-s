import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Get user role from unsafe metadata (set during signup)
      const role = user.unsafeMetadata?.role as string;
      
      // Redirect based on role
      if (role === "provider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    }
  }, [isLoaded, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthRedirect;
