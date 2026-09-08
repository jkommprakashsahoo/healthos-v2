import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Share2, Edit3, Check, Stethoscope, AlertCircle, Pill, Calendar, Activity, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { DoctorBriefing } from '../types';

interface DoctorPrepScreenProps {
  briefing: DoctorBriefing;
  onBack: () => void;
  onOpenShareSheet: () => void;
  onViewSource: (docId: string) => void;
}

export const DoctorPrepScreen: React.FC<DoctorPrepScreenProps> = ({
  briefing: initialBriefing,
  onBack,
  onOpenShareSheet,
  onViewSource,
}) => {
  const [briefing, setBriefing] = useState<DoctorBriefing>(initialBriefing);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(initialBriefing.conciseSummary60s);
  const [showFullHistory, setShowFullHistory] = useState(false);

  const handleCopy = () => {
    const text = `HEALTH MEMORY - 60-SECOND DOCTOR BRIEFING
Dr. Sarah Jenkins · Follow-up Appointment

WHY I'M HERE:
${briefing.whyImHere}

RECENT CHANGES:
${briefing.recentChanges.map(c => `• ${c.category}: ${c.description} [${c.source}]`).join('\n')}

CURRENT MEDICATIONS:
${briefing.currentMedications.map(m => `• ${m.name} ${m.dose} (${m.frequency}) - Purpose: ${m.purpose}`).join('\n')}

RECENT REPORTS:
${briefing.recentReports.map(r => `• ${r.test}: ${r.finding} (${r.date})`).join('\n')}

QUESTIONS TO ASK:
${briefing.questionsToAsk.map((q, i) => `${i + 1}. ${q.question} (Context: ${q.rationale})`).join('\n')}

60-SECOND BRIEFING:
${editedSummary}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    setBriefing(prev => ({ ...prev, conciseSummary60s: editedSummary }));
    setIsEditing(false);
  };

  return (
    <div className="min-h-full pb-28 pt-3 px-4 space-y-4">
      {/* Top App Bar */}
      <div className="flex items-center justify-between">
        <button
          id="doctor-prep-back-btn"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FC] border border-[#CDE1F8] text-[#005FB8] text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#005FB8]" />
          <span>Hackathon Wow Moment</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display flex items-center gap-2">
          <span>Doctor Prep</span>
          <Stethoscope className="w-6 h-6 text-[#005FB8] inline" />
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Your 60-second health briefing for Dr. Sarah Jenkins (Tomorrow · 10:30 AM).
        </p>
      </div>

      {/* 1. WHY I'M HERE */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Calendar className="w-4 h-4 text-[#005FB8]" />
          <span>Why I&apos;m Here</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-normal">
          {briefing.whyImHere}
        </p>
      </div>

      {/* 2. RECENT CHANGES */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-[#005FB8]" />
            <span>Recent Changes</span>
          </div>
          <span className="text-[10px] font-bold text-[#005FB8] bg-[#EBF3FC] px-2 py-0.5 rounded-full border border-[#CDE1F8]">
            {briefing.recentChanges.length} key findings
          </span>
        </div>

        <div className="space-y-2">
          {briefing.recentChanges.map((change, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                change.highlight
                  ? 'bg-[#F0F6FF] border-[#D0E2FB]'
                  : 'bg-slate-50/80 border-slate-200/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900">
                  {change.category}
                </span>
                <span className="text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {change.source}
                </span>
              </div>
              <p className="text-slate-700 leading-normal font-normal">
                {change.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CURRENT MEDICATIONS */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Pill className="w-4 h-4 text-purple-600" />
            <span>Current Medications ({briefing.currentMedications.length})</span>
          </div>
          <span className="text-[10px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
            Active Verified
          </span>
        </div>

        <div className="space-y-2">
          {briefing.currentMedications.map((med, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-2 text-xs"
            >
              <div>
                <h4 className="font-bold text-slate-900">
                  {med.name} <span className="text-[#005FB8]">{med.dose}</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  {med.frequency}
                </p>
                <p className="text-[11px] text-slate-600 mt-1 font-normal">
                  Purpose: {med.purpose}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                {med.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RELEVANT HISTORY (Episodes across 6 months) */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-[#005FB8]" />
            <span>Relevant History & Episodes</span>
          </div>
          <button
            onClick={() => setShowFullHistory(!showFullHistory)}
            className="text-[11px] text-[#005FB8] font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>{showFullHistory ? 'Collapse' : 'Expand'}</span>
            {showFullHistory ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="space-y-2.5">
          {(showFullHistory ? briefing.relevantHistory : briefing.relevantHistory.slice(0, 2)).map((hist, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-[#F0F6FF] border border-[#D0E2FB] text-xs space-y-1.5">
              <span className="text-[10px] font-extrabold text-[#005FB8] uppercase tracking-wider bg-[#EBF3FC] px-2 py-0.5 rounded">
                {hist.period}
              </span>
              <p className="text-slate-800 font-medium leading-normal">
                {hist.summary}
              </p>
              <div className="flex flex-wrap gap-1 pt-1">
                {hist.episodes.map((ep, i) => (
                  <span key={i} className="text-[10px] bg-white border border-[#CDE1F8] text-slate-800 px-2 py-0.5 rounded-md font-medium">
                    {ep}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. RECENT REPORTS */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Recent Lab & Diagnostic Reports</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {briefing.recentReports.map((report, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-slate-900">{report.test}</span>
                <p className="text-slate-700 mt-0.5 font-normal">{report.finding}</p>
                <span className="text-[10px] text-slate-500 font-medium">{report.date}</span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                  report.status === 'attention'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {report.status === 'attention' ? 'Borderline / Review' : 'Normal / Goal'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. QUESTIONS TO ASK */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>Questions for Dr. Jenkins ({briefing.questionsToAsk.length})</span>
          </div>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">
            High Value
          </span>
        </div>

        <div className="space-y-2.5">
          {briefing.questionsToAsk.map((q, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 text-xs space-y-1.5"
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {idx + 1}
                </span>
                <h4 className="font-bold text-slate-900 leading-snug">
                  &quot;{q.question}&quot;
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 pl-7 font-normal">
                <strong>Why ask:</strong> {q.rationale}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 60-SECOND BRIEFING CARD */}
      <div className="p-4.5 bg-gradient-to-br from-[#0A1628] via-[#0F2240] to-[#0A1628] text-white rounded-2xl shadow-xs border border-blue-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">
                Clinician Verbal Script
              </span>
              <h3 className="text-sm font-bold text-white">
                60-Second Briefing
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-blue-200 hover:text-white font-semibold flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              rows={5}
              className="w-full p-3 bg-slate-800 text-white text-xs rounded-xl border border-blue-400/50 focus:outline-blue-400 font-sans leading-relaxed"
            />
            <button
              onClick={handleSaveEdit}
              className="w-full py-2 bg-[#005FB8] text-white font-bold text-xs rounded-xl"
            >
              Save Custom Briefing
            </button>
          </div>
        ) : (
          <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs leading-relaxed text-slate-200 font-normal">
            &quot;{briefing.conciseSummary60s}&quot;
          </div>
        )}

        {/* Action Buttons: Copy, Edit, Share */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            id="copy-doctor-briefing-btn"
            onClick={handleCopy}
            className="py-2.5 px-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all border border-white/10"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-blue-200" />
                <span>Copy briefing</span>
              </>
            )}
          </button>

          <button
            id="share-doctor-briefing-btn"
            onClick={onOpenShareSheet}
            className="py-2.5 px-3 bg-[#005FB8] hover:bg-[#004D99] active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
