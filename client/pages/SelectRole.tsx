import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stethoscope, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "hospital" | "insurance";

export default function SelectRole() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // If user already has a role, redirect them
  if (isLoaded && user?.publicMetadata?.role) {
    const role = user.publicMetadata.role as string;
    if (role === "hospital") {
      navigate("/hospital/burnout", { replace: true });
    } else if (role === "insurance") {
      navigate("/insurance/medicine", { replace: true });
    }
    return null;
  }

  const handleSubmit = async () => {
    if (!selectedRole || !user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      
      const response = await fetch("/api/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to set role");
      }

      // Reload user to get updated metadata
      await user.reload();

      // Redirect based on role
      if (selectedRole === "hospital") {
        navigate("/hospital/burnout", { replace: true });
      } else {
        navigate("/insurance/medicine", { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl shadow-primary/10 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-1 pt-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Stethoscope className="text-primary-foreground w-7 h-7" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to CarePulse!</CardTitle>
          <CardDescription>
            Hi {user?.firstName || "there"}! Please select your portal to continue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid gap-4 p-8">
          <div
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              selectedRole === "hospital"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-slate-100 hover:border-primary/50 hover:bg-slate-50",
            )}
            onClick={() => setSelectedRole("hospital")}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                selectedRole === "hospital"
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 leading-none mb-1">
                Hospital Portal
              </p>
              <p className="text-xs text-slate-500">
                For physicians, staff & hospital administrators
              </p>
            </div>
            {selectedRole === "hospital" && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          <div
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer",
              selectedRole === "insurance"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-slate-100 hover:border-primary/50 hover:bg-slate-50",
            )}
            onClick={() => setSelectedRole("insurance")}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                selectedRole === "insurance"
                  ? "bg-primary text-primary-foreground"
                  : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-900 leading-none mb-1">
                Insurance Portal
              </p>
              <p className="text-xs text-slate-500">
                For claims processing, reports & medicine lookup
              </p>
            </div>
            {selectedRole === "insurance" && (
              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </CardContent>
        
        <CardFooter className="pb-10 px-8">
          <Button
            className="w-full h-12 text-md font-bold rounded-xl gap-2 transition-all active:scale-[0.98]"
            disabled={!selectedRole || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                Continue to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
