import React, { useState } from 'react';
import { Sparkles, Mic, ArrowRight, Calendar, Activity, Stethoscope, Pill, Building, ChevronRight, Zap, Play } from 'lucide-react';
import { TimelineEvent } from '../types';

interface HomeScreenProps {
  timelineEvents: TimelineEvent[];
  onOpenDoctorPrep: () => void;
  onNavigateTab: (tab: 'home' | 'timeline' | 'ask_ai' | 'records' | 'profile') => void;
  onSelectAiQuestion: (question: string, actionType?: 'what_changed' | 'previous_episodes' | 'doctor_prep' | 'summary' | 'custom') => void;
  onSelectEvent: (event: TimelineEvent) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  timelineEvents,
  onOpenDoctorPrep,
  onNavigateTab,
  onSelectAiQuestion,
  onSelectEvent,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const suggestedChips = [
    { label: 'What changed recently?', actionType: 'what_changed' as const },
    { label: 'Previous episodes', actionType: 'previous_episodes' as const },
    { label: 'Prepare for my doctor', actionType: 'doctor_prep' as const },
    { label: 'Summarize my health', actionType: 'summary' as const },
    { label: 'My medicines', actionType: 'custom' as const },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSelectAiQuestion(searchInput.trim(), 'custom');
      setSearchInput('');
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'lab':
        return <Activity className="w-4 h-4 text-emerald-600" />;
      case 'visit':
        return <Stethoscope className="w-4 h-4 text-[#005FB8]" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-purple-600" />;
      case 'hospital':
        return <Building className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-[#005FB8]" />;
    }
  };

  // Recent compact events
  const recentEvents = timelineEvents.slice(0, 4);

  return (
    <div className="min-h-full pb-28 pt-4 px-4 space-y-4">
      {/* Hackathon 30-Second Hero Banner for fast evaluation */}
      <div className="bg-gradient-to-r from-[#002D59] via-[#004080] to-[#005FB8] text-white p-3.5 rounded-2xl border border-blue-400/20 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-200">
            <Zap className="w-3.5 h-3.5 fill-blue-200 text-blue-200" />
            30-Sec Hackathon Hero Demo
          </span>
          <span className="text-[10px] bg-white/15 text-blue-100 border border-white/20 px-2 py-0.5 rounded-full font-semibold">
            One-Tap Tour
          </span>
        </div>
        <p className="text-[11px] text-blue-100/90 leading-snug mb-2.5">
          Tap the steps below to experience how Health Memory connects history into actionable intelligence:
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onSelectAiQuestion('What has changed since my last check-up?', 'what_changed')}
            className="py-1.5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl text-[10px] font-bold text-blue-100 border border-white/15 flex items-center justify-center gap-1 text-center transition-all"
          >
            <Play className="w-2.5 h-2.5 fill-blue-200 text-blue-200 shrink-0" />
            1. What changed?
          </button>
          <button
            onClick={() => onSelectAiQuestion('Show me previous episodes related to my reflux and visits', 'previous_episodes')}
            className="py-1.5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl text-[10px] font-bold text-blue-100 border border-white/15 flex items-center justify-center gap-1 text-center transition-all"
          >
            <Play className="w-2.5 h-2.5 fill-blue-200 text-blue-200 shrink-0" />
            2. Episodes
          </button>
          <button
            onClick={onOpenDoctorPrep}
            className="py-1.5 px-2 bg-white hover:bg-blue-50 active:bg-blue-100 rounded-xl text-[10px] font-bold text-[#003D7A] flex items-center justify-center gap-1 text-center transition-all shadow-xs"
          >
            <Sparkles className="w-2.5 h-2.5 text-[#005FB8] shrink-0" />
            3. Doctor Prep
          </button>
        </div>
      </div>

      {/* Top Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#005FB8] tracking-wide">
            Good morning 👋
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3FC] border border-[#CDE1F8] text-[#005FB8] text-[11px] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#005FB8] animate-pulse" />
            87% Organized
          </div>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
          Your Health Memory
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          Everything important from your health history, in one place.
        </p>
      </div>

      {/* PRIMARY AI INTERACTION: ASK YOUR HEALTH MEMORY */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-[#005FB8]" />
          <span>Ask Your Health Memory</span>
        </div>

        {/* Large Rounded Search/Chat Field */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            id="home-ai-search-input"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="What would you like to know?"
            className="w-full pl-4 pr-22 py-3 bg-[#F7F8FA] hover:bg-slate-100/80 focus:bg-white text-xs font-medium text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8] transition-all placeholder:text-slate-400"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelectAiQuestion('What changed recently in my health records?', 'what_changed')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#005FB8] hover:bg-[#EBF3FC] transition-colors"
              title="Voice query simulation"
              aria-label="Voice dictation"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              id="home-ai-search-submit"
              type="submit"
              className="p-2 rounded-lg bg-[#005FB8] hover:bg-[#004D99] active:scale-95 text-white shadow-xs transition-all flex items-center justify-center"
              aria-label="Send question"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Suggested horizontal scrolling chips */}
        <div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Suggested Queries
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                id={`suggested-chip-${idx}`}
                onClick={() => onSelectAiQuestion(chip.label, chip.actionType)}
                className="shrink-0 px-3.5 py-1.5 bg-[#F7F8FA] hover:bg-[#EBF3FC] hover:text-[#005FB8] hover:border-[#BEDCFD] border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 whitespace-nowrap transition-all active:scale-95 shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* APPOINTMENT CARD */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003D7A] via-[#004A94] to-[#002B57] text-white p-4.5 rounded-2xl shadow-xs border border-blue-500/30">
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-blue-100">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Doctor appointment
                </span>
                <h3 className="text-sm font-bold text-white">
                  Tomorrow · 10:30 AM
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-white/15 text-blue-100 border border-white/20 px-2 py-0.5 rounded-full">
              Dr. Sarah Jenkins
            </span>
          </div>

          <p className="text-xs text-blue-50/90 font-normal leading-relaxed">
            Your health briefing is ready with recent LDL progress, fasting blood sugar notes, and discussion questions.
          </p>

          <button
            id="prepare-briefing-home-btn"
            onClick={onOpenDoctorPrep}
            className="w-full py-2.5 px-4 bg-white hover:bg-blue-50 active:bg-blue-100 text-[#003D7A] font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-[0.98]"
          >
            <span>Prepare briefing →</span>
          </button>
        </div>
      </div>

      {/* RECENT HEALTH EVENTS (Compact Timeline) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Recent Health Events
          </h3>
          <button
            id="view-full-timeline-header-btn"
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-bold text-[#005FB8] hover:text-[#004D99] flex items-center gap-0.5"
          >
            <span>View full timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compact Timeline Cards */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] divide-y divide-slate-100">
          {recentEvents.map((event, idx) => (
            <div
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="py-2.5 px-2 hover:bg-[#F7F8FA] rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#F7F8FA] border border-slate-200 group-hover:border-[#CDE1F8] flex items-center justify-center shrink-0 transition-colors">
                  {getEventIcon(event.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {idx === 0 ? 'Today' : event.date.split(',')[0]}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {event.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate font-normal">
                    {event.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#005FB8] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          ))}
        </div>

        <button
          id="view-full-timeline-bottom-btn"
          onClick={() => onNavigateTab('timeline')}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>View all {timelineEvents.length} timeline events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
