import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Mail, ShieldCheck, Printer, Download, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DoctorBriefing } from '../types';

interface ShareSheetModalProps {
  isOpen: boolean;
  briefing: DoctorBriefing;
  onClose: () => void;
}

export const ShareSheetModal: React.FC<ShareSheetModalProps> = ({
  isOpen,
  briefing,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedAction, setSharedAction] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = `HEALTH MEMORY - 60-SECOND DOCTOR BRIEFING\n\nWHY I'M HERE:\n${briefing.whyImHere}\n\nRECENT CHANGES:\n${briefing.recentChanges.map(c => `• ${c.category}: ${c.description} (${c.source})`).join('\n')}\n\nCURRENT MEDICATIONS:\n${briefing.currentMedications.map(m => `• ${m.name} ${m.dose} (${m.frequency}) - ${m.status}`).join('\n')}\n\nRECENT LABS:\n${briefing.recentReports.map(r => `• ${r.test}: ${r.finding} (${r.date})`).join('\n')}\n\nQUESTIONS FOR THE DOCTOR:\n${briefing.questionsToAsk.map((q, i) => `${i + 1}. ${q.question}\n   Reason: ${q.rationale}`).join('\n')}\n\nSUMMARY:\n${briefing.conciseSummary60s}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAction = (actionName: string) => {
    setSharedAction(actionName);
    setTimeout(() => {
      setSharedAction(null);
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Share Sheet */}
        <motion.div
          id="share-sheet-modal"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-[430px] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Handle */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-10 h-1.2 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EBF3FC] text-[#005FB8] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Share Doctor Briefing
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4">
            {sharedAction && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-medium"
              >
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sharedAction} simulation triggered successfully!</span>
              </motion.div>
            )}

            <p className="text-xs text-slate-500 font-normal">
              Share your verified, factual 60-second health briefing directly with your healthcare provider or caregiver.
            </p>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-4 gap-2.5 text-center">
              <button
                onClick={handleCopy}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-[#EBF3FC] transition-all border border-slate-200/60 active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#005FB8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  {copied ? 'Copied!' : 'Copy Text'}
                </span>
              </button>

              <button
                onClick={() => handleAction('Secure Portal Export (MyChart/Epic)')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-[#EBF3FC] transition-all border border-slate-200/60 active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#005FB8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  EHR Portal
                </span>
              </button>

              <button
                onClick={() => handleAction('Email to Dr. Sarah Jenkins')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-[#EBF3FC] transition-all border border-slate-200/60 active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  Email
                </span>
              </button>

              <button
                onClick={() => handleAction('SMS to Family Contact')}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 hover:bg-[#EBF3FC] transition-all border border-slate-200/60 active:scale-95 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-700">
                  Message
                </span>
              </button>
            </div>

            {/* Additional Options */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const blob = new Blob([briefing.conciseSummary60s], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = window.document.createElement('a');
                  a.href = url;
                  a.download = `Doctor_Briefing_${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  handleAction('Downloaded clinical text file');
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download Clinician Summary File</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">.txt</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Briefing Card for Visit</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">Print</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
