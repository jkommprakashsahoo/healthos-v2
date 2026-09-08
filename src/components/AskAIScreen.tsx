import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Mic, RefreshCw, Search, Stethoscope, FileText, ArrowRight, Bot, User, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { ChatMessage, SourceCitation, TimelineEvent, HealthDocument, Medication, LabResult } from '../types';
import { askHealthMemory } from '../utils/aiEngine';

interface AskAIScreenProps {
  timelineEvents: TimelineEvent[];
  documents: HealthDocument[];
  medications: Medication[];
  labResults: LabResult[];
  onOpenDoctorPrep: () => void;
  onViewSource: (docId: string) => void;
  initialQuestion?: string;
  initialActionType?: 'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom';
}

export const AskAIScreen: React.FC<AskAIScreenProps> = ({
  timelineEvents,
  documents,
  medications,
  labResults,
  onOpenDoctorPrep,
  onViewSource,
  initialQuestion,
  initialActionType,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handledInitialQuestionRef = useRef<string | null>(null);

  const quickActions = [
    {
      id: 'what_changed' as const,
      title: 'What changed?',
      subtitle: 'Compare recent & previous records',
      icon: RefreshCw,
      color: 'bg-[#EBF3FC] text-[#005FB8] border-[#CDE1F8]',
    },
    {
      id: 'previous_episodes' as const,
      title: 'Previous episodes',
      subtitle: 'Connect timeline across 6 months',
      icon: Search,
      color: 'bg-[#EBF3FC] text-[#005FB8] border-[#CDE1F8]',
    },
    {
      id: 'doctor_prep' as const,
      title: 'Doctor Prep',
      subtitle: 'Create appointment summary',
      icon: Stethoscope,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'summary' as const,
      title: '60-sec summary',
      subtitle: 'High-level memory overview',
      icon: FileText,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  // Initialize with the standard benchmark sample conversation or user trigger
  useEffect(() => {
    if (initialQuestion) {
      const triggerKey = `${initialActionType || 'custom'}:${initialQuestion}`;
      if (handledInitialQuestionRef.current === triggerKey) {
        return;
      }
      handledInitialQuestionRef.current = triggerKey;
      handleTriggerQuestion(initialQuestion, initialActionType || 'custom');
    } else if (messages.length === 0) {
      // Default initial welcome message with the exact demo benchmark from prompt
      setMessages([
        {
          id: 'msg-init-user',
          sender: 'user',
          timestamp: '10:02 AM',
          text: 'What has changed since my last check-up?',
        },
        {
          id: 'msg-init-ai',
          sender: 'ai',
          timestamp: '10:02 AM',
          actionType: 'what_changed',
          sections: {
            headline: "Here's what changed across your health history:",
            documented: [
              {
                title: "Lab results",
                icon: "🧪",
                items: [
                  "Your recent blood report (Aug 28) shows a 36% decrease in LDL Cholesterol (from 148 to 94 mg/dL), reaching your target goal.",
                  "Fasting blood glucose increased slightly from 98 to 104 mg/dL, entering the borderline range."
                ]
              },
              {
                title: "Medication",
                icon: "💊",
                items: [
                  "Atorvastatin was titrated from 10mg to 20mg daily in July and refilled on August 18.",
                  "Vitamin D3 2000 IU was added following a low baseline 25-OH Vitamin D measurement of 22 ng/mL."
                ]
              },
              {
                title: "Symptoms",
                icon: "📝",
                items: [
                  "Zero GERD or heartburn symptoms reported since strictly maintaining daily Omeprazole 20mg."
                ]
              }
            ],
            observed: [
              {
                title: "Longitudinal Pattern",
                icon: "📊",
                items: [
                  "Medication adherence directly prevented symptom recurrence after the June travel episode."
                ]
              }
            ],
            discuss: [
              "The positive changes in your recent lab report (LDL 94 mg/dL)",
              "Your borderline fasting glucose of 104 mg/dL",
              "Whether your current medication list remains optimal"
            ]
          },
          sources: [
            { id: 'doc-8', title: 'Blood Report', date: 'Aug 28, 2026', type: 'Lab Report' },
            { id: 'doc-7', title: 'Doctor Note', date: 'Aug 21, 2026', type: 'Doctor Note' },
            { id: 'doc-6', title: 'Prescription', date: 'Aug 18, 2026', type: 'Prescription' },
            { id: 'doc-4', title: 'Cardiology Consult', date: 'Jul 10, 2026', type: 'Doctor Note' }
          ]
        }
      ]);
    }
  }, [initialQuestion, initialActionType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleTriggerQuestion = async (
    question: string,
    actionType?: 'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom'
  ) => {
    if (actionType === 'doctor_prep') {
      onOpenDoctorPrep();
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: question,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const context = {
      timelineEvents,
      documents,
      medications,
      labResults,
    };

    try {
      const aiMsg = await askHealthMemory(question, context, actionType);
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      const q = inputText.trim();
      setInputText('');
      handleTriggerQuestion(q, 'custom');
    }
  };

  return (
    <div className="min-h-full pb-28 pt-4 px-4 flex flex-col justify-between">
      {/* Top Header */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#005FB8] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Health Memory AI</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
          Ask your Health Memory ✨
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Ask questions about your interconnected health history.
        </p>
      </div>

      {/* QUICK AI ACTIONS (Large Tappable Cards) */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Quick AI Actions
          </span>
          <span className="text-[10px] text-[#005FB8] font-semibold">
            One-tap analysis
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                id={`quick-action-${action.id}`}
                onClick={() => {
                  if (action.id === 'doctor_prep') {
                    onOpenDoctorPrep();
                  } else if (action.id === 'what_changed') {
                    handleTriggerQuestion('What has changed since my last check-up?', 'what_changed');
                  } else if (action.id === 'previous_episodes') {
                    handleTriggerQuestion('Show me previous episodes and history across my timeline', 'previous_episodes');
                  } else if (action.id === 'summary') {
                    handleTriggerQuestion('Give me a 60-second summary of my health memory', 'summary');
                  }
                }}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-[0.98] hover:shadow-xs flex flex-col justify-between h-[82px] bg-white border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:border-[#CDE1F8] group`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${action.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#005FB8] group-hover:translate-x-0.5 transition-all" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#005FB8] transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 truncate">
                    {action.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="space-y-4 mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              {/* Sender label */}
              <div className="flex items-center gap-1.5 px-1 text-[11px] text-slate-600 font-medium">
                {isUser ? (
                  <>
                    <span>You</span>
                    <User className="w-3 h-3 text-slate-600" />
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#005FB8]" />
                    <span className="font-bold text-[#005FB8]">Health Memory</span>
                  </>
                )}
                <span className="text-[10px] text-slate-500 font-normal">· {msg.timestamp}</span>
              </div>

              {/* Message Box */}
              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[95%] sm:max-w-[90%] shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs font-medium'
                    : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 space-y-3.5'
                }`}
              >
                {/* Standard raw text if present */}
                {msg.text && (
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                )}

                {/* Structured Clinical Sections */}
                {msg.sections && (
                  <div className="space-y-3.5">
                    {msg.sections.headline && (
                      <h4 className="text-xs font-bold text-slate-900">
                        {msg.sections.headline}
                      </h4>
                    )}

                    {/* DOCUMENTED SECTION */}
                    {msg.sections.documented && msg.sections.documented.length > 0 && (
                      <div className="space-y-2">
                        {msg.sections.documented.map((sec, idx) => (
                          <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                              <span>{sec.icon || '📑'}</span>
                              <span>{sec.title}</span>
                            </div>
                            <ul className="space-y-1 pl-1">
                              {sec.items.map((item, i) => (
                                <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-normal">
                                  <span className="text-[#005FB8] font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* OBSERVED PATTERNS */}
                    {msg.sections.observed && msg.sections.observed.length > 0 && (
                      <div className="space-y-2">
                        {msg.sections.observed.map((sec, idx) => (
                          <div key={idx} className="bg-[#F0F6FF] p-2.5 rounded-xl border border-[#D0E2FB] space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#005FB8]">
                              <span>{sec.icon || '💡'}</span>
                              <span>{sec.title}</span>
                            </div>
                            <ul className="space-y-1 pl-1">
                              {sec.items.map((item, i) => (
                                <li key={i} className="text-[11px] text-slate-900 flex items-start gap-1.5 leading-normal">
                                  <span className="text-[#005FB8] font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* WORTH DISCUSSING WITH DOCTOR */}
                    {msg.sections.discuss && msg.sections.discuss.length > 0 && (
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Worth discussing with your doctor</span>
                        </div>
                        <ul className="space-y-1 pl-1">
                          {msg.sections.discuss.map((item, i) => (
                            <li key={i} className="text-[11px] text-amber-900 flex items-start gap-1.5 leading-normal font-medium">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* SOURCE CITATIONS (Key trust feature) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      <FileCheck className="w-3 h-3 text-[#005FB8]" />
                      <span>Based on {msg.sources.length} health records</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {msg.sources.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => onViewSource(src.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-slate-100 hover:bg-[#EBF3FC] hover:text-[#005FB8] hover:border-[#BEDCFD] border border-slate-200 rounded-lg text-slate-700 transition-colors active:scale-95 shadow-2xs"
                        >
                          <span>{src.title} · {src.date.split(',')[0]}</span>
                          <span className="text-[#005FB8] text-[11px]">↗</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Doctor Prep CTA button if relevant */}
                {msg.actionType === 'what_changed' && (
                  <div className="pt-2">
                    <button
                      onClick={onOpenDoctorPrep}
                      className="w-full py-2 px-3 bg-[#005FB8] hover:bg-[#004D99] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Generate Doctor Briefing from these changes →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EBF3FC] text-[#005FB8] flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#005FB8] animate-ping" />
              <span>Analyzing longitudinal records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Chat Input */}
      <div className="sticky bottom-16 pt-2 bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white p-1 rounded-2xl border border-slate-300 shadow-sm flex items-center gap-1"
        >
          <button
            type="button"
            onClick={() => handleTriggerQuestion('What were the findings of my August blood report?', 'custom')}
            className="p-2 text-slate-400 hover:text-[#005FB8] transition-colors"
            title="Voice simulation"
            aria-label="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            id="ask-ai-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about medications, lab trends, visits..."
            className="flex-1 py-2 px-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
          />

          <button
            id="ask-ai-submit-btn"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2 bg-[#005FB8] hover:bg-[#004D99] disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 shadow-xs flex items-center justify-center"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-500 mt-1.5 font-normal">
          Health Memory explains your stored records. It does not diagnose diseases.
        </p>
      </div>
    </div>
  );
};
