# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server at http://localhost:3000
npm run build        # Production build to dist/
npm run preview      # Preview the production build
npm run lint         # TypeScript type checking only (tsc --noEmit)
npm run clean        # Remove dist/ via the package script
```

There is no test runner configured. `npm run lint` is TypeScript-only and is the main verification command.

## Environment

Copy `.env.example` to `.env.local`.

Active app behavior depends mainly on:
- `VITE_AUTH_PROVIDER` - auth/data backend selector. Use `local` for demo mode and `go-api` for the Go REST backend.
- `VITE_API_BASE_URL` - base URL for the Go REST API when `VITE_AUTH_PROVIDER=go-api`.

Also present in the repo:
- `GEMINI_API_KEY` - exposed in `vite.config.ts`, but the current storefront flow does not actively use Gemini features.
- `APP_URL` - kept in `.env.example`, but not part of the current client-side shopping flow.

## Architecture

React 19 storefront built with Vite 6, Tailwind CSS 4, `motion`, and React Router 7.

### Application structure

- `src/main.tsx` mounts the app inside `BrowserRouter` and wraps it with `AuthProvider`.
- `src/App.tsx` is still the main shell for shop state: product list, category/search/sort filters, cart, wishlist, recent searches, recently viewed items, quick view, and gift-selection modal state.
- Routing is URL-based now, not `currentView`-based. Main routes are `/`, `/collection`, `/product/:id`, `/checkout`, and `/profile`.
- Authentication is handled through `src/contexts/AuthContext.tsx`, which wraps the module-level `authStore` from `src/services/authService.ts`.
- Checkout logic is no longer embedded entirely in `App.tsx`; it is split into `src/components/CheckoutPage.tsx` plus the `src/features/checkout/` module.

### State ownership

- Shop browsing/cart/wishlist UI state lives in `src/App.tsx`.
- Auth session state lives in `src/contexts/AuthContext.tsx` and `src/services/authService.ts`.
- Checkout flow state lives in `src/features/checkout/useCheckoutFlow.ts`.
- Orders, addresses, and profile persistence are handled through `src/services/dataService.ts`.

There is still no Redux or Zustand store. State is split across React state, context for auth, and service-backed persistence.

## Data and persistence

- `src/data.ts` contains the static product catalog, categories, and demo users.
- `src/services/authService.ts` switches between:
  - `local`: demo auth backed by `localStorage` plus seeded users from `src/data.ts`
  - `go-api`: REST calls to `/api/auth/*`
- `src/services/dataService.ts` switches between:
  - local mock persistence for orders, addresses, and profile
  - Go API endpoints for the same resources
- `src/services/mockDataService.ts` contains the localStorage-backed mock implementations for profile, address, and order data.

## Key files

- `src/App.tsx` - top-level route shell and shop/cart UI state
- `src/main.tsx` - app bootstrap, router, auth provider
- `src/contexts/AuthContext.tsx` - auth context and hooks
- `src/services/authService.ts` - provider-based auth adapter and shared auth store
- `src/services/dataService.ts` - provider-based orders/addresses/profile adapter
- `src/services/mockDataService.ts` - local demo persistence
- `src/features/checkout/useCheckoutFlow.ts` - checkout state machine and order placement
- `src/features/shop/cartUtils.ts` - cart math and cart mutation helpers
- `src/types.ts` - shared storefront types
- `src/data.ts` - seeded catalog and mock users
- `src/promotions.ts` - hero and collection promo content

## Styling

- Tailwind CSS v4 is configured through `src/index.css`.
- The active font is `Prompt` for both sans and display usage.
- Theme colors currently center on:
  - `primary`: `#00A8E2`
  - `primary-dark`: `#0C86B8`
  - `secondary`: `#A2DCF2`
- Global page background is a light blue-tinted `#f5fbfe`.

## Path alias

`@/` resolves to the project root, configured in both `vite.config.ts` and `tsconfig.json`.

## Notes for edits

- Prefer route-aware changes over reintroducing `currentView`-style navigation.
- If you touch auth flows, check both `AuthContext` and `authService`.
- If you touch checkout, inspect both `CheckoutPage.tsx` and `src/features/checkout/`.
- Some Thai UI copy in the repo is currently mojibake/encoding-damaged. Be careful not to preserve broken text when editing related files.
