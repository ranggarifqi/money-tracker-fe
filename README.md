# Money Tracker — Web

Mobile-first PWA for tracking accounts, transactions, and transfers. Pairs with the [money-tracker backend](../mcp-money-tracker).

## Quick start

```bash
npm install
cp .env.example .env.local   # set VITE_API_TARGET to your backend URL
npm run dev                  # http://localhost:5173
```

The dev server proxies `/v1/*` to the backend, so the auth cookie works same-origin out of the box.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check + production build → `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |

## Features

- **Login / logout** — cookie-based session, no token management
- **Home** — spendable balance, monthly cash flow, recent activity
- **Accounts** — create, edit, soft-delete & restore, multi-currency, locked (savings) accounts
- **Activity** — month-by-month feed of transactions and transfers, edit and delete
- **Add records** — expense, income, and cross-currency transfers with auto exchange rate
- **Categories** — browse system categories and create custom ones
- **PWA** — installable to home screen, offline-capable via service worker

## Tech stack

- Vite + React 19 + TypeScript (CSR, no SSR)
- React Router v7 · TanStack Query v5 · Zustand
- Tailwind CSS v4 + shadcn-style components (Radix primitives + vaul drawers)
- vite-plugin-pwa (Workbox)
