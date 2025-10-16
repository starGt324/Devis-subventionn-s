import { Outlet, Navigate, useSearchParams, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface ProtectedLayoutProps {
  allowedRoles?: string[];
}

const ProtectedLayout = ({ allowedRoles }: ProtectedLayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get("role")?.toUpperCase() || user?.unsafeMetadata?.role;

  useEffect(() => {
    if (!isLoaded || !user) return;

    const fetchOrRedirect = async () => {
      const clerkId = user.id;

      try {
        // 1️⃣ Try fetching user role from backend
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${clerkId}/role`);
        if (res.data.role) {
          setUserRole(res.data.role);
        } else {
          // Role missing in backend → redirect to sign-up
          navigate("/sign-up", { replace: true });
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          // 2️⃣ User exists in Clerk but not in backend → new user, redirect to sign-up
          console.log("New user detected (in Clerk, not in backend) → redirecting to /sign-up");
          navigate("/sign-up", { replace: true });
        } else {
          console.error("Failed to fetch user role:", err);
          setUserRole(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrRedirect();
  }, [isLoaded, user, navigate]);

  if (!isLoaded || loading) return <div>Loading...</div>;

  const isAuthorized = !allowedRoles || (userRole && allowedRoles.includes(userRole));

  return (
    <>
      <SignedIn>
        {isAuthorized ? <Outlet /> : <Navigate to="/" replace />}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ProtectedLayout;
