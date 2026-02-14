import { SignUp, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useClerkAuth();

  // If already signed in, redirect to role selection (new users won't have a role yet)
  if (isLoaded && isSignedIn) {
    return <Navigate to="/select-role" replace />;
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
              Join CarePulse Today
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Create your account to access AI-powered healthcare management tools
              for hospitals and insurance companies.
            </p>
          </div>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <p className="text-sm text-slate-600">Physician burnout detection</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <p className="text-sm text-slate-600">AI-powered claim analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">✓</span>
              </div>
              <p className="text-sm text-slate-600">Voice transcription for notes</p>
            </div>
          </div>
        </div>

        {/* Right side - Clerk SignUp */}
        <div className="flex justify-center">
          <SignUp
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
            path="/sign-up"
            signInUrl="/login"
            forceRedirectUrl="/select-role"
          />
        </div>
      </div>
    </div>
  );
}
