export type TimelineEventType = 'lab' | 'visit' | 'medication' | 'hospital' | 'symptom' | 'imaging';

export interface ExtractedDataPoint {
  label: string;
  value: string;
  status?: 'normal' | 'attention' | 'changed' | 'info';
  previousValue?: string;
}

export interface TimelineEvent {
  id: string;
  date: string; // e.g. "Aug 28, 2026"
  isoDate: string; // "2026-08-28"
  monthGroup: string; // "August 2026"
  type: TimelineEventType;
  title: string;
  subtitle: string;
  badgeText?: string;
  summary: string;
  extractedInfo: ExtractedDataPoint[];
  sourceDocumentId: string;
  sourceDocumentTitle: string;
  sourceDocumentType: string;
  sourceDate: string;
  notes?: string[];
  confirmed?: boolean;
}

export type RecordCategory = 'prescriptions' | 'labs' | 'visits' | 'hospital' | 'imaging' | 'photos';

export interface HealthDocument {
  id: string;
  title: string;
  category: RecordCategory;
  date: string;
  facility: string;
  provider: string;
  extractedEventsCount: number;
  fileType: 'PDF' | 'Image' | 'EHR';
  contentSummary: string;
  fileSize: string;
  keyDataPoints: string[];
  fullPreviewText: string;
  tags: string[];
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribingDoctor: string;
  status: 'active' | 'changed' | 'discontinued';
  purpose: string;
  source: string;
  refillsLeft: number;
}

export interface LabResult {
  id: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'elevated' | 'decreased' | 'borderline';
  date: string;
  previousValue?: string;
  previousDate?: string;
  sourceDocument: string;
  category: 'Lipid' | 'Metabolic' | 'Hematology' | 'Inflammatory';
}

export interface SourceCitation {
  id: string;
  title: string;
  date: string;
  type: string;
  documentId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  text?: string;
  sections?: {
    headline?: string;
    documented?: { title: string; items: string[]; icon?: string }[];
    observed?: { title: string; items: string[]; icon?: string }[];
    discuss?: string[];
  };
  sources?: SourceCitation[];
  actionType?: 'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom';
}

export interface DoctorBriefing {
  whyImHere: string;
  recentChanges: { category: string; description: string; source: string; highlight?: boolean }[];
  currentMedications: { name: string; dose: string; frequency: string; status: string; purpose: string }[];
  relevantHistory: { period: string; summary: string; episodes: string[] }[];
  recentReports: { test: string; finding: string; date: string; status: 'normal' | 'attention' }[];
  questionsToAsk: { question: string; rationale: string }[];
  conciseSummary60s: string;
}

export interface PatientProfile {
  name: string;
  age: number;
  dob: string;
  gender: string;
  bloodType: string;
  allergies: string[];
  pcp: string;
  facility: string;
  emergencyContact: string;
  organizePercentage: number;
  totalTimelineEvents: number;
  totalDocuments: number;
  totalMedications: number;
  totalLabResults: number;
}
