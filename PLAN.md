# Money Tracker Frontend — V1 Plan

## Context

Build a mobile-first PWA frontend for an existing money tracker backend (Go REST API). The backend uses cookie-based JWT auth, supports multi-currency accounts, transactions (income/expense), transfers between accounts, and categories. SEO is not a concern — pure CSR is the right choice. The app needs to feel native on mobile.

**Decisions:**
- UI: shadcn/ui + Tailwind CSS
- Multi-currency: full support (cross-currency transfers, exchange rates)
- V1 scope: Core only — Login, Accounts, Transactions, Transfers, Activity, Categories

---

## Tech Stack

| Concern | Choice |
|---|---|
| Bundler/Framework | Vite + React + TypeScript |
| Routing | React Router v7 (file-based, CSR mode) |
| Server state | TanStack Query v5 |
| Client state | Zustand (minimal — just month selector, auth state) |
| UI | Tailwind CSS + shadcn/ui |
| HTTP | Axios (with interceptor for 401 redirect) |
| PWA | vite-plugin-pwa (Workbox) |
| Icons | lucide-react |

---

## Project Structure

```
src/
  routes/
    _auth/              # unauthenticated layout
      login.tsx
    _app/               # authenticated layout (bottom nav)
      index.tsx         # Home / Dashboard (simple summary card + recent activity)
      activity.tsx      # Monthly activity feed
      accounts/
        index.tsx       # Account list
        new.tsx         # Create account
        $id.edit.tsx    # Edit account
      categories/
        index.tsx       # Category list
        new.tsx         # Create category
      more.tsx          # Logout, change password (deferred)
  components/
    ui/                 # shadcn/ui generated
    layout/
      BottomNav.tsx
      AppHeader.tsx
      PageLayout.tsx
    forms/
      TransactionForm.tsx   # income/expense
      TransferForm.tsx      # between accounts
      AccountForm.tsx
      CategoryForm.tsx
    activity/
      ActivityList.tsx
      ActivityItem.tsx      # renders transaction OR transfer row
      MonthSelector.tsx
    accounts/
      AccountCard.tsx
  lib/
    api/
      client.ts         # Axios instance, base URL, credentials: include
      auth.ts
      accounts.ts
      transactions.ts
      transfers.ts
      categories.ts
      activity.ts
      summary.ts
    queries/            # TanStack Query hooks (useAccounts, useActivity, etc.)
    types.ts            # TypeScript types mirroring swagger schemas
  store/
    useAppStore.ts      # Zustand: selected year/month, auth user
  pwa/
    manifest.json
```

---

## Screens & Behavior

### Login
- Email + password form → `POST /v1/auth/login`
- On success: navigate to `/` (cookie is set automatically by browser)
- On 401: show inline error
- No token storage needed — cookie is HttpOnly

### Auth Guard
- Axios interceptor: on 401 response → redirect to `/login`
- App layout route tries `GET /v1/accounts` on mount; if it fails with 401, redirect

### Home (Dashboard)
- Show `GET /v1/summary` data: total balance (spendable), monthly income, monthly expenses, net
- Show last 5 items from `GET /v1/activity` for current month
- FAB (floating action button): opens bottom sheet to choose Income / Expense / Transfer

### Activity Feed
- Month selector (prev/next arrows + "Month Year" label) — persisted in Zustand
- `GET /v1/activity?year=&month=` — re-fetches on month change
- List: date-grouped items; each row shows icon, description, amount with currency, account name
- Transfers show: "AccountA → AccountB" with from/to amounts + currencies
- Tap row → bottom sheet with Edit / Delete actions
- Swipe-left on row → reveal Delete button (optional, do if time allows)

### Accounts
- List from `GET /v1/accounts` — shows balance (computed), currency, account type badge
- Deleted accounts collapsible section at bottom (filter `deletedAt != null`) with Restore button
- FAB → Create account form
- Tap account → Edit form
- Long-press / swipe → Delete (soft)
- **Account Form fields:**
  - Name (text)
  - Type (segmented: cash | bank | e_wallet | credit_card | investment | metal | crypto)
  - Currency (searchable select — ISO 4217 list)
  - Initial Balance (number)
  - Treat as Expense toggle (with explanation tooltip: "Transfers in won't count as income")

### Add Transaction (Bottom Sheet / Drawer)
- Toggle: Income | Expense
- Account selector (searchable, shows currency)
- Category selector (filtered by income/expense type)
- Amount (number, respects account currency)
- Date (date picker, defaults to today)
- Description (optional text)
- `POST /v1/transactions`

### Add Transfer (Bottom Sheet / Drawer)
- From Account selector
- To Account selector
- From Amount
- To Amount
- Exchange Rate: auto-computed as `toAmount / fromAmount`, editable
- If same currency: to amount mirrors from amount
- Date + Description
- `POST /v1/transfers`

### Categories
- Tabbed: Income | Expense
- System categories shown first (greyed, no delete)
- User categories: tap to edit (name + icon), swipe/long-press to delete
- FAB → Create: name, type (income/expense), icon (emoji text input)
- `GET /v1/categories`, `POST /v1/categories`

### More
- Logout button → `POST /v1/auth/logout` → clear Zustand state → navigate to `/login`
- Change Password (deferred — stub screen)

---

## Multi-Currency

- Every account has a currency field — always display currency code next to amounts (e.g. "IDR 50,000")
- Transfer form: if from/to currencies differ, show exchange rate field and auto-compute
- Activity feed: transfers show both sides with their currencies
- Dashboard total balance uses API-computed value from `/v1/summary` (API handles currency aggregation)

---

## PWA Setup

- `vite-plugin-pwa` with `generateSW` strategy
- Manifest: `display: standalone`, `start_url: /`, short_name: "Money"
- Workbox: cache-first for static assets, network-first for all `/v1/*` API routes
- Add to home screen prompt — let browser handle natively

---

## Bootstrapping Steps

1. `npm create vite@latest money-tracker-fe -- --template react-ts`
2. Install: `react-router`, `@tanstack/react-query`, `zustand`, `axios`, `tailwindcss`, `shadcn`, `lucide-react`, `vite-plugin-pwa`
3. Configure Tailwind, shadcn init
4. Set up React Router v7 with file-based routing (`createBrowserRouter` / `RouterProvider`)
5. Configure Axios base URL (env var `VITE_API_BASE_URL`)
6. Set up TanStack Query `QueryClientProvider`
7. Scaffold routes structure
8. Implement auth flow first (login → guard → logout)
9. Implement Accounts (list → create → edit → delete/restore)
10. Implement Categories
11. Implement Activity feed + month selector
12. Implement Transaction + Transfer forms (bottom sheet)
13. Implement Home dashboard summary
14. Configure PWA manifest and service worker

---

## Verification

- Run `npm run dev`, open on mobile browser or Chrome DevTools mobile emulation
- Test login → redirect to home → logout → redirect to login
- Test account CRUD including soft-delete and restore
- Test creating income, expense, and cross-currency transfer — verify activity feed shows them correctly
- Test month navigation in activity feed
- In Chrome DevTools → Application → Manifest: verify PWA manifest loads
- Install to home screen on Android/iOS and verify standalone mode
