import React, { useState } from 'react';
import { User, Shield, Lock, FileText, Activity, Pill, Clock, RefreshCw, CheckCircle2, ChevronRight, Heart, Smartphone, Database, Info, AlertTriangle, LogOut, Mail, KeyRound } from 'lucide-react';
import { PatientProfile, TimelineEvent, HealthDocument } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileScreenProps {
  patient: PatientProfile;
  timelineEvents: TimelineEvent[];
  documents: HealthDocument[];
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  patient,
  timelineEvents,
  documents,
  onResetData,
}) => {
  const [syncedSources, setSyncedSources] = useState({
    appleHealth: true,
    epicMyChart: true,
    questDiagnostics: true,
    labcorp: false,
  });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetToast, setResetToast] = useState(false);
  const [accountPanel, setAccountPanel] = useState<'email' | 'password' | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [accountMessage, setAccountMessage] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountBusy, setAccountBusy] = useState(false);

  const toggleSource = (source: keyof typeof syncedSources) => {
    setSyncedSources(prev => ({ ...prev, [source]: !prev[source] }));
  };

  const handleTriggerReset = () => {
    onResetData();
    setShowResetConfirm(false);
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  const handleAccountUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    setAccountBusy(true);
    setAccountError('');
    setAccountMessage('');
    const update = accountPanel === 'email'
      ? await supabase.auth.updateUser({ email: newEmail })
      : await supabase.auth.updateUser({ password: newPassword });
    setAccountBusy(false);
    if (update.error) {
      setAccountError(update.error.message);
      return;
    }
    setAccountMessage(accountPanel === 'email' ? 'Check your new email address to confirm the change.' : 'Your password has been changed.');
    setNewEmail('');
    setNewPassword('');
    setAccountPanel(null);
  };

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
  };

  // Stats calculation
  const totalEvents = timelineEvents.length;
  const totalDocs = documents.length;
  const totalMeds = 5;
  const totalLabs = 6;
  const organizedPercentage = Math.min(100, Math.round((totalEvents / 28) * 100));

  return (
    <div className="min-h-full pb-28 pt-4 px-4 space-y-4">
      {/* Toast Feedback */}
      {resetToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Demo data restored to initial baseline state.</span>
        </div>
      )}

      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight font-display">
          Health Memory
        </h1>
        <p className="text-xs text-slate-500 font-normal">
          Memory overview &amp; privacy controls.
        </p>
      </div>

      {/* Patient Profile Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#005FB8] text-white flex items-center justify-center font-bold text-lg shadow-xs">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {patient.name}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Age {patient.age} · Blood Type {patient.bloodType}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Primary Care</span>
            <p className="font-bold text-slate-800 mt-0.5">{patient.pcp}</p>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Emergency Contact</span>
            <p className="font-bold text-slate-800 mt-0.5">{patient.emergencyContact}</p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#005FB8]" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account security</h3>
        </div>
        <p className="text-[11px] text-slate-500 truncate">Signed in account settings</p>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setAccountPanel('email'); setAccountError(''); setAccountMessage(''); }} className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50">
            <Mail className="w-3.5 h-3.5" /> Change email
          </button>
          <button onClick={() => { setAccountPanel('password'); setAccountError(''); setAccountMessage(''); }} className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50">
            <KeyRound className="w-3.5 h-3.5" /> Change password
          </button>
        </div>
        {accountPanel && (
          <form onSubmit={handleAccountUpdate} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="text-[10px] font-bold uppercase text-slate-500">{accountPanel === 'email' ? 'New email address' : 'New password'}</label>
            <input required minLength={accountPanel === 'password' ? 6 : undefined} type={accountPanel === 'email' ? 'email' : 'password'} value={accountPanel === 'email' ? newEmail : newPassword} onChange={(event) => accountPanel === 'email' ? setNewEmail(event.target.value) : setNewPassword(event.target.value)} placeholder={accountPanel === 'email' ? 'you@example.com' : 'At least 6 characters'} className="w-full p-2.5 rounded-lg border border-slate-200 text-xs" />
            <div className="flex gap-2">
              <button disabled={accountBusy} className="flex-1 py-2 rounded-lg bg-[#005FB8] text-white text-xs font-bold disabled:opacity-50">{accountBusy ? 'Saving...' : 'Save change'}</button>
              <button type="button" onClick={() => setAccountPanel(null)} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold">Cancel</button>
            </div>
          </form>
        )}
        {accountMessage && <p className="text-[11px] text-emerald-700 bg-emerald-50 rounded-lg p-2">{accountMessage}</p>}
        {accountError && <p role="alert" className="text-[11px] text-rose-700 bg-rose-50 rounded-lg p-2">{accountError}</p>}
        <button onClick={handleLogout} className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 hover:bg-rose-100">
          <LogOut className="w-3.5 h-3.5" /> Log out
        </button>
      </div>

      {/* MEMORY OVERVIEW & STATS */}
      <div className="p-4.5 bg-gradient-to-br from-[#0A1628] to-[#0F2240] text-white rounded-2xl shadow-xs border border-blue-500/20 space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
              Longitudinal Coverage
            </span>
            <h3 className="text-lg font-black text-white font-display">
              {organizedPercentage}% Organized
            </h3>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-200 font-bold text-sm">
            {organizedPercentage}%
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#005FB8] h-full rounded-full transition-all duration-500"
            style={{ width: `${organizedPercentage}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-300 leading-snug font-normal">
          Percentage of uploaded clinical information, prescriptions, and lab records structured into your longitudinal Health Memory.
        </p>

        {/* 4 Stat Badges Grid */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
            <span className="block text-base font-extrabold text-blue-200">{totalEvents}</span>
            <span className="text-[10px] text-slate-300 font-medium">Events</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
            <span className="block text-base font-extrabold text-blue-200">{totalDocs}</span>
            <span className="text-[10px] text-slate-300 font-medium">Docs</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
            <span className="block text-base font-extrabold text-blue-200">{totalMeds}</span>
            <span className="text-[10px] text-slate-300 font-medium">Meds</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/10">
            <span className="block text-base font-extrabold text-blue-200">{totalLabs}</span>
            <span className="text-[10px] text-slate-300 font-medium">Labs</span>
          </div>
        </div>
      </div>

      {/* CONNECTED HEALTH SOURCES */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Connected Health Record Sources
        </h3>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Apple Health &amp; Vitals</span>
                <span className="text-[10px] text-slate-500">Continuous sync active</span>
              </div>
            </div>
            <button
              onClick={() => toggleSource('appleHealth')}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                syncedSources.appleHealth ? 'bg-[#005FB8]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  syncedSources.appleHealth ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#005FB8] flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Epic MyChart EHR</span>
                <span className="text-[10px] text-slate-500">Metro Health System linked</span>
              </div>
            </div>
            <button
              onClick={() => toggleSource('epicMyChart')}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                syncedSources.epicMyChart ? 'bg-[#005FB8]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  syncedSources.epicMyChart ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Quest Diagnostics</span>
                <span className="text-[10px] text-slate-500">Automated lab results feed</span>
              </div>
            </div>
            <button
              onClick={() => toggleSource('questDiagnostics')}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                syncedSources.questDiagnostics ? 'bg-[#005FB8]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  syncedSources.questDiagnostics ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* PRIVACY & OWNERSHIP (Transparent statement) */}
      <div className="p-4 bg-white rounded-2xl border border-[#CDE1F8] space-y-2.5 text-xs text-slate-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 font-bold text-slate-900 uppercase tracking-wider">
          <Shield className="w-4 h-4 text-[#005FB8]" />
          <span>Your Health Data Ownership</span>
        </div>
        <p className="leading-relaxed font-normal">
          Health Memory is an intelligent longitudinal assistant designed to remember, organize, connect, and explain your personal medical documents.
        </p>
        <ul className="space-y-1.5 pl-1 text-[11px] text-slate-600">
          <li className="flex items-start gap-1.5">
            <span className="text-[#005FB8] font-bold">•</span>
            <span><strong>Factual Grounding:</strong> Every explanation is directly cited from records you upload.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[#005FB8] font-bold">•</span>
            <span><strong>Non-Diagnostic:</strong> Health Memory is NOT an AI doctor and never provides autonomous medical diagnoses. Always consult your physician.</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-[#005FB8] font-bold">•</span>
            <span><strong>Data Portability:</strong> You can export clinical summaries, view source scans, or reset records anytime.</span>
          </li>
        </ul>
      </div>

      {/* Reset Demo Data Button */}
      <div className="pt-1">
        {showResetConfirm ? (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2 text-center">
            <p className="text-xs font-bold text-rose-900">
              Reset all timeline events and records to initial demo state?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleTriggerReset}
                className="flex-1 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                Yes, Reset Data
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Benchmark State</span>
          </button>
        )}
      </div>
    </div>
  );
};
