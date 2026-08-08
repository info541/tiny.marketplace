-- User profiles, saves, and ownership on reviews/posts
-- Run in: https://supabase.com/dashboard/project/crxvkpamidsnrezguntl/sql/new

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_brands (
  user_id uuid not null references auth.users (id) on delete cascade,
  brand_id uuid not null references public.brands (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, brand_id)
);

create table if not exists public.saved_products (
  user_id uuid not null references auth.users (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.reviews
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.community_posts
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists reviews_user_id_idx on public.reviews (user_id);
create index if not exists community_posts_user_id_idx on public.community_posts (user_id);
create index if not exists saved_brands_user_id_idx on public.saved_brands (user_id);
create index if not exists saved_products_user_id_idx on public.saved_products (user_id);

alter table public.profiles enable row level security;
alter table public.saved_brands enable row level security;
alter table public.saved_products enable row level security;

create policy "Public read profiles"
  on public.profiles for select using (true);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users read own saved brands"
  on public.saved_brands for select using (auth.uid() = user_id);

create policy "Users save brands"
  on public.saved_brands for insert with check (auth.uid() = user_id);

create policy "Users unsave brands"
  on public.saved_brands for delete using (auth.uid() = user_id);

create policy "Users read own saved products"
  on public.saved_products for select using (auth.uid() = user_id);

create policy "Users save products"
  on public.saved_products for insert with check (auth.uid() = user_id);

create policy "Users unsave products"
  on public.saved_products for delete using (auth.uid() = user_id);

create policy "Users insert own reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users update own reviews"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users delete own reviews"
  on public.reviews for delete using (auth.uid() = user_id);

create policy "Users insert own posts"
  on public.community_posts for insert with check (auth.uid() = user_id);

create policy "Users update own posts"
  on public.community_posts for update using (auth.uid() = user_id);

create policy "Users delete own posts"
  on public.community_posts for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for existing users
insert into public.profiles (id, display_name)
select id, split_part(email, '@', 1)
from auth.users
on conflict (id) do nothing;
