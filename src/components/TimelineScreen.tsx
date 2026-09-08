import React, { useState } from 'react';
import { Search, Activity, Stethoscope, Pill, Building, AlertTriangle, ChevronRight, FileText, Sparkles, Filter } from 'lucide-react';
import { TimelineEvent } from '../types';

interface TimelineScreenProps {
  timelineEvents: TimelineEvent[];
  onSelectEvent: (event: TimelineEvent) => void;
  onOpenAddRecord: () => void;
}

type FilterCategory = 'all' | 'lab' | 'medication' | 'visit' | 'symptom';

export const TimelineScreen: React.FC<TimelineScreenProps> = ({
  timelineEvents,
  onSelectEvent,
  onOpenAddRecord,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterChips: { id: FilterCategory; label: string; icon?: any }[] = [
    { id: 'all', label: 'All' },
    { id: 'lab', label: 'Labs', icon: Activity },
    { id: 'medication', label: 'Medicines', icon: Pill },
    { id: 'visit', label: 'Visits', icon: Stethoscope },
    { id: 'symptom', label: 'Symptoms', icon: AlertTriangle },
  ];

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
      case 'symptom':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  const getEventBg = (type: string) => {
    switch (type) {
      case 'lab':
        return 'border-emerald-200 bg-emerald-50/60 text-emerald-800';
      case 'visit':
        return 'border-[#CDE1F8] bg-[#EBF3FC] text-[#005FB8]';
      case 'medication':
        return 'border-purple-200 bg-purple-50/60 text-purple-800';
      case 'hospital':
        return 'border-rose-200 bg-rose-50/60 text-rose-800';
      case 'symptom':
        return 'border-amber-200 bg-amber-50/60 text-amber-800';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  // Filtered Events
  const filteredEvents = timelineEvents.filter((event) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'visit'
        ? event.type === 'visit' || event.type === 'hospital'
        : event.type === activeFilter;

    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Group events by Month
  const groupedEvents: { [key: string]: TimelineEvent[] } = {};
  filteredEvents.forEach((evt) => {
    const key = evt.monthGroup || 'Past Events';
    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }
    groupedEvents[key].push(evt);
  });

  return (
    <div className="min-h-full pb-28 pt-4 px-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            Health Timeline
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Your health history, connected over time.
          </p>
        </div>
        <button
          onClick={onOpenAddRecord}
          className="px-3.5 py-1.5 bg-[#005FB8] hover:bg-[#004D99] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search test results, visits, medications..."
          className="w-full pl-9.5 pr-4 py-2.5 bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005FB8]/20 focus:border-[#005FB8] transition-all placeholder:text-slate-400 font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[11px] text-slate-500 hover:text-slate-800 font-bold absolute right-3 top-1/2 -translate-y-1/2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip.id;
          return (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? 'bg-[#005FB8] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Longitudinal Vertical Timeline */}
      {Object.keys(groupedEvents).length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
          <Filter className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No events matched</h4>
          <p className="text-xs text-slate-500">
            Try clearing your search query or selecting &quot;All&quot; filters.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#005FB8] hover:underline pt-1 inline-block"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6 pt-1">
          {Object.entries(groupedEvents).map(([month, events]) => (
            <div key={month} className="space-y-3">
              {/* Month Header Stamp */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-white border border-slate-200 px-2.5 py-0.5 rounded-md">
                  {month}
                </span>
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-[11px] text-slate-500 font-medium">
                  {events.length} {events.length === 1 ? 'event' : 'events'}
                </span>
              </div>

              {/* Vertical connected events list */}
              <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {events.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className="relative group cursor-pointer"
                  >
                    {/* Node Dot on vertical line */}
                    <div className="absolute -left-6 top-3.5 w-3 h-3 rounded-full bg-white border-2 border-slate-400 group-hover:border-[#005FB8] group-hover:scale-125 transition-all shadow-2xs z-10" />

                    {/* Timeline Event Card */}
                    <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] group-hover:border-[#CDE1F8] transition-all space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getEventBg(event.type)}`}>
                            {event.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {event.date}
                          </span>
                        </div>

                        {event.badgeText && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            {event.badgeText}
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F7F8FA] border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            {event.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Extracted points preview snippet */}
                      {event.extractedInfo && event.extractedInfo.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {event.extractedInfo.slice(0, 3).map((info, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                            >
                              {info.label}: <strong className="text-slate-900">{info.value}</strong>
                            </span>
                          ))}
                          {event.extractedInfo.length > 3 && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded-md font-semibold">
                              +{event.extractedInfo.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tap to open prompt */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-[#005FB8] font-semibold group-hover:text-[#004D99]">
                        <span>Tap to view details & source</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
