import { useState, useEffect } from "react";
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
  Mic,
  Square,
  RotateCcw,
  Copy,
  Save,
  Sparkles,
  MessageSquareQuote,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function VoiceTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 50);
    } else {
      setProgress(0);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate transcription result
      const mockText =
        "Patient presents with persistent cough and mild fever. Recommending immediate blood work and chest X-ray. Vital signs are stable but monitoring for respiratory distress. Prescription for ibuprofen 400mg issued.";
      setTranscribedText((prev) => prev + (prev ? " " : "") + mockText);
      toast.success("Transcription complete");
    } else {
      setIsRecording(true);
      toast.info("Listening...");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcribedText);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          AI Voice Transcription
        </h1>
        <p className="text-muted-foreground">
          Reduce click fatigue by dictating clinical notes directly.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-1 border-none shadow-sm flex flex-col items-center justify-center p-8 text-center bg-primary/5 border border-primary/10">
          <div className="relative mb-6">
            <div
              className={`absolute -inset-4 bg-primary/20 rounded-full blur-xl transition-all duration-500 ${isRecording ? "opacity-100 scale-125 animate-pulse" : "opacity-0 scale-100"}`}
            />
            <Button
              size="lg"
              className={`w-24 h-24 rounded-full shadow-xl transition-all active:scale-95 ${isRecording ? "bg-destructive hover:bg-destructive" : "bg-primary hover:bg-primary/90"}`}
              onClick={toggleRecording}
            >
              {isRecording ? (
                <Square className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </Button>
          </div>
          <h3 className="text-xl font-bold mb-2">
            {isRecording ? "Recording..." : "Start Dictation"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {isRecording
              ? "Transcribing your voice in real-time"
              : "Click the microphone to begin dictating your notes"}
          </p>
          {isRecording && (
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Audio Level</span>
                <span>Active</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </Card>

        <Card className="md:col-span-2 border-none shadow-sm flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transcribed Text</CardTitle>
              <CardDescription>
                Review and edit your clinical notes.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="w-3 h-3" />
              AI Enhanced
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="relative flex-1 min-h-[300px]">
              <Textarea
                placeholder="Transcribed text will appear here..."
                className="w-full h-full min-h-[300px] resize-none p-4 text-lg border-slate-100 focus-visible:ring-primary/20 leading-relaxed"
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
              />
              {!transcribedText && !isRecording && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 pointer-events-none">
                  <MessageSquareQuote className="w-12 h-12 mb-2" />
                  <p>No text yet</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t border-slate-100 p-4 flex justify-between gap-2">
            <Button
              variant="ghost"
              className="gap-2"
              onClick={() => setTranscribedText("")}
              disabled={!transcribedText}
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={copyToClipboard}
                disabled={!transcribedText}
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button className="gap-2" disabled={!transcribedText}>
                <Save className="w-4 h-4" />
                Save Note
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100">
          <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Recently Transcribed
          </CardTitle>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {[
            {
              id: "1",
              date: "2 mins ago",
              preview: "Patient exhibits symptoms of acute bronchitis...",
              duration: "1:45",
            },
            {
              id: "2",
              date: "15 mins ago",
              preview:
                "Follow-up on post-operative recovery for knee replacement...",
              duration: "3:12",
            },
            {
              id: "3",
              date: "1 hour ago",
              preview: "Routine checkup for patient with type 2 diabetes...",
              duration: "0:58",
            },
          ].map((note) => (
            <div
              key={note.id}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 line-clamp-1">
                    {note.preview}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {note.date} • {note.duration}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 group-hover:text-primary"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
