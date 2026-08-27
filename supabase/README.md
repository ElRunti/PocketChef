# Supabase setup

1. Open the Supabase SQL Editor for this project.
2. Run `migrations/20260826_complete_pocket_chef.sql`. Rerun it if you
   previously used an older version of the migration.
3. Create the administrator in Supabase Authentication > Users, or register it
   in Pocket Chef, using its real email and a strong temporary password.
4. Run the commented `select public.promote_user_to_admin(...)` statement at
   the end of the migration with that account's email.
5. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only in the local
   `.env` file. Never commit that file.

The migration preserves the existing tables, adds the social and user-interest
tables, enables RLS, creates the profile trigger, seeds categories and
ingredients, and configures the `recipe-images` storage bucket. The app reads
all recipe, category, ingredient, profile and community data from Supabase.

Do not commit an administrator password or insert rows directly into
`auth.users`. Supabase Auth owns that schema; the private promotion function is
only callable from the SQL Editor by the database owner.
