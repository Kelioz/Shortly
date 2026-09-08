# URL Shortener Frontend

React + Vite frontend for the URL shortener MVP.

## Local development

```bash
npm install
npm run orval
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api` to the
backend at `http://localhost:3000`. To use another API URL, copy `.env.example`
to `.env` and set `VITE_API_URL`.

## Architecture

- `src/app` — providers and global styles
- `src/pages` — application pages
- `src/features` — user scenarios: shortening and statistics
- `src/shared/api` — Axios transport and Orval-generated React Query hooks
- `src/shared/lib` — reusable utilities

Regenerate the typed API client after changing `openapi.json`:

```bash
npm run orval
```
