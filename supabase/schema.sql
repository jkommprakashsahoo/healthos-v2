create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  dob date not null,
  gender text not null,
  blood_type text default '',
  allergies text[] default '{}',
  phone text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can create their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

insert into storage.buckets (id, name, public)
values ('health-documents', 'health-documents', false)
on conflict (id) do nothing;

create policy "Users can manage their own health documents"
on storage.objects for all
using (bucket_id = 'health-documents' and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id = 'health-documents' and (storage.foldername(name))[1] = auth.uid()::text);
