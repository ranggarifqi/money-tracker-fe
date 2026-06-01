# Money Tracker — Web (PWA)

Mobile-first Progressive Web App frontend for the
[money-tracker backend](../mcp-money-tracker). Track accounts, record income /
expenses / transfers, and review monthly activity — installable to your phone's
home screen.

## Tech stack

- **Vite + React 19 + TypeScript** (client-side rendered)
- **React Router v7** for routing
- **TanStack Query v5** for server state / caching
- **Zustand** for light client state (auth user, selected month)
- **Tailwind CSS v4 + shadcn-style UI** components (Radix + vaul drawers)
- **vite-plugin-pwa** (Workbox) for offline support & installability

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Point the dev server at your running backend
cp .env.example .env.local
#   edit VITE_API_TARGET if your backend isn't on http://localhost:8080

# 3. Run the dev server
npm run dev
```

Open http://localhost:5173. The dev server proxies `/v1/*` to the backend
(`VITE_API_TARGET`), so the auth cookie works same-origin with no CORS setup.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## How it talks to the backend

- Auth is **cookie-based** (HttpOnly `auth_token`). The Axios client sends
  `withCredentials: true`; there is no token to store client-side.
- A `401` on any request (except login) clears the cached profile and redirects
  to `/login` — see [src/lib/api/client.ts](src/lib/api/client.ts).
- **Responses are camelCase; request bodies are snake_case** — the type
  definitions in [src/lib/types.ts](src/lib/types.ts) reflect this exactly.

## Project structure

```
src/
  pages/            # Route screens (Login, Home, Activity, Accounts, ...)
  components/
    layout/         # App shell, bottom nav, page layout
    ui/             # shadcn-style primitives (button, drawer, select, ...)
    accounts/ activity/ categories/ forms/   # feature components
  lib/
    api/            # Axios client + one module per resource
    queries/        # TanStack Query hooks + query keys
    types.ts        # API types (mirrors the backend swagger)
    format.ts       # Money / date formatting helpers
  store/            # Zustand store
  router.tsx        # Route definitions
```

## Features (V1)

- Login / logout (cookie session)
- Home dashboard: spendable balance, monthly cash flow, recent activity
- Accounts: list with balances, create / edit, soft-delete & restore,
  multi-currency, "treat as expense" (locked) accounts
- Activity feed: month navigation, grouped by day, edit / delete
- Add records: expense, income, and cross-currency transfers
- Categories: browse (system + custom) and create

Deferred (backend supports, not yet built): CSV import, category edit/delete
(no API), change password, dashboard charts.

## PWA

`npm run build` generates a service worker and web manifest. Static assets are
precached; `/v1/*` API calls use a network-first strategy. Install via the
browser's "Add to Home Screen".
