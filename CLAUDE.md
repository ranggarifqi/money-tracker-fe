# CLAUDE.md — Money Tracker Frontend

## Commands

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # tsc -b && vite build → dist/
npm run lint      # ESLint
npm run preview   # Preview the production build
```

TypeScript is strict (noUnusedLocals, noUnusedParameters). Always run `npx tsc -b` and `npx eslint .` before reporting a task done. The build must stay green.

## Dev environment

The dev server proxies `/v1/*` to `VITE_API_TARGET` (default `http://localhost:8080`).
Copy `.env.example` → `.env.local` and point it at the running backend.
Auth is cookie-based (HttpOnly `auth_token`) — no token storage needed.

Backend swagger: `/home/rangga/projects/mcp-money-tracker/docs/swagger.json`
Backend base path: `/v1`

## Project structure

```
src/
  pages/              # One file per route screen
  components/
    layout/           # AppLayout, AuthLayout, BottomNav, PageLayout
    ui/               # Primitive UI components (shadcn-style, Radix + vaul)
    accounts/         # AccountCard, AccountFormSheet
    activity/         # ActivityDetailSheet, ActivityItem, ActivityList, MonthSelector
    categories/       # CategoryFormSheet
    forms/            # AddRecordSheet, TransactionForm, TransferForm
  lib/
    api/              # Axios client + one module per resource (accounts, transactions, …)
    queries/          # TanStack Query hooks + keys
    types.ts          # All API types — single source of truth
    format.ts         # formatMoney, formatDate, todayISO, monthDateRange
    currencies.ts     # ISO currency list, ACCOUNT_TYPES constant
    auth-storage.ts   # localStorage user cache (name/email only)
    utils.ts          # cn() (clsx + tailwind-merge)
  store/
    useAppStore.ts    # Zustand: auth user, selected year/month
  router.tsx          # Route definitions
  main.tsx            # Entry point (QueryClient, RouterProvider, Toaster)
  index.css           # Tailwind v4 theme tokens + base styles
```

## Key conventions

### API casing
- **Everything is snake_case**: both responses (`user_id`, `initial_balance`, `should_treat_as_expense`, `deleted_at`) and request bodies (`initial_balance`, `treat_as_expense`, `account_id`, `from_amount`)
- `src/lib/types.ts` is the single source of truth — follow existing patterns when adding new types

### Auth
- No `/me` endpoint on the backend. Login returns the user once; we cache name/email in `localStorage` (via `auth-storage.ts`) for display. The HttpOnly cookie is the real auth.
- `setUnauthorizedHandler` in `AppLayout` wires global 401 → redirect to `/login`

### State
- **Server state**: TanStack Query. Query keys are in `src/lib/queries/keys.ts`. Mutations invalidate `['activity']`, `['summary']`, and `['accounts']` after any write.
- **Client state**: Zustand (`useAppStore`). Only stores: current user display info + selected year/month.

### UI patterns
- Forms live in drawer sheets (vaul `Drawer`). Mount the form body conditionally (`{open && <FormBody />}`) so state resets on each open — do NOT use `useEffect` to sync props to state (React 19 lint rule).
- Toast feedback via `toast.success()` / `toast.error()` from `src/components/ui/toast.tsx`
- `PageLayout` wraps every page: handles safe area, sticky header, bottom-nav padding
- `ConfirmSheet` for destructive action confirmation

### API modules
Each resource has two layers:
1. `src/lib/api/<resource>.ts` — raw async functions using the Axios client
2. `src/lib/queries/<resource>.ts` — TanStack Query hooks wrapping those functions

### Summary numbers
`/v1/summary` returns aggregated multi-currency figures **without a currency code**. Format them with `toLocaleString()`, not `formatMoney()`.

### Categories
The backend only exposes GET and POST for categories — no update or delete. Don't add an edit/delete UI without a backend endpoint.

### Accounts
Soft-deleted accounts have `deletedAt != null`. `/v1/accounts` returns all accounts including deleted ones. The Accounts page splits them into active/deleted sections.

## Adding a new route

1. Create `src/pages/NewPage.tsx` — use `<PageLayout title="...">` as the wrapper
2. Add the route to `src/router.tsx` under the `<AppLayout>` children
3. Add a nav entry to `src/components/layout/BottomNav.tsx` if it's top-level

## Adding a new API resource

1. Add types to `src/lib/types.ts`
2. Add `src/lib/api/<resource>.ts` — async functions using `api` from `client.ts`
3. Add `src/lib/queries/<resource>.ts` — TanStack Query hooks
4. Add query key to `src/lib/queries/keys.ts`

## Tech stack versions

| Package | Version |
|---|---|
| React | 19 |
| Vite | 8 |
| TypeScript | 6 |
| Tailwind CSS | 4 (uses `@tailwindcss/vite`, no tailwind.config.js) |
| TanStack Query | 5 |
| React Router | 7 |
| Zustand | 5 |
| vaul (drawer) | 1 |
