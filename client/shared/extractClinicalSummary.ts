// client/shared/extractClinicalSummary.ts
import type { ClinicalSummary } from "./clinicalSchema";

const DEGREE_PATTERNS = [
  /third[-\s]degree burn?/i,
  /second[-\s]degree burn?/i,
  /first[-\s]degree burn?/i,
];

const SEVERITY_WORDS = ["mild", "moderate", "severe", "critical"];

const LOCATIONS = [
  "left arm",
  "right arm",
  "left leg",
  "right leg",
  "face",
  "torso",
  "chest",
  "back",
  "abdomen",
];

export function extractClinicalSummary(transcript: string): ClinicalSummary {
  const text = transcript.toLowerCase();

  // diagnosis: explicit degree burns, but handle ambiguity
  let diagnosis: string | null = null;
  const foundDegrees = DEGREE_PATTERNS
    .map((p) => text.match(p)?.[0])
    .filter(Boolean) as string[];

  if (foundDegrees.length === 1) {
    diagnosis = foundDegrees[0]; // clear
  } else if (foundDegrees.length > 1) {
    diagnosis = null; // ambiguous → force doctor to decide
  }

  const location =
    LOCATIONS.find((loc) => text.includes(loc)) ?? null;

  const severity =
    SEVERITY_WORDS.find((w) => text.includes(w)) ?? null;

  const durationMatch = text.match(
    /for (\d+)\s+(day|days|week|weeks|month|months)/,
  );
  const duration = durationMatch ? durationMatch[0] : null;

  let treatment: string | null = null;
  const treatMatch = text.match(
    /(prescribe|start|give)\s+([a-z0-9\s]+?)(\.|\?|,|$)/i,
  );
  if (treatMatch) {
    treatment = treatMatch[2].trim();
  }

  return {
    diagnosis,
    location,
    severity,
    treatment,
    duration,
  };
}
