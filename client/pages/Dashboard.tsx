import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  TrendingUp,
  Clock,
  ShieldCheck,
  FileText,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "hospital") {
    return <HospitalOverview />;
  }

  return <InsuranceOverview />;
}

function HospitalOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Hospital Dashboard
        </h1>
        <p className="text-muted-foreground">
          Operational overview and clinical performance metrics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Patients",
            value: "1,284",
            change: "+14%",
            icon: Users,
          },
          { title: "Avg. Wait Time", value: "24m", change: "-8%", icon: Clock },
          {
            title: "Clinical Efficiency",
            value: "92%",
            change: "+2%",
            icon: Activity,
          },
          {
            title: "Pending Notes",
            value: "18",
            change: "Action required",
            icon: FileText,
            warning: true,
          },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`w-4 h-4 ${stat.warning ? "text-destructive" : "text-primary"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${stat.warning ? "text-destructive font-medium" : "text-muted-foreground"}`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute right-0 bottom-0 opacity-10">
            <Activity className="w-48 h-48" />
          </div>
          <CardHeader>
            <CardTitle>Physician Well-being</CardTitle>
            <CardDescription className="text-primary-foreground/70">
              Critical burnout risk detected in ER department.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-black">78% Risk</div>
            <Button asChild variant="secondary" className="font-bold">
              <Link to="/hospital/burnout">Review Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Activity className="w-6 h-6" />
            </div>
            <CardTitle>Voice-to-Text Clinical Notes</CardTitle>
            <CardDescription>
              Reduce EHR burden by using AI-powered transcription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 font-bold group-hover:border-primary/50"
            >
              <Link to="/hospital/transcribe">
                Open Transcriber
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsuranceOverview() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Insurance Command Center
        </h1>
        <p className="text-muted-foreground">
          Claims processing, policy analytics and risk management.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Claims",
            value: "8,432",
            change: "+5%",
            icon: ShieldCheck,
          },
          {
            title: "Pending Review",
            value: "142",
            change: "42 Urgent",
            icon: AlertCircle,
            warning: true,
          },
          {
            title: "Payout Total",
            value: "$4.2M",
            change: "+12%",
            icon: TrendingUp,
          },
          {
            title: "Fraud Detection",
            value: "99.8%",
            change: "Secure",
            icon: Activity,
          },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`w-4 h-4 ${stat.warning ? "text-amber-500" : "text-primary"}`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {stat.value}
              </div>
              <p
                className={`text-xs ${stat.warning ? "text-amber-600 font-bold" : "text-muted-foreground"}`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-sm md:col-span-1 bg-white hover:shadow-md transition-shadow group">
          <CardHeader>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Activity className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Medicine Finder</CardTitle>
            <CardDescription>
              Therapeutic alternatives & generic lookups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 font-bold group-hover:border-emerald-500/50"
            >
              <Link to="/insurance/medicine">
                Search Medicines
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm md:col-span-1 bg-white hover:shadow-md transition-shadow group">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Claim Review</CardTitle>
            <CardDescription>
              Adjudicate pending insurance claims.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 font-bold group-hover:border-primary/50"
            >
              <Link to="/insurance/claims">
                Review Claims
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm md:col-span-1 bg-white hover:shadow-md transition-shadow group">
          <CardHeader>
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mb-2 group-hover:bg-slate-900 group-hover:text-white transition-all">
              <FileText className="w-6 h-6" />
            </div>
            <CardTitle className="text-lg">Report Analysis</CardTitle>
            <CardDescription>
              AI validation of hospital report data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 font-bold group-hover:border-slate-900/50"
            >
              <Link to="/insurance/reports">
                Analyze Reports
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
