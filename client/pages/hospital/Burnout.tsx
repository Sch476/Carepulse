import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const workloadData = [
  { day: "Mon", patients: 12, hours: 8, stress: 45 },
  { day: "Tue", patients: 15, hours: 9.5, stress: 62 },
  { day: "Wed", patients: 18, hours: 11, stress: 85 },
  { day: "Thu", patients: 14, hours: 9, stress: 55 },
  { day: "Fri", patients: 22, hours: 12, stress: 92 },
  { day: "Sat", patients: 8, hours: 5, stress: 30 },
  { day: "Sun", patients: 6, hours: 4, stress: 20 },
];

export default function PhysicianBurnout() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Physician Burnout Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor clinician workload and mental well-being in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter Staff
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Patients Today
            </CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 font-medium inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +12%
              </span>{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Avg. Shift Hours
            </CardTitle>
            <Clock className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.2h</div>
            <p className="text-xs text-muted-foreground">
              Target: 8.5h per shift
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-destructive/5 border border-destructive/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-destructive">
              Burnout Risk
            </CardTitle>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">High</div>
            <p className="text-xs text-destructive/70">
              Score: 78/100 (Critical)
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Staff Wellness
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground">Engagement score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Workload Distribution</CardTitle>
            <CardDescription>
              Patient volume vs. clinical hours over the past week.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={workloadData}>
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted))"
                />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Stress Indicators</CardTitle>
            <CardDescription>
              Daily stress levels based on EHR activity.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--muted))"
                />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="stress"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>Burnout Hotspots</CardTitle>
          <CardDescription>
            Departments with highest risk factors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                dept: "Emergency Room",
                risk: "Critical",
                score: 88,
                trend: "up",
              },
              { dept: "ICU", risk: "High", score: 76, trend: "up" },
              {
                dept: "Pediatrics",
                risk: "Moderate",
                score: 45,
                trend: "down",
              },
              { dept: "Surgery", risk: "High", score: 72, trend: "stable" },
            ].map((item) => (
              <div
                key={item.dept}
                className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-2 h-10 rounded-full",
                      item.risk === "Critical"
                        ? "bg-destructive"
                        : item.risk === "High"
                          ? "bg-orange-500"
                          : "bg-emerald-500",
                    )}
                  />
                  <div>
                    <p className="font-bold text-slate-900">{item.dept}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {item.score}/100
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      item.risk === "Critical"
                        ? "destructive"
                        : item.risk === "High"
                          ? "outline"
                          : "secondary"
                    }
                  >
                    {item.risk}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
