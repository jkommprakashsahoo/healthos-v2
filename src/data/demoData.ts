import { TimelineEvent, HealthDocument, Medication, LabResult, PatientProfile, DoctorBriefing } from '../types';

export const initialPatientProfile: PatientProfile = {
  name: "Alex Morgan",
  age: 42,
  dob: "1984-04-14",
  gender: "Male",
  bloodType: "A+",
  allergies: ["Penicillin (mild rash)", "Latex (contact dermatitis)"],
  pcp: "Dr. Sarah Jenkins, MD (Internal Medicine)",
  facility: "Metro Health Pavilion, Suite 402",
  emergencyContact: "Elena Morgan (Spouse) · (555) 234-8901",
  organizePercentage: 87,
  totalTimelineEvents: 16,
  totalDocuments: 8,
  totalMedications: 5,
  totalLabResults: 6,
};

export const initialDocuments: HealthDocument[] = [
  {
    id: "doc-8",
    title: "Comprehensive Metabolic & Lipid Panel",
    category: "labs",
    date: "Aug 28, 2026",
    facility: "Quest Diagnostics Labs #4092",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 3,
    fileType: "PDF",
    fileSize: "1.4 MB",
    contentSummary: "Fasting lipid profile showing marked LDL reduction to 94 mg/dL following statin adjustment; fasting glucose 104 mg/dL (borderline).",
    keyDataPoints: ["Total Cholesterol: 178 mg/dL", "LDL-C: 94 mg/dL", "HDL-C: 52 mg/dL", "Triglycerides: 142 mg/dL", "Fasting Glucose: 104 mg/dL"],
    tags: ["Lipids", "Metabolic", "Blood Chemistry"],
    fullPreviewText: `QUEST DIAGNOSTICS - CLINICAL LABORATORY REPORT
Specimen ID: QD-8849201-B | Date Collected: 08/28/2026 07:45 AM
Patient: Morgan, Alex (DOB: 04/14/1984) | Ordering Physician: Jenkins, Sarah MD

LIPID PANEL (FASTING 12 HRS):
- Total Cholesterol: 178 mg/dL (Ref: <200) [NORMAL - Prev 228 on 05/14]
- Triglycerides: 142 mg/dL (Ref: <150) [NORMAL]
- HDL Cholesterol: 52 mg/dL (Ref: >40) [NORMAL]
- LDL Cholesterol (calc): 94 mg/dL (Ref: <100) [OPTIMAL - Significant 36% drop from 148 mg/dL]

COMPREHENSIVE METABOLIC:
- Fasting Glucose: 104 mg/dL (Ref: 65-99) [BORDERLINE HIGH - Prev 98 mg/dL]
- eGFR: >90 mL/min/1.73m² [NORMAL]
- Serum Creatinine: 0.92 mg/dL (Ref: 0.70-1.30) [NORMAL]
- ALT (SGPT): 24 U/L (Ref: 7-56) [NORMAL]
- AST (SGOT): 21 U/L (Ref: 10-40) [NORMAL]`
  },
  {
    id: "doc-7",
    title: "Internal Medicine Clinical Follow-up Note",
    category: "visits",
    date: "Aug 21, 2026",
    facility: "Metro Health Pavilion - Internal Medicine",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 2,
    fileType: "EHR",
    fileSize: "840 KB",
    contentSummary: "Pre-lab clinical consultation. Evaluated gastrointestinal symptom resolution on Omeprazole 20mg and ordered 6-week post-titration lipid panel.",
    keyDataPoints: ["BP: 122/78 mmHg", "HR: 68 bpm", "BMI: 25.4", "GI symptoms quiescent", "Ordered repeat fasting labs"],
    tags: ["Clinical Note", "PCP", "Routine Follow-up"],
    fullPreviewText: `METRO HEALTH PAVILION - PROGRESS NOTE
Date: 08/21/2026 | Provider: Sarah Jenkins, MD, FACP
Subjective: 42yo male presents for routine follow-up regarding medication tolerance and GERD management. Reports zero heartburn episodes since restarting Omeprazole daily after June ED visit. Tolerating Atorvastatin 20mg without myalgias or muscle weakness.
Objective:
- Vital Signs: BP 122/78 mmHg, HR 68 bpm regular, SpO2 99% on room air, Wt 178 lbs (BMI 25.4).
- Abdomen: Soft, non-tender, no organomegaly, normal active bowel sounds.
Assessment:
1. Pure hypercholesterolemia - stable on Atorvastatin 20mg daily.
2. Gastroesophageal reflux disease without esophagitis - fully controlled on Omeprazole 20mg.
Plan: Ordered routine fasting lipid panel and basic metabolic panel for next week. Follow up in clinic in early September.`
  },
  {
    id: "doc-6",
    title: "Prescription Refill & Titration Order",
    category: "prescriptions",
    date: "Aug 18, 2026",
    facility: "Walgreens Pharmacy #14022",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 1,
    fileType: "PDF",
    fileSize: "520 KB",
    contentSummary: "Active refill authorized for Atorvastatin 20mg oral tablet (Qty 90, 3 refills) and Omeprazole 20mg delayed-release capsule.",
    keyDataPoints: ["Rx #7719204: Atorvastatin 20mg Daily", "Rx #7719205: Omeprazole 20mg Daily", "Refills: 3 remaining"],
    tags: ["Prescription", "Refill", "Pharmacy"],
    fullPreviewText: `ELECTRONIC PRESCRIPTION DISPENSE RECORD
Walgreens Pharmacy #14022 | Dispense Date: 08/18/2026
Patient: Alex Morgan | Rx Number: 7719204-A
- Drug: ATORVASTATIN CALCIUM 20 MG TABLET
- Sig: Take 1 tablet by mouth daily at bedtime
- Quantity: 90 Tablets (90-day supply) | Refills: 3
- Prescriber: Dr. Sarah Jenkins, MD (NPI: 1982839201)
- Previous Strength: 10 MG (titrated upward July 2026)`
  },
  {
    id: "doc-5",
    title: "Emergency Department Clinical Summary",
    category: "hospital",
    date: "Jun 14, 2026",
    facility: "St. Jude Medical Center - Emergency Dept",
    provider: "Dr. Michael Chen, MD (Emergency Medicine)",
    extractedEventsCount: 2,
    fileType: "PDF",
    fileSize: "2.1 MB",
    contentSummary: "Emergency evaluation for acute retrosternal and epigastric discomfort after missed medication while traveling. Acute coronary syndrome ruled out.",
    keyDataPoints: ["Troponin I: <0.01 ng/mL (Negative)", "12-Lead ECG: Normal sinus rhythm", "Diagnosis: Acute Gastroesophageal Reflux Spasm"],
    tags: ["Hospital", "Emergency", "Cardiology Workup"],
    fullPreviewText: `ST. JUDE MEDICAL CENTER - EMERGENCY SUMMARY
Encounter Date: 06/14/2026 21:15 | Discharged: 06/15/2026 01:30
Chief Complaint: Burning chest and upper abdominal discomfort, onset 2 hours post-dinner.
Diagnostic Workup:
- High-sensitivity Troponin: <0.01 ng/mL at 0h and 2h (Rule-out MI negative)
- ECG: Normal sinus rhythm, rate 74 bpm, no ST-elevation or T-wave inversion
- Bedside Upper GI cocktail (Maalox + viscous lidocaine) administered with complete symptom resolution within 15 minutes.
Discharge Instructions: Continue prescribed Omeprazole without interruption. Avoid late heavy meals. Follow up with PCP Dr. Jenkins.`
  },
  {
    id: "doc-4",
    title: "Follow-up Cardiology & Lipid Consult",
    category: "visits",
    date: "Jul 10, 2026",
    facility: "Metro Heart & Vascular Center",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 2,
    fileType: "EHR",
    fileSize: "910 KB",
    contentSummary: "Post-hospital follow up. Reviewed ED findings. Up-titrated Atorvastatin to 20mg daily for optimal cardiovascular risk reduction. Added Vitamin D3 2000 IU.",
    keyDataPoints: ["Increased Atorvastatin to 20mg", "Serum 25-OH Vit D: 22 ng/mL (insufficient)", "Started Vit D3 2000 IU daily"],
    tags: ["Consult", "Lipid Titration", "Prevention"],
    fullPreviewText: `METRO HEALTH PAVILION - CLINICAL CONSULTATION
Date: 07/10/2026 | Provider: Sarah Jenkins, MD
Review of June ED Visit: Review confirms benign GERD flare with non-cardiac chest pain.
Cardiovascular Risk Review: May lipid panel demonstrated LDL 148 mg/dL despite 10mg statin therapy.
Decision: Titrate Atorvastatin from 10mg to 20mg daily.
Lab Review: 25-Hydroxy Vitamin D returned at 22 ng/mL (low). Initiated Cholecalciferol (Vitamin D3) 2000 IU daily.
Follow-up: 6-8 weeks with fasting repeat lipid panel.`
  },
  {
    id: "doc-3",
    title: "Initial Comprehensive Fasting Lipid Panel",
    category: "labs",
    date: "May 14, 2026",
    facility: "Quest Diagnostics Labs #4092",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 2,
    fileType: "PDF",
    fileSize: "1.2 MB",
    contentSummary: "Baseline lipid assessment showing elevated Total Cholesterol (228 mg/dL) and LDL-C (148 mg/dL) on initial 10mg statin dose.",
    keyDataPoints: ["Total Cholesterol: 228 mg/dL (High)", "LDL-C: 148 mg/dL (Elevated)", "HDL: 48 mg/dL", "Fasting Glucose: 98 mg/dL (Normal)"],
    tags: ["Baseline Lab", "Lipids", "Cholesterol"],
    fullPreviewText: `QUEST DIAGNOSTICS - CLINICAL REPORT
Date Collected: 05/14/2026 | Ordering: Dr. Sarah Jenkins, MD
- Total Cholesterol: 228 mg/dL (Ref: <200) [HIGH]
- LDL-C Calculated: 148 mg/dL (Ref: <100) [HIGH]
- HDL-C: 48 mg/dL (Ref: >40) [NORMAL]
- Fasting Blood Sugar: 98 mg/dL (Ref: 65-99) [NORMAL]
- HbA1c: 5.6% (Ref: <5.7%) [NORMAL]`
  },
  {
    id: "doc-2",
    title: "Initial Primary Care Clinical Consultation",
    category: "visits",
    date: "Apr 12, 2026",
    facility: "Metro Health Pavilion",
    provider: "Dr. Sarah Jenkins, MD",
    extractedEventsCount: 2,
    fileType: "EHR",
    fileSize: "760 KB",
    contentSummary: "Initial evaluation for recurrent dyspepsia and cardiovascular risk screening. Initiated Omeprazole 20mg and baseline Atorvastatin 10mg.",
    keyDataPoints: ["Diagnosis: Dyspepsia / GERD", "Started Omeprazole 20mg", "Started Atorvastatin 10mg", "Family history of early CAD noted"],
    tags: ["New Patient", "PCP", "Prescription Start"],
    fullPreviewText: `METRO HEALTH PAVILION - INITIAL CONSULTATION
Date: 04/12/2026 | Provider: Sarah Jenkins, MD
Chief Complaint: 1-month history of post-prandial heartburn and upper stomach acidity.
Family History: Father had MI at age 56.
Plan:
1. Omeprazole 20mg oral daily for 60 days.
2. Atorvastatin 10mg oral daily for primary CAD prevention given lipid profile risk.
3. Fasting lab draw scheduled for May.`
  },
  {
    id: "doc-1",
    title: "Urgent Care Clinical Encounter Note",
    category: "visits",
    date: "Mar 18, 2026",
    facility: "CityHealth Urgent Care - Downtown",
    provider: "Dr. Amanda Ross, DO",
    extractedEventsCount: 1,
    fileType: "PDF",
    fileSize: "610 KB",
    contentSummary: "Initial documented episode of burning epigastric discomfort after meals. OTC antacids recommended and advised to establish PCP.",
    keyDataPoints: ["Symptoms: Heartburn, acid regurgitation", "Advised OTC Famotidine", "Referred to Primary Care Physician"],
    tags: ["Urgent Care", "First Episode", "Symptom"],
    fullPreviewText: `CITYHEALTH URGENT CARE - WALK-IN ENCOUNTER
Date: 03/18/2026 | Provider: Amanda Ross, DO
S: Patient reports intermittent burning discomfort beneath sternum after eating heavy or spicy meals over past 3 weeks. No shortness of breath, no diaphoresis.
O: Abdomen soft, mild epigastric tenderness to deep palpation.
A: Gastroesophageal reflux / Gastric irritation.
P: Trial of OTC Famotidine 20mg PRN. Recommended formal appointment with primary care physician for comprehensive evaluation.`
  }
];

export const initialTimelineEvents: TimelineEvent[] = [
  {
    id: "evt-1",
    date: "Aug 28, 2026",
    isoDate: "2026-08-28",
    monthGroup: "August 2026",
    type: "lab",
    title: "Blood Test",
    subtitle: "CBC + Lipid Profile (Fasting)",
    badgeText: "3 results recorded",
    summary: "Comprehensive metabolic and lipid profile completed at Quest Diagnostics. Key finding: LDL cholesterol improved significantly to 94 mg/dL (target <100 achieved). Fasting glucose slightly elevated at 104 mg/dL.",
    extractedInfo: [
      { label: "LDL Cholesterol", value: "94 mg/dL", status: "normal", previousValue: "148 mg/dL" },
      { label: "Total Cholesterol", value: "178 mg/dL", status: "normal", previousValue: "228 mg/dL" },
      { label: "Fasting Glucose", value: "104 mg/dL", status: "attention", previousValue: "98 mg/dL" }
    ],
    sourceDocumentId: "doc-8",
    sourceDocumentTitle: "Comprehensive Metabolic & Lipid Panel",
    sourceDocumentType: "Lab Report",
    sourceDate: "Aug 28, 2026",
    notes: ["Fasting time: 12 hours", "Significant response to Atorvastatin 20mg dose adjustment", "Doctor appointment scheduled for review"],
    confirmed: true
  },
  {
    id: "evt-2",
    date: "Aug 21, 2026",
    isoDate: "2026-08-21",
    monthGroup: "August 2026",
    type: "visit",
    title: "Doctor Visit",
    subtitle: "General consultation · Dr. Sarah Jenkins",
    badgeText: "2 notes recorded",
    summary: "Routine check-in at Metro Health Pavilion. Evaluated GERD symptom resolution and medication compliance. Ordered repeat 6-week post-titration lab panel.",
    extractedInfo: [
      { label: "Blood Pressure", value: "122/78 mmHg", status: "normal" },
      { label: "Heart Rate", value: "68 bpm", status: "normal" },
      { label: "Symptoms", value: "Zero GERD flare-ups reported", status: "normal" }
    ],
    sourceDocumentId: "doc-7",
    sourceDocumentTitle: "Internal Medicine Clinical Follow-up Note",
    sourceDocumentType: "Doctor Note",
    sourceDate: "Aug 21, 2026",
    notes: ["Patient reported complete adherence to Omeprazole 20mg", "Tolerating Atorvastatin 20mg well without myalgia"],
    confirmed: true
  },
  {
    id: "evt-3",
    date: "Aug 18, 2026",
    isoDate: "2026-08-18",
    monthGroup: "August 2026",
    type: "medication",
    title: "Medication Refill",
    subtitle: "Atorvastatin & Omeprazole refilled",
    badgeText: "2 prescriptions refilled",
    summary: "90-day medication supply filled at Walgreens Pharmacy #14022. Atorvastatin maintained at 20mg tablet daily; Omeprazole maintained at 20mg capsule daily.",
    extractedInfo: [
      { label: "Atorvastatin", value: "20 mg Daily", status: "changed", previousValue: "10 mg" },
      { label: "Omeprazole", value: "20 mg Daily", status: "normal" },
      { label: "Refills Remaining", value: "3 authorized", status: "info" }
    ],
    sourceDocumentId: "doc-6",
    sourceDocumentTitle: "Prescription Refill & Titration Order",
    sourceDocumentType: "Prescription",
    sourceDate: "Aug 18, 2026",
    notes: ["Prescribed by Dr. Sarah Jenkins, MD", "Next refill scheduled for November 2026"],
    confirmed: true
  },
  {
    id: "evt-4",
    date: "Jul 10, 2026",
    isoDate: "2026-07-10",
    monthGroup: "July 2026",
    type: "visit",
    title: "Doctor Follow-up & Lab Review",
    subtitle: "Consultation · Dr. Sarah Jenkins",
    badgeText: "Medication adjusted",
    summary: "Follow-up following June emergency room visit. Dr. Jenkins adjusted Atorvastatin dose upward to 20mg for tighter lipid reduction. Serum Vitamin D checked and found insufficient at 22 ng/mL; added Vitamin D3 2000 IU daily.",
    extractedInfo: [
      { label: "Medication Adjustment", value: "Atorvastatin increased: 10mg → 20mg", status: "changed" },
      { label: "New Supplement", value: "Vitamin D3 2000 IU daily added", status: "changed" },
      { label: "Serum 25-OH Vit D", value: "22 ng/mL (Ref: 30-100)", status: "attention" }
    ],
    sourceDocumentId: "doc-4",
    sourceDocumentTitle: "Follow-up Cardiology & Lipid Consult",
    sourceDocumentType: "Doctor Note",
    sourceDate: "Jul 10, 2026",
    notes: ["Reviewed June hospital ECG and troponin results", "Instructed strict adherence to morning Omeprazole before food"],
    confirmed: true
  },
  {
    id: "evt-5",
    date: "Jun 14, 2026",
    isoDate: "2026-06-14",
    monthGroup: "June 2026",
    type: "hospital",
    title: "Hospital Emergency Visit",
    subtitle: "Emergency consultation · St. Jude Medical Center",
    badgeText: "Acute episode evaluated",
    summary: "Emergency department evaluation for acute retrosternal chest and epigastric discomfort after missed Omeprazole during travel. High-sensitivity Troponin was negative (<0.01 ng/mL) and ECG showed normal sinus rhythm. Benign GERD spasm diagnosed.",
    extractedInfo: [
      { label: "Troponin I", value: "<0.01 ng/mL (Negative)", status: "normal" },
      { label: "12-Lead ECG", value: "Normal Sinus Rhythm (HR 74)", status: "normal" },
      { label: "GI Cocktail", value: "Complete symptom relief in 15m", status: "normal" }
    ],
    sourceDocumentId: "doc-5",
    sourceDocumentTitle: "Emergency Department Clinical Summary",
    sourceDocumentType: "Hospital Record",
    sourceDate: "Jun 14, 2026",
    notes: ["Acute coronary syndrome ruled out", "Attending physician advised prompt follow-up with PCP"],
    confirmed: true
  },
  {
    id: "evt-6",
    date: "Jun 12, 2026",
    isoDate: "2026-06-12",
    monthGroup: "June 2026",
    type: "symptom",
    title: "Symptom Recurrence",
    subtitle: "Severe post-dinner epigastric burning",
    badgeText: "Patient logged",
    summary: "Patient documented recurrence of sharp retrosternal burning and acid taste in mouth after missing 3 consecutive days of Omeprazole during business trip.",
    extractedInfo: [
      { label: "Reported Intensity", value: "7/10 pain scale", status: "attention" },
      { label: "Trigger", value: "Missed Omeprazole x3 days + spicy meal", status: "attention" }
    ],
    sourceDocumentId: "doc-5",
    sourceDocumentTitle: "Emergency Department Clinical Summary",
    sourceDocumentType: "Patient Log",
    sourceDate: "Jun 12, 2026",
    notes: ["Led to emergency visit 2 days later"],
    confirmed: true
  },
  {
    id: "evt-7",
    date: "May 14, 2026",
    isoDate: "2026-06-14",
    monthGroup: "May 2026",
    type: "lab",
    title: "Baseline Lipid & Metabolic Panel",
    subtitle: "Quest Diagnostics · Dr. Sarah Jenkins",
    badgeText: "2 high markers",
    summary: "Initial follow-up blood panel on initial 10mg statin therapy. Showed Total Cholesterol at 228 mg/dL and LDL-C at 148 mg/dL. Fasting glucose was 98 mg/dL (normal) and HbA1c was 5.6%.",
    extractedInfo: [
      { label: "Total Cholesterol", value: "228 mg/dL", status: "attention" },
      { label: "LDL Cholesterol", value: "148 mg/dL", status: "attention" },
      { label: "HDL Cholesterol", value: "48 mg/dL", status: "normal" },
      { label: "Fasting Glucose", value: "98 mg/dL", status: "normal" }
    ],
    sourceDocumentId: "doc-3",
    sourceDocumentTitle: "Initial Comprehensive Fasting Lipid Panel",
    sourceDocumentType: "Lab Report",
    sourceDate: "May 14, 2026",
    notes: ["Showed incomplete lipid reduction on 10mg statin", "Prompted July dose titration to 20mg"],
    confirmed: true
  },
  {
    id: "evt-8",
    date: "Apr 12, 2026",
    isoDate: "2026-04-12",
    monthGroup: "April 2026",
    type: "visit",
    title: "Initial PCP Consultation",
    subtitle: "General consultation · Dr. Sarah Jenkins",
    badgeText: "Care plan established",
    summary: "Established primary care with Dr. Jenkins following March urgent care visit. Evaluated dyspepsia and cardiovascular family risk. Initiated daily Omeprazole 20mg and baseline Atorvastatin 10mg.",
    extractedInfo: [
      { label: "Diagnosis", value: "GERD & Hyperlipidemia", status: "info" },
      { label: "Medication Started", value: "Omeprazole 20mg Daily", status: "changed" },
      { label: "Medication Started", value: "Atorvastatin 10mg Daily", status: "changed" }
    ],
    sourceDocumentId: "doc-2",
    sourceDocumentTitle: "Initial Primary Care Clinical Consultation",
    sourceDocumentType: "Doctor Note",
    sourceDate: "Apr 12, 2026",
    notes: ["Patient has positive family history of paternal CAD at 56", "Scheduled 4-week fasting lipid draw"],
    confirmed: true
  },
  {
    id: "evt-9",
    date: "Apr 12, 2026",
    isoDate: "2026-04-12",
    monthGroup: "April 2026",
    type: "medication",
    title: "New Prescriptions Started",
    subtitle: "Atorvastatin 10mg & Omeprazole 20mg",
    badgeText: "2 new medications",
    summary: "Initial prescription orders placed by Dr. Sarah Jenkins at Metro Health Pavilion.",
    extractedInfo: [
      { label: "Omeprazole", value: "20mg orally daily 30m before breakfast", status: "normal" },
      { label: "Atorvastatin", value: "10mg orally daily at bedtime", status: "normal" }
    ],
    sourceDocumentId: "doc-2",
    sourceDocumentTitle: "Initial Primary Care Clinical Consultation",
    sourceDocumentType: "Prescription",
    sourceDate: "Apr 12, 2026",
    notes: ["Take Omeprazole with water 30 minutes prior to first meal"],
    confirmed: true
  },
  {
    id: "evt-10",
    date: "Mar 18, 2026",
    isoDate: "2026-03-18",
    monthGroup: "March 2026",
    type: "visit",
    title: "Urgent Care Visit",
    subtitle: "Walk-in consultation · Dr. Amanda Ross, DO",
    badgeText: "First episode documented",
    summary: "Urgent care evaluation for 3-week history of episodic post-prandial heartburn and acid reflux. Advised trial of OTC antacids and recommended scheduling primary care consultation.",
    extractedInfo: [
      { label: "Chief Complaint", value: "Episodic burning epigastric discomfort", status: "attention" },
      { label: "Recommendation", value: "Establish with Primary Care Physician", status: "info" }
    ],
    sourceDocumentId: "doc-1",
    sourceDocumentTitle: "Urgent Care Clinical Encounter Note",
    sourceDocumentType: "Doctor Note",
    sourceDate: "Mar 18, 2026",
    notes: ["Initial medical contact for GI symptoms"],
    confirmed: true
  },
  {
    id: "evt-11",
    date: "Mar 02, 2026",
    isoDate: "2026-03-02",
    monthGroup: "March 2026",
    type: "symptom",
    title: "First Documented Symptom",
    subtitle: "Epigastric burning sensation after meals",
    badgeText: "Symptom logged",
    summary: "First recorded symptom entry in health tracker noting mild indigestion and burning sensation behind lower sternum following dinner.",
    extractedInfo: [
      { label: "Onset", value: "Early March 2026", status: "info" },
      { label: "Frequency", value: "3-4 times per week", status: "attention" }
    ],
    sourceDocumentId: "doc-1",
    sourceDocumentTitle: "Urgent Care Clinical Encounter Note",
    sourceDocumentType: "Patient Log",
    sourceDate: "Mar 02, 2026",
    notes: ["Earliest documented occurrence in Health Memory"],
    confirmed: true
  }
];

export const initialMedications: Medication[] = [
  {
    id: "med-1",
    name: "Atorvastatin (Lipitor)",
    dosage: "20 mg",
    frequency: "Once daily at bedtime",
    prescribedDate: "Jul 10, 2026 (Titrated from 10mg)",
    prescribingDoctor: "Dr. Sarah Jenkins, MD",
    status: "active",
    purpose: "Cholesterol management & cardiovascular risk reduction",
    source: "Prescription Refill #7719204 · Aug 18, 2026",
    refillsLeft: 3
  },
  {
    id: "med-2",
    name: "Omeprazole (Prilosec)",
    dosage: "20 mg",
    frequency: "Once daily 30m before breakfast",
    prescribedDate: "Apr 12, 2026",
    prescribingDoctor: "Dr. Sarah Jenkins, MD",
    status: "active",
    purpose: "Acid suppression for GERD & reflux prevention",
    source: "Prescription Refill #7719205 · Aug 18, 2026",
    refillsLeft: 3
  },
  {
    id: "med-3",
    name: "Vitamin D3 (Cholecalciferol)",
    dosage: "2000 IU (50 mcg)",
    frequency: "Once daily with meal",
    prescribedDate: "Jul 10, 2026",
    prescribingDoctor: "Dr. Sarah Jenkins, MD",
    status: "active",
    purpose: "Replenish serum 25-hydroxyvitamin D (baseline 22 ng/mL)",
    source: "Clinical Consult · Jul 10, 2026",
    refillsLeft: 2
  },
  {
    id: "med-4",
    name: "Famotidine (Pepcid AC)",
    dosage: "20 mg",
    frequency: "As needed (PRN)",
    prescribedDate: "Mar 18, 2026",
    prescribingDoctor: "Dr. Amanda Ross, DO",
    status: "discontinued",
    purpose: "Replaced by daily Omeprazole therapy in April",
    source: "Urgent Care Encounter · Mar 18, 2026",
    refillsLeft: 0
  },
  {
    id: "med-5",
    name: "Atorvastatin (Initial Dose)",
    dosage: "10 mg",
    frequency: "Once daily at bedtime",
    prescribedDate: "Apr 12, 2026",
    prescribingDoctor: "Dr. Sarah Jenkins, MD",
    status: "changed",
    purpose: "Up-titrated to 20mg on July 10, 2026",
    source: "Initial Consult Note · Apr 12, 2026",
    refillsLeft: 0
  }
];

export const initialLabResults: LabResult[] = [
  {
    id: "lab-1",
    testName: "LDL Cholesterol (Direct / Calc)",
    value: "94",
    unit: "mg/dL",
    referenceRange: "< 100 mg/dL",
    status: "normal",
    date: "Aug 28, 2026",
    previousValue: "148 mg/dL",
    previousDate: "May 14, 2026",
    sourceDocument: "Comprehensive Metabolic & Lipid Panel · Aug 28, 2026",
    category: "Lipid"
  },
  {
    id: "lab-2",
    testName: "Total Cholesterol",
    value: "178",
    unit: "mg/dL",
    referenceRange: "< 200 mg/dL",
    status: "normal",
    date: "Aug 28, 2026",
    previousValue: "228 mg/dL",
    previousDate: "May 14, 2026",
    sourceDocument: "Comprehensive Metabolic & Lipid Panel · Aug 28, 2026",
    category: "Lipid"
  },
  {
    id: "lab-3",
    testName: "Fasting Blood Glucose",
    value: "104",
    unit: "mg/dL",
    referenceRange: "65 - 99 mg/dL",
    status: "borderline",
    date: "Aug 28, 2026",
    previousValue: "98 mg/dL",
    previousDate: "May 14, 2026",
    sourceDocument: "Comprehensive Metabolic & Lipid Panel · Aug 28, 2026",
    category: "Metabolic"
  },
  {
    id: "lab-4",
    testName: "HDL Cholesterol",
    value: "52",
    unit: "mg/dL",
    referenceRange: "> 40 mg/dL",
    status: "normal",
    date: "Aug 28, 2026",
    previousValue: "48 mg/dL",
    previousDate: "May 14, 2026",
    sourceDocument: "Comprehensive Metabolic & Lipid Panel · Aug 28, 2026",
    category: "Lipid"
  },
  {
    id: "lab-5",
    testName: "Triglycerides",
    value: "142",
    unit: "mg/dL",
    referenceRange: "< 150 mg/dL",
    status: "normal",
    date: "Aug 28, 2026",
    previousValue: "160 mg/dL",
    previousDate: "May 14, 2026",
    sourceDocument: "Comprehensive Metabolic & Lipid Panel · Aug 28, 2026",
    category: "Lipid"
  },
  {
    id: "lab-6",
    testName: "Serum 25-OH Vitamin D",
    value: "22",
    unit: "ng/mL",
    referenceRange: "30 - 100 ng/mL",
    status: "decreased",
    date: "Jul 10, 2026",
    previousValue: "N/A",
    sourceDocument: "Follow-up Cardiology & Lipid Consult · Jul 10, 2026",
    category: "Metabolic"
  }
];

export const initialDoctorBriefing: DoctorBriefing = {
  whyImHere: "Follow-up consultation with Dr. Sarah Jenkins to review the 6-week laboratory response following your July statin dose adjustment (Atorvastatin 20mg), evaluate ongoing gastroesophageal reflux control, and discuss a borderline fasting blood glucose measurement.",
  recentChanges: [
    {
      category: "🧪 Lab Results",
      description: "LDL cholesterol reduced significantly by 36% (from 148 mg/dL down to 94 mg/dL), reaching your optimal target range (<100 mg/dL).",
      source: "Blood Report · Aug 28",
      highlight: true
    },
    {
      category: "🧪 Metabolic",
      description: "Fasting blood glucose showed a mild increase from 98 mg/dL to 104 mg/dL (borderline range: 100-125 mg/dL).",
      source: "Blood Report · Aug 28",
      highlight: true
    },
    {
      category: "💊 Medication",
      description: "Atorvastatin was successfully titrated from 10mg to 20mg daily in July; tolerating well with no reported muscle soreness.",
      source: "Prescription · Aug 18 & Consult · Jul 10"
    },
    {
      category: "📝 Symptoms",
      description: "Zero GERD symptoms reported since resuming consistent daily Omeprazole 20mg following June's emergency evaluation.",
      source: "Doctor Note · Aug 21"
    }
  ],
  currentMedications: [
    { name: "Atorvastatin", dose: "20 mg", frequency: "1 tab nightly at bedtime", status: "Active (Titrated Jul 2026)", purpose: "Lipid lowering / CAD prevention" },
    { name: "Omeprazole", dose: "20 mg", frequency: "1 cap daily before breakfast", status: "Active (Started Apr 2026)", purpose: "Acid suppression for GERD" },
    { name: "Vitamin D3", dose: "2000 IU", frequency: "1 softgel daily with meal", status: "Active (Added Jul 2026)", purpose: "Correction of vitamin D insufficiency" }
  ],
  relevantHistory: [
    {
      period: "March - April 2026",
      summary: "First documented episodes of post-prandial heartburn led to urgent care and primary care diagnosis of GERD & baseline hyperlipidemia.",
      episodes: ["Mar 18: Urgent care visit", "Apr 12: Started Omeprazole 20mg & Atorvastatin 10mg"]
    },
    {
      period: "June 2026",
      summary: "Acute symptom recurrence during travel after missed doses prompted ER evaluation; cardiac workup (Troponin, ECG) was completely normal.",
      episodes: ["Jun 14: Emergency department visit at St. Jude (Troponin negative)", "Resumed strict morning Omeprazole"]
    },
    {
      period: "July - August 2026",
      summary: "Atorvastatin titrated to 20mg; August 28 labs confirm target LDL-C achieved (94 mg/dL) with new borderline glucose (104 mg/dL).",
      episodes: ["Jul 10: Dose increase to 20mg + Vitamin D3 added", "Aug 28: Statin target achieved"]
    }
  ],
  recentReports: [
    { test: "Fasting Lipid Profile", finding: "Total 178 mg/dL, LDL 94 mg/dL, HDL 52 mg/dL, Triglycerides 142 mg/dL", date: "Aug 28, 2026", status: "normal" },
    { test: "Basic Metabolic Panel", finding: "Glucose 104 mg/dL (borderline), Creatinine 0.92 mg/dL, eGFR >90", date: "Aug 28, 2026", status: "attention" },
    { test: "Serum 25-OH Vit D", finding: "22 ng/mL (Ref: 30-100 ng/mL) - Low", date: "Jul 10, 2026", status: "attention" },
    { test: "12-Lead ECG & Troponin", finding: "Normal sinus rhythm, Troponin <0.01 ng/mL", date: "Jun 14, 2026", status: "normal" }
  ],
  questionsToAsk: [
    {
      question: "Should I maintain my current 20mg dose of Atorvastatin given that my LDL has reached 94 mg/dL?",
      rationale: "Your latest blood test shows you reached the target (<100 mg/dL), confirming the 20mg dose is effective."
    },
    {
      question: "Does my fasting glucose of 104 mg/dL require any dietary changes or follow-up HbA1c testing?",
      rationale: "Fasting glucose rose slightly from 98 mg/dL into the borderline 100-125 mg/dL range on August 28."
    },
    {
      question: "How long should I plan to continue daily Omeprazole 20mg, or can we eventually trial step-down therapy?",
      rationale: "You have been symptom-free for over two months since the June flare-up."
    },
    {
      question: "When should we recheck my Vitamin D levels after starting the 2000 IU supplement in July?",
      rationale: "Baseline level was 22 ng/mL; retesting typically occurs after 3-6 months of supplementation."
    }
  ],
  conciseSummary60s: "42-year-old patient presenting for routine follow-up with Dr. Jenkins. Key updates: (1) Atorvastatin 20mg titration succeeded with LDL dropping from 148 to 94 mg/dL; (2) Fasting blood sugar noted at 104 mg/dL (borderline); (3) GERD remains completely controlled on Omeprazole 20mg with no episodes since June ER evaluation; (4) Continuing daily Vitamin D3 2000 IU. Current goals are confirming long-term statin maintenance and discussing glucose monitoring."
};

export const sampleUploadExtractableRecords = [
  {
    documentTitle: "Cardiology Echocardiogram & Stress Report",
    facility: "Metro Heart & Vascular Center",
    date: "Aug 30, 2026",
    fileType: "PDF" as const,
    fileSize: "3.2 MB",
    category: "imaging" as const,
    events: [
      {
        id: "new-evt-1",
        title: "Transthoracic Echocardiogram",
        subtitle: "Normal Left Ventricular Ejection Fraction (62%)",
        type: "imaging" as const,
        date: "Aug 30, 2026",
        summary: "Standard 2D Doppler echocardiogram demonstrating normal cardiac chambers, preserved systolic function (EF 62%), and no wall motion abnormalities.",
        extractedInfo: [
          { label: "Ejection Fraction", value: "62% (Normal >55%)", status: "normal" as const },
          { label: "Left Ventricle", value: "Normal wall thickness", status: "normal" as const },
          { label: "Valvular Function", value: "No significant regurgitation", status: "normal" as const }
        ]
      },
      {
        id: "new-evt-2",
        title: "Resting 12-Lead ECG",
        subtitle: "Normal Sinus Rhythm (HR 64 bpm)",
        type: "lab" as const,
        date: "Aug 30, 2026",
        summary: "Normal resting ECG confirmed no ischemic changes or conduction delays.",
        extractedInfo: [
          { label: "Heart Rate", value: "64 bpm", status: "normal" as const },
          { label: "PR Interval", value: "154 ms (Normal)", status: "normal" as const }
        ]
      },
      {
        id: "new-evt-3",
        title: "Cardiologist Consultation Note",
        subtitle: "Dr. Robert Vance, MD (Cardiology)",
        type: "visit" as const,
        date: "Aug 30, 2026",
        summary: "Review of cardiovascular risk factors and lipid panel response. Confirmed excellent response to statin therapy with low calculated 10-year ASCVD risk.",
        extractedInfo: [
          { label: "ASCVD 10-Yr Risk", value: "3.2% (Low Risk)", status: "normal" as const },
          { label: "Plan", value: "Continue Atorvastatin 20mg daily", status: "info" as const }
        ]
      },
      {
        id: "new-evt-4",
        title: "Blood Pressure Reading",
        subtitle: "In-clinic measurement (118/76 mmHg)",
        type: "lab" as const,
        date: "Aug 30, 2026",
        summary: "Resting seated blood pressure within optimal American Heart Association range.",
        extractedInfo: [
          { label: "Systolic", value: "118 mmHg", status: "normal" as const },
          { label: "Diastolic", value: "76 mmHg", status: "normal" as const }
        ]
      },
      {
        id: "new-evt-5",
        title: "Medication Verification",
        subtitle: "Cardiology medication review",
        type: "medication" as const,
        date: "Aug 30, 2026",
        summary: "Reconciled active medication profile: Atorvastatin 20mg, Omeprazole 20mg, Vitamin D3 2000 IU.",
        extractedInfo: [
          { label: "Reconciliation Status", value: "100% Verified", status: "normal" as const },
          { label: "Allergies Verified", value: "Penicillin, Latex", status: "attention" as const }
        ]
      },
      {
        id: "new-evt-6",
        title: "Cardiovascular Risk Stratification",
        subtitle: "Framingham & ACC/AHA Risk Score",
        type: "visit" as const,
        date: "Aug 30, 2026",
        summary: "Favorable trajectory with 36% LDL reduction lowering lifetime atherogenic event probability.",
        extractedInfo: [
          { label: "Target Status", value: "Target Reached (<100 mg/dL)", status: "normal" as const }
        ]
      },
      {
        id: "new-evt-7",
        title: "Diet & Lifestyle Recommendation",
        subtitle: "Mediterranean dietary protocol",
        type: "visit" as const,
        date: "Aug 30, 2026",
        summary: "Emphasized moderate aerobic exercise (150 min/wk) and low refined carbohydrates to address borderline fasting glucose.",
        extractedInfo: [
          { label: "Exercise Target", value: "150 min/week zone 2", status: "info" as const },
          { label: "Diet Guidance", value: "Low glycemic index", status: "info" as const }
        ]
      },
      {
        id: "new-evt-8",
        title: "Future Lab Schedule",
        subtitle: "6-Month Follow-up Lab Order",
        type: "lab" as const,
        date: "Aug 30, 2026",
        summary: "Automated lab order created for February 2027 to monitor lipid maintenance and repeat HbA1c.",
        extractedInfo: [
          { label: "Scheduled Date", value: "February 2027", status: "info" as const },
          { label: "Tests Ordered", value: "Lipid Panel + HbA1c + CMP", status: "info" as const }
        ]
      }
    ]
  }
];
