import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export type Role = "hospital" | "insurance" | null;

export interface AuthUser {
  id: string;
  email: string | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  fullName: string | null | undefined;
  imageUrl: string;
  role: Role;
}

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  // Get role from Clerk public metadata
  const role = (user?.publicMetadata?.role as Role) || null;

  const logout = useCallback(async () => {
    await signOut();
    navigate("/login");
  }, [signOut, navigate]);

  // Get the redirect path based on role
  const getRoleBasedRedirect = useCallback((): string => {
    switch (role) {
      case "hospital":
        return "/hospital/burnout";
      case "insurance":
        return "/insurance/medicine";
      default:
        return "/dashboard";
    }
  }, [role]);

  const authUser: AuthUser | null = isSignedIn && user
    ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        imageUrl: user.imageUrl,
        role,
      }
    : null;

  return {
    user: authUser,
    isLoading: !isLoaded,
    isSignedIn: isSignedIn ?? false,
    logout,
    getRoleBasedRedirect,
  };
}

// Re-export for backward compatibility
export { useAuth as default };
