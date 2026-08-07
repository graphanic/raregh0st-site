# Supabase Auth setup

The app uses Supabase email/password sessions for both admin routes:

- `/admin/store`
- `/admin/upload`

A browser session alone is not authorization. Before either route renders, `GET /api/auth` sends the access token to Supabase Auth for validation and checks the authenticated user UUID against `SUPABASE_ADMIN_USER_IDS`. Every `/api/admin/*` handler repeats that server-side check.

## Project and account setup

1. Restore or select the Supabase project used by the store.
2. In Supabase Auth, create the owner account with a verified email. Do not put the password in this repository or in a deployment environment variable.
3. Copy that user's UUID from **Authentication → Users**.
4. Set the variables shown in `.env.example` locally and in the deployment.
5. In **Authentication → URL Configuration**, set the production Site URL and add local/deployment redirect URLs.
6. Redeploy so Vite receives the `VITE_*` values at build time.

Use a publishable key in the browser. Use a secret key only on the server. The code still accepts the legacy `SUPABASE_SERVICE_ROLE_KEY` server variable during migration, but new deployments should prefer `SUPABASE_SECRET_KEY`.

After the first Supabase login works, remove the obsolete `STORE_ADMIN_PASSWORD_V2` deployment variable. The previous client-side portfolio password and custom daily admin tokens are no longer used.
