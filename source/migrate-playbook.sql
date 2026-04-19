-- ══════════════════════════════════════════════════════════
-- CSAP Product Knowledge — Fase 2: Playbook Tables
-- Jalankan file ini di Supabase SQL Editor
-- ══════════════════════════════════════════════════════════

-- Executive summary per divisi
create table if not exists playbook_divisions (
  id           uuid default gen_random_uuid() primary key,
  division_no  int  not null unique,
  title        text not null,
  tagline      text,
  key_takeaway text,
  created_at   timestamptz default now()
);

-- Market gap analysis (per brand)
create table if not exists playbook_gap_analysis (
  id               uuid default gen_random_uuid() primary key,
  brand_id         uuid references brands(id) on delete cascade,
  threat_level     text check (threat_level in ('LOW','LOW-MED','MEDIUM','MEDIUM-HIGH','HIGH','VERY HIGH')),
  opportunity_level text check (opportunity_level in ('LOW','LOW-MED','MEDIUM','MEDIUM-HIGH','HIGH','VERY HIGH')),
  note             text,
  sort_order       int default 0,
  created_at       timestamptz default now()
);

-- Killer arguments (per brand)
create table if not exists playbook_killer_args (
  id              uuid default gen_random_uuid() primary key,
  brand_id        uuid references brands(id) on delete cascade,
  vs_competitor   text not null,
  argument_text   text not null,
  cheatsheet_note text,                -- ringkasan 1 kalimat untuk cheatsheet
  sort_order      int default 0,
  created_at      timestamptz default now()
);

-- Bundling packages
create table if not exists playbook_packages (
  id             uuid default gen_random_uuid() primary key,
  package_name   text not null,
  target_segment text,
  selling_point  text,
  sort_order     int default 0,
  created_at     timestamptz default now()
);

-- Package items
create table if not exists playbook_package_items (
  id           uuid default gen_random_uuid() primary key,
  package_id   uuid references playbook_packages(id) on delete cascade,
  brand_id     uuid references brands(id) on delete set null,
  custom_label text,                   -- label teks bebas (atau override nama brand)
  sort_order   int default 0
);

-- Indexes
create index if not exists idx_gap_brand     on playbook_gap_analysis(brand_id);
create index if not exists idx_args_brand    on playbook_killer_args(brand_id);
create index if not exists idx_pkgitems_pkg  on playbook_package_items(package_id);
create index if not exists idx_pkgitems_bnd  on playbook_package_items(brand_id);

-- ── RLS ────────────────────────────────────────────────────
alter table playbook_divisions     enable row level security;
alter table playbook_gap_analysis  enable row level security;
alter table playbook_killer_args   enable row level security;
alter table playbook_packages      enable row level security;
alter table playbook_package_items enable row level security;

-- Public read
create policy "Public read" on playbook_divisions     for select using (true);
create policy "Public read" on playbook_gap_analysis  for select using (true);
create policy "Public read" on playbook_killer_args   for select using (true);
create policy "Public read" on playbook_packages      for select using (true);
create policy "Public read" on playbook_package_items for select using (true);

-- Anon write — TEMPORARY, akan di-restrict di Fase 4
create policy "Anon write" on playbook_divisions     for all using (true) with check (true);
create policy "Anon write" on playbook_gap_analysis  for all using (true) with check (true);
create policy "Anon write" on playbook_killer_args   for all using (true) with check (true);
create policy "Anon write" on playbook_packages      for all using (true) with check (true);
create policy "Anon write" on playbook_package_items for all using (true) with check (true);
