begin;

grant usage on schema public to anon, authenticated;

grant select on public.categories, public.ingredients to anon, authenticated;
grant select on public.recipes, public.recipe_ingredients, public.recipe_steps
  to anon, authenticated;
grant insert, update, delete on public.recipes, public.recipe_ingredients,
  public.recipe_steps to authenticated;
grant select on public.profiles to authenticated;
grant insert on public.profiles to authenticated;
grant update (name, updated_at) on public.profiles to authenticated;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role::text = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), 'Chef nuevo')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, name)
select
  id,
  coalesce(nullif(trim(raw_user_meta_data ->> 'name'), ''), split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

insert into public.categories (id, name) values
  ('breakfast', 'Desayunos'),
  ('lunch', 'Almuerzos'),
  ('dinner', 'Cenas'),
  ('dessert', 'Postres'),
  ('drinks', 'Bebidas'),
  ('quick', 'Rapidas')
on conflict (id) do update set name = excluded.name;

insert into public.ingredients (id, name) values
  ('egg', 'Huevo'),
  ('tomato', 'Tomate'),
  ('cheese', 'Queso'),
  ('tortilla', 'Tortilla'),
  ('avocado', 'Aguacate'),
  ('rice', 'Arroz'),
  ('chicken', 'Pollo'),
  ('pasta', 'Pasta'),
  ('banana', 'Banano'),
  ('oats', 'Avena'),
  ('onion', 'Cebolla'),
  ('beans', 'Frijoles'),
  ('milk', 'Leche'),
  ('yogurt', 'Yogurt'),
  ('strawberry', 'Fresa'),
  ('lemon', 'Limon'),
  ('lettuce', 'Lechuga'),
  ('tuna', 'Atun'),
  ('bread', 'Pan')
on conflict (id) do update set name = excluded.name;

drop policy if exists categories_are_public on public.categories;
create policy categories_are_public on public.categories
for select using (true);

drop policy if exists ingredients_are_public on public.ingredients;
create policy ingredients_are_public on public.ingredients
for select using (true);

drop policy if exists profiles_read_own_or_admin on public.profiles;
create policy profiles_read_own_or_admin on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_insert_own_user_role on public.profiles;
create policy profiles_insert_own_user_role on public.profiles
for insert to authenticated
with check (id = auth.uid() and role::text = 'user');

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists recipes_read_visible on public.recipes;
create policy recipes_read_visible on public.recipes
for select
using (
  status::text = 'approved'
  or user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists recipes_insert_own_pending on public.recipes;
create policy recipes_insert_own_pending on public.recipes
for insert to authenticated
with check (user_id = auth.uid() and status::text = 'pending');

drop policy if exists recipes_update_own_pending on public.recipes;
create policy recipes_update_own_pending on public.recipes
for update to authenticated
using (user_id = auth.uid() and status::text = 'pending')
with check (user_id = auth.uid() and status::text = 'pending');

drop policy if exists recipes_admin_update on public.recipes;
create policy recipes_admin_update on public.recipes
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists recipes_delete_own_pending_or_admin on public.recipes;
create policy recipes_delete_own_pending_or_admin on public.recipes
for delete to authenticated
using (
  (user_id = auth.uid() and status::text = 'pending')
  or public.is_admin()
);

drop policy if exists recipe_ingredients_read_visible on public.recipe_ingredients;
create policy recipe_ingredients_read_visible on public.recipe_ingredients
for select using (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
  )
);

drop policy if exists recipe_ingredients_write_owned on public.recipe_ingredients;
create policy recipe_ingredients_write_owned on public.recipe_ingredients
for all to authenticated
using (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and (recipes.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and (recipes.user_id = auth.uid() or public.is_admin())
  )
);

drop policy if exists recipe_steps_read_visible on public.recipe_steps;
create policy recipe_steps_read_visible on public.recipe_steps
for select using (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_steps.recipe_id
  )
);

drop policy if exists recipe_steps_write_owned on public.recipe_steps;
create policy recipe_steps_write_owned on public.recipe_steps
for all to authenticated
using (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_steps.recipe_id
      and (recipes.user_id = auth.uid() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_steps.recipe_id
      and (recipes.user_id = auth.uid() or public.is_admin())
  )
);

alter table public.recipes
  add column if not exists rating_count integer not null default 0;

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  primary key (user_id, recipe_id)
);

create table if not exists public.recipe_ratings (
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  primary key (user_id, recipe_id)
);

create table if not exists public.recipe_comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  author_name text not null,
  text text not null check (char_length(trim(text)) between 1 and 280),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create index if not exists favorites_recipe_id_idx
  on public.favorites(recipe_id);
create index if not exists recipe_ratings_recipe_id_idx
  on public.recipe_ratings(recipe_id);
create index if not exists recipe_comments_recipe_id_created_at_idx
  on public.recipe_comments(recipe_id, created_at desc);

alter table public.favorites enable row level security;
alter table public.recipe_ratings enable row level security;
alter table public.recipe_comments enable row level security;

grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update, delete on public.recipe_ratings to authenticated;
grant select on public.recipe_comments to anon, authenticated;
grant insert, update, delete on public.recipe_comments to authenticated;

drop policy if exists favorites_manage_own on public.favorites;
create policy favorites_manage_own on public.favorites
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists ratings_manage_own on public.recipe_ratings;
create policy ratings_manage_own on public.recipe_ratings
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists comments_read_approved_recipes on public.recipe_comments;
create policy comments_read_approved_recipes on public.recipe_comments
for select using (
  exists (
    select 1 from public.recipes
    where recipes.id = recipe_comments.recipe_id
      and recipes.status::text = 'approved'
  )
  or user_id = auth.uid()
  or public.is_admin()
);

drop policy if exists comments_insert_own on public.recipe_comments;
create policy comments_insert_own on public.recipe_comments
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists comments_update_own on public.recipe_comments;
create policy comments_update_own on public.recipe_comments
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists comments_delete_own_or_admin on public.recipe_comments;
create policy comments_delete_own_or_admin on public.recipe_comments
for delete to authenticated
using (user_id = auth.uid() or public.is_admin());

create or replace function public.refresh_recipe_rating()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_recipe_id uuid;
begin
  target_recipe_id := coalesce(new.recipe_id, old.recipe_id);

  update public.recipes
  set
    rating = coalesce((
      select round(avg(recipe_ratings.rating)::numeric, 1)
      from public.recipe_ratings
      where recipe_ratings.recipe_id = target_recipe_id
    ), 0),
    rating_count = (
      select count(*)
      from public.recipe_ratings
      where recipe_ratings.recipe_id = target_recipe_id
    )
  where id = target_recipe_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists recipe_ratings_refresh_average on public.recipe_ratings;
create trigger recipe_ratings_refresh_average
after insert or update or delete on public.recipe_ratings
for each row execute function public.refresh_recipe_rating();

drop trigger if exists recipe_ratings_set_updated_at on public.recipe_ratings;
create trigger recipe_ratings_set_updated_at
before update on public.recipe_ratings
for each row execute function public.set_updated_at();

drop trigger if exists recipe_comments_set_updated_at on public.recipe_comments;
create trigger recipe_comments_set_updated_at
before update on public.recipe_comments
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do update set public = true;

drop policy if exists recipe_images_public_read on storage.objects;
create policy recipe_images_public_read on storage.objects
for select using (bucket_id = 'recipe-images');

drop policy if exists recipe_images_upload_own_folder on storage.objects;
create policy recipe_images_upload_own_folder on storage.objects
for insert to authenticated
with check (
  bucket_id = 'recipe-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists recipe_images_update_own_folder on storage.objects;
create policy recipe_images_update_own_folder on storage.objects
for update to authenticated
using (
  bucket_id = 'recipe-images'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'recipe-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists recipe_images_delete_own_folder on storage.objects;
create policy recipe_images_delete_own_folder on storage.objects
for delete to authenticated
using (
  bucket_id = 'recipe-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

commit;

-- After registering the administrator account, promote it once from the SQL editor:
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'admin@example.com'
-- );
