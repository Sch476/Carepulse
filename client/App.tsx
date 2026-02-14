import "./global.css";
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SelectRole from "./pages/SelectRole";
import Dashboard from "./pages/Dashboard";
import Burnout from "./pages/hospital/Burnout";
import Transcribe from "./pages/hospital/Transcribe";
import Medicine from "./pages/insurance/Medicine";
import Claims from "./pages/insurance/Claims";
import Reports from "./pages/insurance/Reports";
import NotFound from "./pages/NotFound";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

// Component that redirects based on role or to role selection
function DashboardRedirect() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const role = user?.publicMetadata?.role as string | undefined;

  // If no role, redirect to role selection
  if (!role) {
    return <Navigate to="/select-role" replace />;
  }

  // Redirect based on role
  if (role === "hospital") {
    return <Navigate to="/hospital/burnout" replace />;
  } else if (role === "insurance") {
    return <Navigate to="/insurance/medicine" replace />;
  }

  // Fallback to dashboard
  return <Dashboard />;
}

// Clerk provider wrapper with navigation
function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      appearance={{
        variables: {
          colorPrimary: "hsl(222.2 47.4% 11.2%)",
        },
      }}
    >
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login/*" element={<Login />} />
          <Route path="/sign-up/*" element={<SignUp />} />

          {/* Role selection - Protected but no role required */}
          <Route
            path="/select-role"
            element={
              <ProtectedRoute>
                <SelectRole />
              </ProtectedRoute>
            }
          />

          {/* Dashboard with role-based redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardRedirect />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Hospital Routes - Protected for hospital role */}
          <Route
            path="/hospital/burnout"
            element={
              <ProtectedRoute allowedRoles={["hospital"]}>
                <DashboardLayout>
                  <Burnout />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/transcribe"
            element={
              <ProtectedRoute allowedRoles={["hospital"]}>
                <DashboardLayout>
                  <Transcribe />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Insurance Routes - Protected for insurance role */}
          <Route
            path="/insurance/medicine"
            element={
              <ProtectedRoute allowedRoles={["insurance"]}>
                <DashboardLayout>
                  <Medicine />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/insurance/claims"
            element={
              <ProtectedRoute allowedRoles={["insurance"]}>
                <DashboardLayout>
                  <Claims />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/insurance/reports"
            element={
              <ProtectedRoute allowedRoles={["insurance"]}>
                <DashboardLayout>
                  <Reports />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProviderWithRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
