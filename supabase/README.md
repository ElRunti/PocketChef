# Supabase setup

1. Open the Supabase SQL Editor for this project.
2. Run `migrations/20260826_complete_pocket_chef.sql` once.
3. Register the account that will administer Pocket Chef.
4. Run the commented `update public.profiles ...` statement at the end of the
   migration with that account's email.
5. Keep `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` only in the local
   `.env` file. Never commit that file.

The migration preserves the existing tables, adds missing social tables,
enables RLS, creates the profile trigger, seeds categories and ingredients,
and configures the `recipe-images` storage bucket.
