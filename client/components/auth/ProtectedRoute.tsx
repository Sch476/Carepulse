import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("hospital" | "insurance")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user } = useUser();
  const location = useLocation();

  // Show loading state while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not signed in
  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if allowedRoles specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.publicMetadata?.role as string | undefined;
    
    if (!userRole || !allowedRoles.includes(userRole as "hospital" | "insurance")) {
      // Redirect to appropriate dashboard based on role
      const redirectPath = userRole === "hospital" 
        ? "/hospital/burnout" 
        : userRole === "insurance" 
          ? "/insurance/medicine" 
          : "/dashboard";
      
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}
