import { Link, useLocation } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Search,
  Activity,
  Mic,
  LogOut,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  // Get role from Clerk public metadata
  const role = user?.publicMetadata?.role as "hospital" | "insurance" | undefined;

  const hospitalMenu = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Physician Burnout", icon: Activity, path: "/hospital/burnout" },
    { name: "Voice Transcribe", icon: Mic, path: "/hospital/transcribe" },
  ];

  const insuranceMenu = [
    { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Medicine Finder", icon: Search, path: "/insurance/medicine" },
    { name: "Claim Review", icon: ShieldCheck, path: "/insurance/claims" },
    { name: "Report Analysis", icon: FileText, path: "/insurance/reports" },
  ];

  const menu = role === "hospital" ? hospitalMenu : insuranceMenu;

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/login" });
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.slice(0, 2).toUpperCase();
    }
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex flex-col w-64 h-screen bg-card border-r border-border sticky top-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Stethoscope className="text-primary-foreground w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-primary">
            CarePulse
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
            {role === "hospital" ? "Hospital Portal" : "Insurance Portal"}
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info section */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
              {getInitials()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName || user?.firstName || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
