# GitHub Pages deployment

1. Back up the existing repository first: GitHub → repository → Code → Download ZIP.
2. Keep the ZIP outside the repository as a rollback copy.
3. Copy `frontend/config.example.js` to `frontend/config.js` and configure it.
4. Test the frontend locally using a static server.
5. In GitHub, upload the **contents of `frontend/`** to the publishing branch/folder configured in Settings → Pages.
6. Ensure `index.html` is at the root of the published folder.
7. Configure the exact GitHub Pages origin in backend `ALLOWED_ORIGINS`.
8. Deploy `backend/` separately to a Node.js host and set its environment variables there.
9. Put the deployed backend URL into `frontend/config.js`.
10. In Supabase Auth URL Configuration, add your GitHub Pages URL to Site URL/Redirect URLs.
11. Run `supabase/schema.sql` only after reviewing the existing schema; do not overwrite unrelated tables.
12. Test login, create/save a project, news search, backend health, and mobile layout.

Do not upload `.env`, API keys, service-role keys, private credentials, or signing files.
