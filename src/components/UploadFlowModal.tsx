import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Camera, Image as ImageIcon, CheckCircle2, Sparkles, Edit3, Trash2, Check, ArrowRight, Loader2, FileCheck, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineEvent, HealthDocument } from '../types';
import { supabase } from '../lib/supabase';

interface UploadFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmEvents: (newEvents: TimelineEvent[], newDocument: HealthDocument) => void;
}

type Stage = 'select' | 'processing' | 'review' | 'success';

interface ExtractedItemState {
  id: string;
  title: string;
  subtitle: string;
  type: 'imaging' | 'lab' | 'visit' | 'medication' | 'symptom';
  date: string;
  summary: string;
  extractedInfo: { label: string; value: string; status?: 'normal' | 'attention' | 'changed' | 'info' }[];
  confirmed: boolean;
  isEditing?: boolean;
}

export const UploadFlowModal: React.FC<UploadFlowModalProps> = ({
  isOpen,
  onClose,
  onConfirmEvents,
}) => {
  const [stage, setStage] = useState<Stage>('select');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocTitle, setSelectedDocTitle] = useState('');
  const [processingStepIndex, setProcessingStepIndex] = useState(0);
  const [extractedItems, setExtractedItems] = useState<ExtractedItemState[]>([]);
  const [scanError, setScanError] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processingSteps = [
    'Reading document optical text...',
    'Extracting clinical dates & encounters...',
    'Finding active medications & dosages...',
    'Extracting laboratory & diagnostic results...',
    'Connecting longitudinal timeline events...'
  ];

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStage('select');
      setProcessingStepIndex(0);
      setSelectedFile(null);
      setSelectedDocTitle('');
      setExtractedItems([]);
      setScanError('');
    }
  }, [isOpen]);

  const handleFileSelected = async (file?: File) => {
    if (!file) return;
    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setScanError('Please choose a PDF, JPG, PNG, or WEBP health document.');
      return;
    }
    setSelectedFile(file);
    setSelectedDocTitle(file.name);
    setScanError('');
    setStage('processing');
    setProcessingStepIndex(0);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('The selected file could not be read.'));
        reader.readAsDataURL(file);
      });
      const response = await fetch('/api/scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, mimeType: file.type, dataUrl }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'The document could not be analyzed.');
      setExtractedItems(result.events.map((event: ExtractedItemState) => ({ ...event, confirmed: true })));
      setProcessingStepIndex(processingSteps.length - 1);
      setStage('review');
    } catch (error) {
      setScanError(error instanceof Error ? error.message : 'The document could not be analyzed.');
      setStage('select');
    }
  };

  const handleToggleConfirm = (id: string) => {
    setExtractedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, confirmed: !item.confirmed } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setExtractedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleStartEdit = (item: ExtractedItemState) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditValue(item.extractedInfo[0]?.value || item.subtitle);
  };

  const handleSaveEdit = (id: string) => {
    setExtractedItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedInfo = [...item.extractedInfo];
          if (updatedInfo.length > 0) {
            updatedInfo[0].value = editValue;
          }
          return {
            ...item,
            title: editTitle,
            extractedInfo: updatedInfo,
          };
        }
        return item;
      })
    );
    setEditingItemId(null);
  };

  const handleFinishConfirm = async () => {
    const confirmedList = extractedItems.filter((i) => i.confirmed);
    const newDocId = `doc-${Date.now()}`;

    if (selectedFile && supabase) {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const storagePath = `${userData.user.id}/${newDocId}-${selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
        const { error } = await supabase.storage.from('health-documents').upload(storagePath, selectedFile, { upsert: false });
        if (error) {
          setScanError(`The document was read but could not be saved: ${error.message}`);
          return;
        }
      }
    }

    const newTimelineEvents: TimelineEvent[] = confirmedList.map((item, idx) => ({
      id: `evt-added-${Date.now()}-${idx}`,
      date: item.date,
      isoDate: item.date,
      monthGroup: new Date(item.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      type: item.type,
      title: item.title,
      subtitle: item.subtitle,
      badgeText: 'Verified by user',
      summary: item.summary,
      extractedInfo: item.extractedInfo,
      sourceDocumentId: newDocId,
      sourceDocumentTitle: selectedDocTitle,
      sourceDocumentType: selectedFile?.type || 'Health Document',
      sourceDate: item.date,
      confirmed: true,
    }));

    const newDocument: HealthDocument = {
      id: newDocId,
      title: selectedDocTitle,
      category: 'imaging',
      date: 'Aug 30, 2026',
      facility: 'Uploaded by user',
      provider: 'Not specified in document',
      extractedEventsCount: confirmedList.length,
      fileType: selectedFile?.type === 'application/pdf' ? 'PDF' : 'Image',
      fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
      contentSummary: confirmedList.map((item) => item.summary).join(' '),
      keyDataPoints: confirmedList.map((i) => `${i.title}: ${i.extractedInfo[0]?.value || 'Recorded'}`),
      fullPreviewText: confirmedList.map((item) => `${item.title}\n${item.summary}\n${item.extractedInfo.map((info) => `${info.label}: ${info.value}`).join('\n')}`).join('\n\n'),
      tags: [selectedFile?.type === 'application/pdf' ? 'PDF' : 'Image', 'AI extracted'],
    };

    onConfirmEvents(newTimelineEvents, newDocument);
    setStage('success');
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (stage !== 'processing') onClose();
          }}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          id="upload-flow-modal"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="relative z-10 w-full max-w-[430px] max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
        >
          {/* Handle */}
          <div className="pt-3 pb-1 flex justify-center sm:hidden">
            <div className="w-10 h-1.2 bg-slate-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EBF3FC] text-[#005FB8] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {stage === 'select' && 'Add Health Record'}
                  {stage === 'processing' && 'AI is reading your record...'}
                  {stage === 'review' && 'Review Extracted Events'}
                  {stage === 'success' && 'Memory Connected!'}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {stage === 'select' && 'Upload PDF, photo, or select sample record'}
                  {stage === 'processing' && 'Converting unstructured data into structured timeline'}
                  {stage === 'review' && `${extractedItems.filter(i => i.confirmed).length} of ${extractedItems.length} events confirmed`}
                  {stage === 'success' && 'Timeline and Health Memory updated'}
                </p>
              </div>
            </div>

            {stage !== 'processing' && (
              <button
                id="close-upload-flow-btn"
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Modal Body depending on Stage */}
          <div className="p-5 overflow-y-auto max-h-[72vh]">
            {/* STAGE 1: SELECT */}
            {stage === 'select' && (
              <div className="space-y-4">
                {/* Upload Action Tiles */}
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#EBF3FC]/60 hover:bg-[#EBF3FC] border border-[#CDE1F8] transition-all active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#005FB8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Upload PDF
                    </span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#005FB8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Choose Photo
                    </span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#005FB8] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      Take Photo
                    </span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={(event) => handleFileSelected(event.target.files?.[0])}
                />

                {scanError && (
                  <div role="alert" className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-700 leading-relaxed">
                    {scanError}
                  </div>
                )}

                {/* Notice */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
                  <FileCheck className="w-4 h-4 text-[#005FB8] shrink-0 mt-0.5" />
                  <span>
                    Health Memory parses unstructured documents, extracts longitudinal timeline facts, and lets you verify before committing.
                  </span>
                </div>
              </div>
            )}

            {/* STAGE 2: PROCESSING ANIMATION */}
            {stage === 'processing' && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#EBF3FC] border-4 border-[#CDE1F8] flex items-center justify-center text-[#005FB8]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#005FB8]" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#005FB8] border-t-transparent animate-spin" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">
                    AI is analyzing &quot;{selectedDocTitle}&quot;
                  </h4>
                  <p className="text-xs text-slate-500">
                    Extracting structured events, labs, and medications...
                  </p>
                </div>

                {/* Animated Steps Checklist */}
                <div className="w-full max-w-sm space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
                  {processingSteps.map((stepText, idx) => {
                    const isDone = idx < processingStepIndex;
                    const isCurrent = idx === processingStepIndex;

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 text-xs transition-colors ${
                          isDone
                            ? 'text-emerald-700 font-semibold'
                            : isCurrent
                            ? 'text-[#005FB8] font-bold'
                            : 'text-slate-400 font-normal'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#005FB8] border-t-transparent animate-spin shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span>{stepText}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 3: REVIEW EXTRACTED EVENTS */}
            {stage === 'review' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#EBF3FC] border border-[#CDE1F8] rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-[#005FB8] font-semibold">
                    <Sparkles className="w-4 h-4 text-[#005FB8]" />
                    <span>{extractedItems.length} health events found</span>
                  </div>
                  <span className="text-[11px] text-[#005FB8]/80 font-medium">
                    Review and confirm before adding
                  </span>
                </div>

                {/* List of extracted events with Confirm / Edit / Remove */}
                <div className="space-y-2.5">
                  {extractedItems.map((item) => {
                    const isEditing = editingItemId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          item.confirmed
                            ? 'bg-white border-slate-200 shadow-2xs'
                            : 'bg-slate-50/60 border-dashed border-slate-300 opacity-60'
                        }`}
                      >
                        {isEditing ? (
                          <div className="space-y-2 text-xs">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">
                                Title
                              </label>
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-[#005FB8]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase">
                                Key Value / Result
                              </label>
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-[#005FB8]"
                              />
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleSaveEdit(item.id)}
                                className="px-3 py-1 bg-[#005FB8] text-white rounded-md font-bold text-xs"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingItemId(null)}
                                className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md font-medium text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                                    {item.type}
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    {item.date}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 mt-1">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-slate-600 mt-0.5 font-normal">
                                  {item.subtitle}
                                </p>
                              </div>

                              {/* Item Action Controls */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => handleToggleConfirm(item.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                                    item.confirmed
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : 'bg-slate-200 text-slate-600'
                                  }`}
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  {item.confirmed ? 'Confirmed' : 'Confirm'}
                                </button>
                                <button
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                  title="Edit"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Extracted pills preview */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.extractedInfo.map((info, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                                >
                                  {info.label}: <strong className="text-slate-900">{info.value}</strong>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 4: SUCCESS */}
            {stage === 'success' && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Health Memory Updated!
                </h4>
                <p className="text-xs text-slate-500 max-w-xs font-normal">
                  {extractedItems.filter(i => i.confirmed).length} verified events connected to your longitudinal timeline.
                </p>
              </div>
            )}
          </div>

          {/* Footer Action for Review Stage */}
          {stage === 'review' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                {extractedItems.filter((i) => i.confirmed).length} items ready
              </span>
              <button
                id="commit-extracted-events-btn"
                onClick={handleFinishConfirm}
                disabled={extractedItems.filter((i) => i.confirmed).length === 0}
                className="py-2.5 px-5 rounded-xl bg-[#005FB8] hover:bg-[#004D99] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <span>Add Confirmed to Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
