# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # ESLint
npm run db:push   # Apply Drizzle schema changes to the database
```

## Environment Variables

```
DATABASE_URL=postgresql://...   # Neon serverless PostgreSQL
TELEGRAM_BOT_TOKEN=...          # Telegram bot for sending approved offers
TELEGRAM_CHAT_ID=...            # Comma-separated list of chat IDs
JWT_SECRET=...                  # HS256 JWT signing key
```

## Architecture

**Dom da Oferta Admin** is a Next.js 16 (App Router) admin dashboard for moderating product offers. Admins approve/reject offers; approved offers are sent to a Telegram channel.

### Auth

JWT tokens (jose, HS256, 7-day expiry) stored as httpOnly cookies. `middleware.ts` protects `/admin/*` routes. Server actions use `getSession()` to verify auth. Passwords hashed with bcrypt (12 rounds).

### Database

PostgreSQL (Neon) via Drizzle ORM. Schema in `src/db/schema.ts`:
- **users** — admin accounts
- **offers** — product listings with status enum `pending | approved | rejected`, prices, URLs, store, images, who approved/rejected
- **price_history** — per-offer price change log
- **offer_impressions** / **click_events** — sessionId-based analytics

Run `npm run db:push` to apply schema changes (no migration files, direct push).

### Server Actions

All mutations are Next.js Server Actions (`'use server'`) with `revalidatePath()` for cache busting:
- `src/actions/auth-actions.ts` — login, logout, register, changePassword, deleteUser, getSession
- `src/actions/offer-actions.ts` — createOffer, approveOffer, rejectOffer, updateOffer, getOffers, getCounts

### Page Structure

```
/login                  public
/admin                  pending offers queue
/admin/aprovadas        approved offers
/admin/rejeitadas       rejected offers
/admin/todos            all offers
/admin/membros          user management
```

All `/admin/*` pages share `src/app/admin/layout.tsx` which renders `SidebarNav` + `Topbar`.

### Component Patterns

Offer pages follow a two-component shell pattern:
- `OfferPageShell` — sets page title, status filter, and renders `OfferListPage`
- `OfferListPage` — client component with filtering, search, and list rendering
- `OfferListItem` → `OfferDrawer` (desktop) / `MobileDrawer` (mobile) for detail view

Key components: `AddOfferDialog`, `OfferDetailDialog`, `ChangePasswordModal`, `SidebarNav`, `ThemeProvider` (light/dark via `data-theme` attribute + localStorage).

### Telegram Integration

`lib/telegram.ts` — `sendTelegramMessage()` posts formatted offer cards to `TELEGRAM_CHAT_ID` (supports multiple IDs comma-separated) when an offer is approved.

### Styling

TailwindCSS 4 + custom CSS variables in oklch color space (`src/app/globals.css`). Dark theme via `[data-theme="dark"]` selector. Component styles use `--bg`, `--bg-elev`, `--border`, `--text`, `--accent` variables. shadcn/ui with Base Nova style (`components.json`).

Path alias `@/*` maps to `src/*`.
