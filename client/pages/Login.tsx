import { SignIn, useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export default function Login() {
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { user } = useUser();
  const location = useLocation();

  // Get the redirect path from state or determine by role
  const from = location.state?.from?.pathname;

  // If already signed in, redirect based on role
  if (isLoaded && isSignedIn) {
    const role = user?.publicMetadata?.role as string | undefined;
    
    // If no role set, go to role selection
    if (!role) {
      return <Navigate to="/select-role" replace />;
    }
    
    let redirectTo = from || "/dashboard";
    
    // If no specific redirect, use role-based redirect
    if (!from || from === "/login") {
      switch (role) {
        case "hospital":
          redirectTo = "/hospital/burnout";
          break;
        case "insurance":
          redirectTo = "/insurance/medicine";
          break;
        default:
          redirectTo = "/select-role";
      }
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Stethoscope className="text-primary-foreground w-7 h-7" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-primary">
              CarePulse
            </h1>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              AI-Powered Healthcare Management
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Streamlining operations for hospitals and insurance companies with
              intelligent insights and automated workflows.
            </p>
          </div>
          <div className="flex items-center gap-4 py-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="avatar"
                  />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-600">
              Trusted by <span className="text-primary font-bold">500+</span>{" "}
              medical professionals
            </p>
          </div>
        </div>

        {/* Right side - Clerk SignIn */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-2xl shadow-primary/10 bg-white/80 backdrop-blur-sm border-none",
                headerTitle: "text-2xl font-bold",
                headerSubtitle: "text-slate-500",
                socialButtonsBlockButton: "border-slate-200 hover:bg-slate-50",
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
            routing="path"
            path="/login"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
