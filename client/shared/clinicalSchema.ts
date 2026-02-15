// client/shared/clinicalSchema.ts
export interface ClinicalSummary {
  diagnosis: string | null;
  location: string | null;
  severity: string | null;
  treatment: string | null;
  duration: string | null;
}
