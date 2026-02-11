import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function HospitalReports() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleUpload = () => {
    setIsUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 5;
      setUploadProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setAnalysis({
          hospital: "City General Hospital",
          date: "Oct 25, 2023",
          fields: [
            { label: "Patient ID", value: "PT-9921", status: "correct" },
            {
              label: "Admission Date",
              value: "Oct 12, 2023",
              status: "correct",
            },
            { label: "Total Charges", value: "$12,450.00", status: "warning" },
            {
              label: "Diagnosis Code",
              value: "ICD-10 J45.909",
              status: "correct",
            },
          ],
          warnings: [
            "Inconsistent billing for ICU stay (Room 402)",
            "Missing physician signature for discharge summary",
          ],
          needsReview: true,
        });
        toast.success("Analysis complete");
      }
    }, 100);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hospital Report Analysis
          </h1>
          <p className="text-muted-foreground">
            Extract and validate data from hospital reports using AI.
          </p>
        </div>
        <Badge
          variant="outline"
          className="px-4 py-1 text-sm font-medium border-slate-200"
        >
          <Clock className="w-4 h-4 mr-2 text-primary" />
          Last report: 2 hours ago
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Upload Report</CardTitle>
              <CardDescription>
                Upload PDF or text files for instant analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="group border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-white transition-all cursor-pointer"
                onClick={handleUpload}
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-bold text-slate-900 mb-1">
                  Click to upload
                </p>
                <p className="text-xs text-slate-500">or drag and drop</p>
                <p className="text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                  PDF, TXT, DOCX
                </p>
              </div>

              {isUploading && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span>Analyzing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-white/50 border-t border-slate-100 rounded-b-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldAlert className="w-3 h-3" />
                Secure HIPAA compliant processing
              </div>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 line-clamp-1">
                      St. Mary Medical Report #{i * 120}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      Oct {20 - i}, 2023
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {analysis ? (
            <>
              <Card className="border-none shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>
                      {analysis.hospital} • {analysis.date}
                    </CardDescription>
                  </div>
                  {analysis.needsReview && (
                    <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-none font-bold py-1">
                      Human Review Needed
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {analysis.fields.map((field: any) => (
                      <div
                        key={field.label}
                        className="p-4 rounded-xl border border-slate-100 flex flex-col gap-1"
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {field.label}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">
                            {field.value}
                          </span>
                          {field.status === "correct" ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Detected Warnings ({analysis.warnings.length})
                    </h4>
                    {analysis.warnings.map((warning: string, i: number) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-sm text-amber-800 font-medium"
                      >
                        {warning}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-slate-100 p-6 flex justify-between gap-4">
                  <Button variant="outline" className="gap-2">
                    <Search className="w-4 h-4" />
                    Inspect Source
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
                    >
                      Reject
                    </Button>
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                      Approve Report
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="border-none shadow-sm p-6 bg-slate-900 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold">AI Confidence Score: 92%</p>
                    <p className="text-sm text-white/60">
                      The high billing amount was flagged due to exceeding
                      normal parameters for this diagnosis group.
                    </p>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
              <FileText className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">
                Upload a report to see analysis results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
