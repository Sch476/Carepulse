import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

/**
 * Component to redirect users based on their role after login
 * Use this on the /dashboard route to auto-redirect to role-specific pages
 */
export function RoleRedirect() {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.publicMetadata?.role as string | undefined;

  // Redirect based on role
  switch (role) {
    case "hospital":
      return <Navigate to="/hospital/burnout" replace />;
    case "insurance":
      return <Navigate to="/insurance/medicine" replace />;
    default:
      // If no role set, show the general dashboard
      // You might want to redirect to a role selection page instead
      return null;
  }
}
