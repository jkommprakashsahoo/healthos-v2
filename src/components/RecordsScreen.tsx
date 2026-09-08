import React, { useState } from 'react';
import { FileText, Plus, Search, Filter, Calendar, Building2, User, CheckCircle2, ChevronRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { HealthDocument } from '../types';

interface RecordsScreenProps {
  documents: HealthDocument[];
  onSelectDocument: (doc: HealthDocument) => void;
  onOpenAddRecord: () => void;
}

type RecordCategory = 'all' | 'lab' | 'prescription' | 'note' | 'hospital' | 'imaging';

export const RecordsScreen: React.FC<RecordsScreenProps> = ({
  documents,
  onSelectDocument,
  onOpenAddRecord,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: RecordCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Records', count: documents.length },
    { id: 'lab', label: 'Lab Reports', count: documents.filter(d => d.category === 'labs').length },
    { id: 'prescription', label: 'Prescriptions', count: documents.filter(d => d.category === 'prescriptions').length },
    { id: 'note', label: 'Doctor Notes', count: documents.filter(d => d.category === 'visits').length },
    { id: 'hospital', label: 'Hospital Visits', count: documents.filter(d => d.category === 'hospital').length },
    { id: 'imaging', label: 'Imaging & Tests', count: documents.filter(d => d.category === 'imaging').length },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === 'all' ? true : doc.category === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.contentSummary.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-full pb-28 pt-4 px-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
            My Records
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            {documents.length} verified clinical documents in Health Memory.
          </p>
        </div>

        <button
          id="add-record-top-btn"
          onClick={onOpenAddRecord}
          className="py-2 px-3.5 bg-[#005FB8] hover:bg-[#004D99] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add record</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records by facility, doctor, or keyword..."
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

      {/* Categories Horizontal Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                isActive
                  ? 'bg-[#005FB8] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-blue-100' : 'bg-slate-100 text-slate-600'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Document Cards List */}
      {filteredDocs.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No records found</h4>
          <p className="text-xs text-slate-500 font-normal">
            No health documents matched your current category or search criteria.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="text-xs font-bold text-[#005FB8] hover:underline pt-1 inline-block"
          >
            Show all records
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-[#CDE1F8] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all cursor-pointer space-y-2.5 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                    {doc.fileType} · {doc.fileSize}
                  </span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {doc.date}
                  </span>
                </div>

                <span className="text-[10px] font-bold text-[#005FB8] bg-[#EBF3FC] border border-[#CDE1F8] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-[#005FB8]" />
                  {doc.extractedEventsCount} events extracted
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] border border-[#D0E2FB] text-[#005FB8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#005FB8] transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                    {doc.facility} · {doc.provider}
                  </p>
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-normal">
                {doc.contentSummary}
              </p>

              {/* Footer action link */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs font-semibold text-[#005FB8] group-hover:text-[#004D99]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  Tap to view document &amp; transcripts
                </span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
