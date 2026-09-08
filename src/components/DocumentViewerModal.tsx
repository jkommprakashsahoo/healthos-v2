import React from 'react';
import { X, FileText, Calendar, Building2, User, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HealthDocument } from '../types';

interface DocumentViewerModalProps {
  document: HealthDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  onClose,
}) => {
  if (!document) return null;

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

        {/* Sheet Container */}
        <motion.div
          id="document-viewer-modal"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Top Handle for mobile pull */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-10 h-1.2 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#D0E2FB] flex items-center justify-center text-[#005FB8] shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md uppercase tracking-wider">
                    {document.fileType}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {document.fileSize}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight mt-1">
                  {document.title}
                </h3>
              </div>
            </div>

            <button
              id="close-document-viewer-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Scrollable */}
          <div className="px-5 py-4 overflow-y-auto space-y-4 text-sm text-slate-700">
            {/* Metadata Badges Grid */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{document.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{document.provider}</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 text-xs text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800 truncate">{document.facility}</span>
              </div>
            </div>

            {/* AI Extracted Data Highlights */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-4 h-4 text-[#005FB8]" />
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Extracted Data Points ({document.keyDataPoints.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {document.keyDataPoints.map((dp, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 bg-[#EBF3FC] text-[#005FB8] border border-[#CDE1F8] rounded-lg"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#005FB8]" />
                    {dp}
                  </span>
                ))}
              </div>
            </div>

            {/* Document Content View */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Document Transcript &amp; Text
              </h4>
              <div className="bg-slate-900 text-slate-100 font-mono text-[12px] leading-relaxed p-4 rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-800 shadow-inner">
                {document.fullPreviewText}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-600 font-medium">Categories:</span>
              {document.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
            <button
              onClick={() => {
                const blob = new Blob([document.fullPreviewText], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = window.document.createElement('a');
                a.href = url;
                a.download = `${document.title.replace(/\s+/g, '_')}.txt`;
                a.click();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#005FB8] hover:bg-[#004D99] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              Download Clinical Text
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
