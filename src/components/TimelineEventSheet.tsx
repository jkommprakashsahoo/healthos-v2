import React from 'react';
import { X, Calendar, FileText, ArrowRight, Activity, Stethoscope, Pill, AlertTriangle, Building, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent } from '../types';

interface TimelineEventSheetProps {
  event: TimelineEvent | null;
  onClose: () => void;
  onViewSource: (docId: string) => void;
}

export const TimelineEventSheet: React.FC<TimelineEventSheetProps> = ({
  event,
  onClose,
  onViewSource,
}) => {
  if (!event) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case 'visit':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-purple-600" />;
      case 'hospital':
        return <Building className="w-5 h-5 text-rose-600" />;
      case 'symptom':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab':
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'visit':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'medication':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'hospital':
        return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'symptom':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
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

        {/* Sheet */}
        <motion.div
          id="timeline-event-sheet"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-[430px] max-h-[88vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Mobile Handle */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-10 h-1.2 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 bg-slate-50/70">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center shrink-0 mt-0.5">
                {getTypeIcon(event.type)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getTypeColor(event.type)} uppercase tracking-wider`}>
                    {event.type}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {event.date}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 leading-tight mt-1">
                  {event.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  {event.subtitle}
                </p>
              </div>
            </div>

            <button
              id="close-event-sheet-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 overflow-y-auto space-y-4 text-sm text-slate-700">
            {/* Event Summary */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Summary
              </h4>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 leading-relaxed">
                {event.summary}
              </div>
            </div>

            {/* Extracted Information */}
            {event.extractedInfo && event.extractedInfo.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Extracted Information ({event.extractedInfo.length})
                </h4>
                <div className="space-y-2">
                  {event.extractedInfo.map((info, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 text-xs"
                    >
                      <span className="font-semibold text-slate-600 truncate">
                        {info.label}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {info.previousValue && (
                          <span className="text-[11px] text-slate-600 line-through">
                            {info.previousValue}
                          </span>
                        )}
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md ${
                            info.status === 'attention'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : info.status === 'changed'
                              ? 'bg-purple-100 text-purple-900 border border-purple-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {info.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Notes / Observations */}
            {event.notes && event.notes.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Timeline Context &amp; Notes
                </h4>
                <ul className="space-y-1 bg-[#F0F6FF] border border-[#D0E2FB] p-3 rounded-xl">
                  {event.notes.map((note, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2 font-normal">
                      <span className="text-[#005FB8] font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Source Document Card */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                Source Document
              </h4>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3FC] text-[#005FB8] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {event.sourceDocumentTitle}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {event.sourceDocumentType} · {event.sourceDate}
                    </p>
                  </div>
                </div>

                <button
                  id={`view-source-${event.id}`}
                  onClick={() => {
                    onClose();
                    onViewSource(event.sourceDocumentId);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-[#005FB8] hover:bg-slate-50 flex items-center gap-1 shrink-0 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View source
                </button>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
            <button
              onClick={() => {
                onClose();
                onViewSource(event.sourceDocumentId);
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#005FB8] hover:bg-[#004D99] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
            >
              <FileText className="w-4 h-4" />
              Inspect Original Document
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
