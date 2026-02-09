import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  ArrowUpRight,
  User,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Claim {
  id: string;
  patient: string;
  amount: string;
  status: "Pending" | "Approved" | "Denied" | "Flagged";
  date: string;
  diagnosis: string;
}

const initialClaims: Claim[] = [
  {
    id: "CLM-001",
    patient: "Sarah Miller",
    amount: "$1,250.00",
    status: "Pending",
    date: "Oct 24, 2023",
    diagnosis: "Type 2 Diabetes",
  },
  {
    id: "CLM-002",
    patient: "James Wilson",
    amount: "$4,800.00",
    status: "Approved",
    date: "Oct 23, 2023",
    diagnosis: "Knee Arthroscopy",
  },
  {
    id: "CLM-003",
    patient: "Emily Chen",
    amount: "$850.00",
    status: "Denied",
    date: "Oct 22, 2023",
    diagnosis: "Routine Wellness",
  },
  {
    id: "CLM-004",
    patient: "Michael Brown",
    amount: "$12,400.00",
    status: "Flagged",
    date: "Oct 22, 2023",
    diagnosis: "Acute Cardiac Care",
  },
  {
    id: "CLM-005",
    patient: "Robert Garcia",
    amount: "$2,100.00",
    status: "Pending",
    date: "Oct 21, 2023",
    diagnosis: "Respiratory Infection",
  },
  {
    id: "CLM-006",
    patient: "Lisa Thompson",
    amount: "$650.00",
    status: "Approved",
    date: "Oct 20, 2023",
    diagnosis: "Dental Surgery",
  },
];

export default function ClaimReview() {
  const [claims, setClaims] = useState(initialClaims);
  const [search, setSearch] = useState("");

  const updateStatus = (id: string, status: Claim["status"]) => {
    setClaims(claims.map((c) => (c.id === id ? { ...c, status } : c)));
    toast.success(`Claim ${id} status updated to ${status}`);
  };

  const getStatusBadge = (status: Claim["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            {status}
          </Badge>
        );
      case "Denied":
        return (
          <Badge
            variant="destructive"
            className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50"
          >
            {status}
          </Badge>
        );
      case "Flagged":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Claim Review Panel
          </h1>
          <p className="text-muted-foreground">
            Manage and adjudicate incoming insurance claims with AI assistance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
          <Button className="gap-2 bg-primary">
            Process All
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search claims by ID or patient name..."
              className="pl-10 bg-slate-50/50 border-slate-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-sm font-medium text-slate-500">
              Total:{" "}
              <span className="text-slate-900 font-bold">{claims.length}</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="text-sm font-medium text-slate-500">
              Pending:{" "}
              <span className="text-primary font-bold">
                {claims.filter((c) => c.status === "Pending").length}
              </span>
            </div>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[120px] font-bold">Claim ID</TableHead>
                <TableHead className="font-bold">Patient Name</TableHead>
                <TableHead className="font-bold">Diagnosis</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {claims
                .filter(
                  (c) =>
                    c.id.toLowerCase().includes(search.toLowerCase()) ||
                    c.patient.toLowerCase().includes(search.toLowerCase()),
                )
                .map((claim) => (
                  <TableRow
                    key={claim.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="font-mono text-xs font-bold text-slate-500">
                      {claim.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-900">
                          {claim.patient}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 font-medium">
                      {claim.diagnosis}
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {claim.date}
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">
                      {claim.amount}
                    </TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          onClick={() => updateStatus(claim.id, "Approved")}
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => updateStatus(claim.id, "Denied")}
                          title="Deny"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => updateStatus(claim.id, "Flagged")}
                          title="Flag for Review"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
