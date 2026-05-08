create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'estimator' check (role in ('admin', 'estimator', 'viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references public.clients(id) on delete set null,
  project_name text not null,
  project_address text,
  status text not null default 'draft' check (status in ('draft', 'for_review', 'approved', 'archived')),
  prepared_by uuid references public.profiles(id) on delete set null,
  estimate_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_person text,
  phone text,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.material_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique
);

create table if not exists public.materials (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.material_categories(id) on delete set null,
  name text not null,
  unit text not null,
  default_price numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_material_prices (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid references public.suppliers(id) on delete cascade,
  material_id uuid references public.materials(id) on delete cascade,
  price numeric(12,2) not null default 0,
  effective_date date not null default current_date,
  created_at timestamptz not null default now(),
  unique (supplier_id, material_id, effective_date)
);

create table if not exists public.estimates (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null default 'Main Estimate',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.estimate_sections (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

create table if not exists public.estimate_items (
  id uuid primary key default uuid_generate_v4(),
  estimate_id uuid not null references public.estimates(id) on delete cascade,
  section_id uuid references public.estimate_sections(id) on delete set null,
  material_id uuid references public.materials(id) on delete set null,
  description text not null,
  quantity numeric(12,3) not null default 0,
  unit text not null,
  unit_price numeric(12,2) not null default 0,
  line_total numeric(12,2) generated always as (quantity * unit_price) stored,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.project_calculations (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  calculator_type text not null,
  inputs jsonb not null default '{}'::jsonb,
  outputs jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.suppliers enable row level security;
alter table public.material_categories enable row level security;
alter table public.materials enable row level security;
alter table public.supplier_material_prices enable row level security;
alter table public.estimates enable row level security;
alter table public.estimate_sections enable row level security;
alter table public.estimate_items enable row level security;
alter table public.project_calculations enable row level security;

create policy "authenticated users can read profiles" on public.profiles for select to authenticated using (true);
create policy "users can update own profile" on public.profiles for update to authenticated using (auth.uid() = id);

create policy "authenticated read clients" on public.clients for select to authenticated using (true);
create policy "authenticated write clients" on public.clients for all to authenticated using (true) with check (true);

create policy "authenticated read projects" on public.projects for select to authenticated using (true);
create policy "authenticated write projects" on public.projects for all to authenticated using (true) with check (true);

create policy "authenticated read suppliers" on public.suppliers for select to authenticated using (true);
create policy "authenticated write suppliers" on public.suppliers for all to authenticated using (true) with check (true);

create policy "authenticated read categories" on public.material_categories for select to authenticated using (true);
create policy "authenticated write categories" on public.material_categories for all to authenticated using (true) with check (true);

create policy "authenticated read materials" on public.materials for select to authenticated using (true);
create policy "authenticated write materials" on public.materials for all to authenticated using (true) with check (true);

create policy "authenticated read supplier prices" on public.supplier_material_prices for select to authenticated using (true);
create policy "authenticated write supplier prices" on public.supplier_material_prices for all to authenticated using (true) with check (true);

create policy "authenticated read estimates" on public.estimates for select to authenticated using (true);
create policy "authenticated write estimates" on public.estimates for all to authenticated using (true) with check (true);

create policy "authenticated read sections" on public.estimate_sections for select to authenticated using (true);
create policy "authenticated write sections" on public.estimate_sections for all to authenticated using (true) with check (true);

create policy "authenticated read items" on public.estimate_items for select to authenticated using (true);
create policy "authenticated write items" on public.estimate_items for all to authenticated using (true) with check (true);

create policy "authenticated read calculations" on public.project_calculations for select to authenticated using (true);
create policy "authenticated write calculations" on public.project_calculations for all to authenticated using (true) with check (true);

insert into public.material_categories (name) values
  ('Concrete'), ('Aggregates'), ('Masonry'), ('Tile Works'), ('Painting'), ('Electrical'), ('Plumbing')
on conflict (name) do nothing;
