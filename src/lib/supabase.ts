import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

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
