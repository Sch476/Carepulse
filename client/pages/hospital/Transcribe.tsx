// client/pages/hospital/Transcribe.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

import { extractClinicalSummary } from "@/shared/extractClinicalSummary";
import type { ClinicalSummary } from "@/shared/clinicalSchema";

type SpeechRecognitionType =
  | (SpeechRecognition & { continuous?: boolean; interimResults?: boolean })
  | null;

const getSpeechRecognition = (): SpeechRecognitionType => {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionCtor =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionCtor) return null;

  const recognition = new SpeechRecognitionCtor();
  recognition.lang = "en-US";
  recognition.continuous = true;
  recognition.interimResults = true;

  return recognition as SpeechRecognitionType;
};

export default function VoiceTranscribe() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionType>(null);
  const fullTextRef = useRef<string>("");

  const [summary, setSummary] = useState<ClinicalSummary>({
    diagnosis: null,
    location: null,
    severity: null,
    treatment: null,
    duration: null,
  });

  // Initialize SpeechRecognition once
  useEffect(() => {
    const recognition = getSpeechRecognition();

    if (!recognition) {
      setIsSupported(false);
      return;
    }

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = fullTextRef.current;
      let interimText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript + " ";
        } else {
          interimText += transcript;
        }
      }

      fullTextRef.current = finalText;
      setTranscribedText((finalText + " " + interimText).trim());
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        toast.error(
          "Microphone permission was blocked. Open the app in a normal browser tab and allow mic access."
        );
      } else if (event.error === "network") {
        toast.error(
          "Speech service network error. This often happens in Codespaces; try running locally."
        );
      } else {
        toast.error(
          `Voice recognition error: ${event.error || "Unknown error"}`
        );
      }

      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
  }, []);

  // Fake “recording progress” animation while recording
  useEffect(() => {
    if (!isRecording) {
      setProgress(0);
      return;
    }

    let progressValue = 0;
    const interval = setInterval(() => {
      progressValue += 5;
      if (progressValue > 100) progressValue = 10;
      setProgress(progressValue);
    }, 300);

    return () => clearInterval(interval);
  }, [isRecording]);

  // Recompute "important words" summary whenever transcript changes
  useEffect(() => {
    if (!transcribedText) {
      setSummary({
        diagnosis: null,
        location: null,
        severity: null,
        treatment: null,
        duration: null,
      });
      return;
    }

    const s = extractClinicalSummary(transcribedText);
    setSummary(s);
  }, [transcribedText]);

  const handleStartRecording = () => {
    if (!recognitionRef.current) {
      toast.error("This browser does not support voice transcription.");
      setIsSupported(false);
      return;
    }

    if (isRecording) return;

    try {
      fullTextRef.current = transcribedText ? transcribedText + " " : "";
      recognitionRef.current.start();
      setIsRecording(true);
      toast.success("Listening…");
    } catch (err: any) {
      console.error("Error starting recognition:", err);
      if (err.name === "InvalidStateError") {
        toast.error("Recognition is already running. Try stopping first.");
      } else {
        toast.error("Unable to start recording.");
      }
    }
  };

  const handleStopRecording = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsRecording(false);
      setProgress(100);
    } catch (err) {
      console.error("Error stopping recognition:", err);
    }
  };

  const handleReset = () => {
    fullTextRef.current = "";
    setTranscribedText("");
    setProgress(0);
    setIsRecording(false);
  };

  const handleCopy = async () => {
    if (!transcribedText) {
      toast.message("Nothing to copy yet.");
      return;
    }
    try {
      await navigator.clipboard.writeText(transcribedText);
      toast.success("Transcription copied to clipboard.");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleSave = () => {
    if (!transcribedText) {
      toast.message("No transcription to save.");
      return;
    }
    // Here you can send both transcribedText and summary to your backend
    toast.success("Transcription saved (stub).");
  };

  const handleSummarize = () => {
    if (!transcribedText) {
      toast.message("Transcribe something first.");
      return;
    }
    // Stub for later LLM integration
    toast.success("Summarization triggered (stub).");
  };

  const handleClinicalNote = () => {
    if (!transcribedText) {
      toast.message("Transcribe something first.");
      return;
    }
    // Stub for later clinical note generation
    toast.success("Clinical note generation triggered (stub).");
  };

  return (
    <div className="flex justify-center px-4 py-8">
      <Card className="max-w-3xl w-full shadow-lg border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Voice Transcription
              </CardTitle>
              <CardDescription>
                Tap the mic, speak, and we&apos;ll convert your voice into text
                and key clinical details.
              </CardDescription>
            </div>
            <Badge variant={isRecording ? "destructive" : "outline"}>
              {isRecording ? "Recording" : "Idle"}
            </Badge>
          </div>
          {!isSupported && (
            <p className="mt-2 text-xs text-red-500">
              Your browser does not support the Web Speech API. Try using a
              Chromium-based browser.
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Progress value={progress} className="flex-1" />
            <span className="text-xs text-muted-foreground w-12 text-right">
              {Math.round(progress)}%
            </span>
          </div>

          <Textarea
            className="min-h-[220px] resize-y"
            placeholder="Doctor's speech transcription will appear here..."
            value={transcribedText}
            onChange={(e) => {
              fullTextRef.current = e.target.value;
              setTranscribedText(e.target.value);
            }}
          />

          <div className="mt-2 border rounded-md p-3 bg-slate-50 space-y-1">
            <p className="text-sm font-semibold">Extracted clinical details</p>
            <p className="text-xs text-muted-foreground">
              Auto-filled from speech; doctor should review and edit before
              saving.
            </p>

            <div className="grid gap-2 sm:grid-cols-2 text-sm mt-2">
              <div>
                <span className="font-medium">Diagnosis: </span>
                <span>{summary.diagnosis ?? "—"}</span>
              </div>
              <div>
                <span className="font-medium">Location: </span>
                <span>{summary.location ?? "—"}</span>
              </div>
              <div>
                <span className="font-medium">Severity: </span>
                <span>{summary.severity ?? "—"}</span>
              </div>
              <div>
                <span className="font-medium">Duration: </span>
                <span>{summary.duration ?? "—"}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="font-medium">Treatment: </span>
                <span>{summary.treatment ?? "—"}</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {!isRecording ? (
              <Button
                size="sm"
                onClick={handleStartRecording}
                disabled={!isSupported}
              >
                <Mic className="mr-2 h-4 w-4" />
                Start
              </Button>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={handleStopRecording}
              >
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={isRecording && !!transcribedText}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>

            <Button size="sm" variant="outline" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSummarize}
              disabled={!transcribedText}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Summarize
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleClinicalNote}
              disabled={!transcribedText}
            >
              <MessageSquareQuote className="mr-2 h-4 w-4" />
              Clinical Note
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
