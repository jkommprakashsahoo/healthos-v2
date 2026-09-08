import React, { useEffect, useState } from 'react';
import { Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { getStoredProfile, saveStoredProfile, StoredProfile, supabase, toPatientProfile } from '../lib/supabase';
import { PatientProfile } from '../types';

type AuthMode = 'email' | 'phone';

interface AuthGateProps {
  children: (patient: PatientProfile) => React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, nextSession: Session | null) => {
      setSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getStoredProfile(session.user)
      .then(setProfile)
      .catch((profileError) => setError(profileError.message))
      .finally(() => setLoading(false));
  }, [session]);

  if (!supabase) return <AuthMessage message="Connect Supabase to start Health Memory. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env." />;
  if (loading) return <AuthMessage message="Loading your secure health space..." />;
  if (!session) return <LoginPanel onError={setError} error={error} />;
  if (!profile) return <ProfileSetup userId={session.user.id} initialName={session.user.user_metadata?.full_name || ''} onSaved={setProfile} onError={setError} error={error} />;
  return <>{children(toPatientProfile(profile))}</>;
};

const AuthMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="min-h-full flex items-center justify-center p-6 bg-slate-50">
    <div className="max-w-sm text-center space-y-3">
      <ShieldCheck className="mx-auto w-10 h-10 text-[#005FB8]" />
      <h1 className="text-xl font-black text-slate-900">Health Memory</h1>
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  </div>
);

const LoginPanel: React.FC<{ onError: (message: string) => void; error: string }> = ({ onError, error }) => {
  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<{ error: { message: string } | null }>) => {
    setBusy(true);
    onError('');
    const result = await action();
    setBusy(false);
    if (result.error) onError(result.error.message);
  };

  const submitEmail = (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) return;
    const client = supabase;
    run(async () => {
      const result = await client.auth.signInWithPassword({ email, password });
      if (result.error?.message?.toLowerCase().includes('invalid login')) {
        const signUp = await client.auth.signUp({ email, password });
        if (!signUp.error) return signUp;
      }
      return result;
    });
  };

  const sendOtp = () => run(() => supabase!.auth.signInWithOtp({ phone }));
  const verifyOtp = (event: React.FormEvent) => {
    event.preventDefault();
    return run(() => supabase!.auth.verifyOtp({ phone, token: otp, type: 'sms' }));
  };

  return (
    <div className="min-h-full flex items-center justify-center p-5 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-5">
        <div className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#005FB8] text-white flex items-center justify-center"><ShieldCheck /></div>
          <h1 className="text-2xl font-black text-slate-900">Your health memory, private by default</h1>
          <p className="text-sm text-slate-500">Sign in before any health information is shown.</p>
        </div>
        <button onClick={() => run(() => supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }))} className="w-full py-3 rounded-xl bg-slate-900 text-white text-sm font-bold">Continue with Google</button>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode('email')} className={`py-2.5 rounded-xl text-xs font-bold border ${mode === 'email' ? 'bg-[#EBF3FC] border-[#005FB8] text-[#005FB8]' : 'border-slate-200 text-slate-600'}`}><Mail className="inline w-4 h-4 mr-1" />Email</button>
          <button onClick={() => setMode('phone')} className={`py-2.5 rounded-xl text-xs font-bold border ${mode === 'phone' ? 'bg-[#EBF3FC] border-[#005FB8] text-[#005FB8]' : 'border-slate-200 text-slate-600'}`}><Phone className="inline w-4 h-4 mr-1" />Phone OTP</button>
        </div>
        {mode === 'email' ? (
          <form onSubmit={submitEmail} className="space-y-3">
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" className="w-full p-3 rounded-xl border border-slate-200 text-sm" />
            <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" className="w-full p-3 rounded-xl border border-slate-200 text-sm" />
            <button disabled={busy} className="w-full py-3 rounded-xl bg-[#005FB8] text-white text-sm font-bold disabled:opacity-50">{busy ? 'Signing in...' : 'Sign in or create account'}</button>
          </form>
        ) : (
          <form onSubmit={otpSent ? verifyOtp : (event) => { event.preventDefault(); sendOtp(); setOtpSent(true); }} className="space-y-3">
            <input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone with country code, e.g. +15551234567" className="w-full p-3 rounded-xl border border-slate-200 text-sm" />
            {otpSent && <input required inputMode="numeric" value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="Verification code" className="w-full p-3 rounded-xl border border-slate-200 text-sm" />}
            <button disabled={busy} className="w-full py-3 rounded-xl bg-[#005FB8] text-white text-sm font-bold disabled:opacity-50">{busy ? 'Working...' : otpSent ? 'Verify code' : 'Send verification code'}</button>
          </form>
        )}
        {error && <p role="alert" className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</p>}
      </div>
    </div>
  );
};

const ProfileSetup: React.FC<{ userId: string; initialName: string; onSaved: (profile: StoredProfile) => void; onError: (message: string) => void; error: string }> = ({ userId, initialName, onSaved, onError, error }) => {
  const [name, setName] = useState(initialName);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); onError('');
    try {
      const profile = await saveStoredProfile({ name, dob, gender, blood_type: bloodType, allergies: allergies.split(',').map((item) => item.trim()).filter(Boolean), phone }, userId);
      onSaved(profile);
    } catch (saveError) { onError(saveError instanceof Error ? saveError.message : 'Could not save your profile.'); }
    finally { setBusy(false); }
  };
  return <div className="min-h-full flex items-center justify-center p-5 bg-slate-50"><form onSubmit={submit} className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-3"><div className="text-center mb-4"><UserRound className="mx-auto w-9 h-9 text-[#005FB8]" /><h1 className="text-xl font-black text-slate-900">Set up your profile</h1><p className="text-sm text-slate-500">These details belong to you and help organize uploaded records.</p></div><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><input required type="date" value={dob} onChange={(event) => setDob(event.target.value)} className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><input required value={gender} onChange={(event) => setGender(event.target.value)} placeholder="Gender" className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><input value={bloodType} onChange={(event) => setBloodType(event.target.value)} placeholder="Blood type (optional)" className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><input value={allergies} onChange={(event) => setAllergies(event.target.value)} placeholder="Allergies, separated by commas" className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Contact phone (optional)" className="w-full p-3 rounded-xl border border-slate-200 text-sm" /><button disabled={busy} className="w-full py-3 rounded-xl bg-[#005FB8] text-white text-sm font-bold disabled:opacity-50">{busy ? 'Saving...' : 'Enter my health memory'}</button>{error && <p role="alert" className="text-xs text-rose-700 bg-rose-50 rounded-xl p-3">{error}</p>}</form></div>;
};
