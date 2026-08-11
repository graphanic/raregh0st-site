# Supabase Auth setup

The app uses Supabase passwordless magic-link sessions for both admin routes:

- `/admin/store`
- `/admin/upload`

A browser session alone is not authorization. Before either route renders, `GET /api/auth` sends the access token to Supabase Auth for validation and checks the verified identity against the private `store_admins` allowlist. Every `/api/admin/*` handler repeats that server-side check.

## Project and account setup

1. Restore or select the Supabase project used by the store.
2. Add the normalized owner email to the RLS-locked `public.store_admins` table. Only the service role has table privileges; the owner identity is never published in source or browser code.
3. Set the server variables shown in `.env.example` locally and in the deployment.
4. In **Authentication → URL Configuration**, set the production Site URL and add local/deployment redirect URLs.
5. Open `/admin/login` and request a magic link. Supabase creates the Auth user on the first request.

The project URL and publishable key in `config/supabase.js` are public browser configuration. The secret key stays server-only. The code still accepts the legacy `SUPABASE_SERVICE_ROLE_KEY` server variable during migration, but new deployments should prefer `SUPABASE_SECRET_KEY`.

After the first successful login, the API links the private allowlist row to the Supabase Auth user UUID. `SUPABASE_ADMIN_EMAILS` and `SUPABASE_ADMIN_USER_IDS` remain optional server-only overrides. Remove the obsolete `STORE_ADMIN_PASSWORD_V2` deployment variable; passwords and custom daily admin tokens are no longer used.

## Private commission reference photos

Commission requests can include prepared WebP reference photos. These belong in the private `commission-references` Storage bucket; the browser receives time-limited upload grants, and only an authenticated admin can request short-lived preview URLs.

Provision or reconcile the bucket after setting the server variables:

```bash
npm run setup:commission-storage
```

The setup command keeps the bucket private, restricts it to WebP images, and enforces the same 8 MB limit as the public upload-grant API. Deleting a commission submission from the admin inbox removes its stored reference photos before deleting the row.
