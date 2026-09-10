import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { DoctorAppointment } from '../types';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const supabaseUrl = configuredUrl?.replace(/\/rest\/v1\/?$/, '');

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project') && !supabaseAnonKey.includes('your-')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export interface StoredProfile {
  id: string;
  name: string;
  dob: string;
  gender: string;
  blood_type: string;
  allergies: string[];
  phone: string;
}

export async function getStoredProfile(user: User): Promise<StoredProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, dob, gender, blood_type, allergies, phone')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveStoredProfile(profile: Omit<StoredProfile, 'id'>, userId: string) {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile }, { onConflict: 'id' })
    .select('id, name, dob, gender, blood_type, allergies, phone')
    .single();
  if (error) throw error;
  return data as StoredProfile;
}

export interface StoredAppointment {
  id: string;
  user_id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string; // ISO date, e.g. "2026-09-12"
  appointment_time: string | null; // "HH:MM" 24h
  location: string | null;
  notes: string | null;
  created_at?: string;
}

export async function getAppointments(userId: string): Promise<StoredAppointment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('doctor_appointments')
    .select('id, user_id, doctor_name, specialty, appointment_date, appointment_time, location, notes, created_at')
    .eq('user_id', userId)
    .order('appointment_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function saveAppointment(
  input: Omit<StoredAppointment, 'id' | 'user_id' | 'created_at'>,
  userId: string
): Promise<StoredAppointment> {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase
    .from('doctor_appointments')
    .insert({ user_id: userId, ...input })
    .select('id, user_id, doctor_name, specialty, appointment_date, appointment_time, location, notes, created_at')
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAppointment(id: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { error } = await supabase.from('doctor_appointments').delete().eq('id', id);
  if (error) throw error;
}

function formatAppointmentTime(time24: string | null): string | undefined {
  if (!time24) return undefined;
  const [hStr, mStr] = time24.split(':');
  let hours = parseInt(hStr, 10);
  if (Number.isNaN(hours)) return undefined;
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${mStr} ${period}`;
}

export function toDoctorAppointment(row: StoredAppointment): DoctorAppointment {
  const dateObj = new Date(`${row.appointment_date}T00:00:00`);
  const displayDate = Number.isNaN(dateObj.getTime())
    ? row.appointment_date
    : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return {
    id: row.id,
    doctorName: row.doctor_name,
    specialty: row.specialty || undefined,
    isoDate: row.appointment_date,
    date: displayDate,
    time: formatAppointmentTime(row.appointment_time),
    location: row.location || undefined,
    notes: row.notes || undefined,
  };
}

export function toPatientProfile(profile: StoredProfile) {
  const age = profile.dob
    ? Math.max(0, new Date().getFullYear() - new Date(profile.dob).getFullYear())
    : 0;
  return {
    name: profile.name,
    age,
    dob: profile.dob,
    gender: profile.gender,
    bloodType: profile.blood_type || 'Unknown',
    allergies: profile.allergies || [],
    pcp: 'Not provided',
    facility: 'Not provided',
    emergencyContact: profile.phone || 'Not provided',
    organizePercentage: 0,
    totalTimelineEvents: 0,
    totalDocuments: 0,
    totalMedications: 0,
    totalLabResults: 0,
  };
}
