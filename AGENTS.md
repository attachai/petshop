# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (outputs to dist/)
npm run preview      # Preview production build
npm run lint         # TypeScript type checking (tsc --noEmit)
npm run clean        # Remove dist/
```

There is no test runner configured. Lint is TypeScript-only (`tsc --noEmit`).

## Environment

Copy `.env.example` to `.env.local` and set:
- `GEMINI_API_KEY` - required for Gemini AI features
- `APP_URL` - base URL for the app
- `VITE_AUTH_PROVIDER` - auth/data backend selector (`local` for demo data, `go-api` for Go REST API)
- `VITE_API_BASE_URL` - base URL for the Go REST API when `VITE_AUTH_PROVIDER=go-api`

## Architecture

Single-page React 19 app using Vite 6, Tailwind CSS 4, and pluggable auth/data services.

**State management lives in `App.tsx`** - it is the central hub holding all application state (cart, wishlist, user session, current view, filters, modals). Child components receive state and callbacks as props; there is no global store (no Redux, no Context API). `App.tsx` is large and handles routing via a `currentView` state variable rather than React Router URLs in some cases.

**Key files:**
- [src/App.tsx](src/App.tsx) - routing, state, cart logic, product filtering/sorting
- [src/services/authService.ts](src/services/authService.ts) - auth provider adapter (`local` or `go-api`) and shared auth store
- [src/services/dataService.ts](src/services/dataService.ts) - order/address/profile provider adapter (`local` or `go-api`)
- [src/types.ts](src/types.ts) - shared TypeScript interfaces (Product, CartItem, Review, FreeGift, etc.)
- [src/data.ts](src/data.ts) - static product catalog (mock data)

**Routing:** The app uses a `currentView` string state in `App.tsx` to switch between pages (home, product detail, checkout, profile, etc.), not URL-based routing in most cases.

**Styling:** Tailwind CSS v4 with custom theme defined in [src/index.css](src/index.css). Custom colors: `primary` (#0097a7), `primary-dark` (#00796b), `accent` (#ff9800). Custom fonts: Inter (sans), Outfit (display).

**Path alias:** `@/` resolves to the project root (configured in both `vite.config.ts` and `tsconfig.json`).

**Animations:** Uses the `motion` library (framer-motion API-compatible alternative).
