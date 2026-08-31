# Dimension Hospitality

A hotel & hospitality management interface built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui.

Dimension Hospitality covers the full day-to-day operations of running a property — reservations, front desk, housekeeping, billing, staff, and analytics — in a single, cohesive admin interface. It ships as a **frontend-only** application: every screen runs against a realistic, deterministic mock dataset, so you can preview and build against the full UI immediately, without standing up a backend first.

## Modules

| Module | Route |
| --- | --- |
| Dashboard | `/dashboard` |
| Reservations | `/dashboard/reservations`, `/dashboard/reservations/[id]` |
| Guests | `/dashboard/guests`, `/dashboard/guests/[id]` |
| Rooms | `/dashboard/rooms` |
| Room Types | `/dashboard/room-types` |
| Housekeeping | `/dashboard/housekeeping` |
| Front Desk | `/dashboard/front-desk` |
| Check-in | `/dashboard/check-in` |
| Check-out | `/dashboard/check-out` |
| Maintenance | `/dashboard/maintenance` |
| Services | `/dashboard/services` |
| Billing | `/dashboard/billing` |
| Staff | `/dashboard/staff` |
| Calendar | `/dashboard/calendar` |
| Reports | `/dashboard/reports` |
| Analytics | `/dashboard/analytics` |
| Settings | `/dashboard/settings` |

## Features

- **Operations dashboard** — occupancy, revenue, arrivals/departures, and pending-reservation KPIs with trend charts
- **Reservations** — searchable directory, per-reservation detail (stay, services, billing, timeline)
- **Guests** — directory, loyalty tiers, spend history, guest profile pages, and a create-guest flow
- **Rooms & room types** — list/grid inventory views, occupancy and rate detail
- **Housekeeping** — status board with priority, assignment, and last-cleaned tracking
- **Front desk** — arrivals, departures, in-house guests, requests, and operational alerts
- **Check-in / check-out** — guided, step-by-step front-desk workflows
- **Maintenance** — issue tracking by category, priority, and status
- **Services** — service catalog with request volume and revenue
- **Billing** — invoices, folio charges, taxes, and settlement status
- **Staff** — directory across departments, shifts, and performance
- **Calendar** — month/week views and a horizontally scrollable reservation timeline
- **Reports & analytics** — occupancy, revenue, reservation, guest, room, and housekeeping breakdowns (Recharts)
- **Settings** — property profile, booking policies, billing/tax, and notification preferences
- Fully responsive: collapsible sidebar with mobile sheet navigation, adaptive grids, and scrollable tables/calendar/timeline on small screens
- Light/dark mode and configurable theme presets

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (radix-nova style)
- **Charts**: Recharts
- **Calendar**: FullCalendar (month/week) plus a custom timeline view
- **State**: local React state — no server, API, or database
- **Tooling**: Biome, Husky

## Mock Data

Every guest, reservation, room, staff member, and invoice is generated deterministically from a seeded random generator in [`src/data/hospitality`](./src/data/hospitality). The dataset is internally consistent — occupancy, arrivals/departures, and billing all derive from the same underlying reservations — and identical across every render, so the app behaves the same way on every load.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/rudawirocaltontshuma/hospitality_management.git
   cd hospitality_management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be running at [http://localhost:3000](http://localhost:3000).

### Formatting and Linting

```bash
npm run check       # biome check
npm run check:fix   # biome check --write
npm run lint         # biome lint
npm run format       # biome format --write
```

### Production Build

```bash
npm run build
npm run start
```

## Project Structure

This project follows a **colocation-based architecture**: each module keeps its own page, components, and logic inside its route folder.

```
src
├── app
│   └── (main)/dashboard
│       ├── _components
│       │   ├── hospitality   # Shared UI: data table, status badge, stat card, page header
│       │   ├── overview      # Dashboard KPI/chart widgets
│       │   ├── header        # App header (search, theme, layout controls, account)
│       │   └── sidebar       # App sidebar / navigation
│       ├── reservations
│       ├── guests
│       ├── rooms
│       ├── room-types
│       ├── housekeeping
│       ├── front-desk
│       ├── check-in
│       ├── check-out
│       ├── maintenance
│       ├── services
│       ├── billing
│       ├── staff
│       ├── calendar
│       ├── reports
│       ├── analytics
│       └── settings
├── components/ui        # shadcn/ui primitives
├── data/hospitality      # Mock dataset: generators, types, selectors, formatters
├── hooks                 # Reusable hooks
├── lib                    # Config & utilities
├── navigation             # Sidebar nav config
└── styles                 # Tailwind / theme setup
```

## License

MIT — see [`LICENSE`](./LICENSE).
