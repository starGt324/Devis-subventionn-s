import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import NotFound from "@/pages/NotFound";

// Pages
import Index from "@/pages/Index";
import ClientForm from "@/pages/ClientForm"; // Remove if unused (form is in Index)
import ClientDashboard from "@/pages/ClientDashboard";
import PrestatairePortal from "@/pages/PrestatairePortal";
import ProviderDashboard from "@/pages/ProviderDashboard";
import QuoteComparison from "@/pages/QuoteComparison";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import AuthRedirect from "@/pages/AuthRedirect";
import ProtectedRoute from "./components/ProtectedRoute"; // Unused? Remove if so
import ProtectedLayout from "./components/ProtectedRoute"; // Assuming this is ProtectedLayout.tsx
import SsoCallback from "./pages/SsoCallback";

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

const queryClient = new QueryClient();

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/auth-redirect" element={<AuthRedirect />} />
            
            <Route path="/sign-in/sso-callback" element={<SsoCallback />} />
            {/* Protected routes — Client */}
            <Route element={<ProtectedLayout allowedRoles={["client"]} />}>
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/comparison" element={<QuoteComparison />} />
              <Route path="/client/request-quote" element={<ClientForm />} /> {/* Remove if unused */}
            </Route>

            {/* Protected routes — Provider */}
            <Route element={<ProtectedLayout allowedRoles={["provider"]} />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/prestataire" element={<PrestatairePortal />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;