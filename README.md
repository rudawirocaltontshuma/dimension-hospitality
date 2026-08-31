# Dimension Hospitality

**Dimension Hospitality** is a frontend-only demonstration of a hotel & hospitality management platform, built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui.

It covers the full day-to-day workflow of running a property — reservations, front desk, housekeeping, billing, staff, and analytics — using deterministic, fictional mock data. There is no backend, database, authentication, booking engine, or payment processing; every workflow (check-in, check-out, creating a guest, marking a room clean, etc.) updates local component state only and never persists.

> [!IMPORTANT]
> This is a UI/UX demo. No real guest information, reservations, or payments are involved anywhere in the app.

## Modules

All modules live under `/dashboard`:

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

The original template's generic demo dashboards and pages (CRM, E-commerce, Kanban, Invoice, etc.) are still reachable from the sidebar under **Template Library**, but they are not part of the Dimension Hospitality product.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (radix-nova style)
- **Charts**: Recharts
- **Calendar**: FullCalendar (Month/Week) + a custom horizontally-scrollable Timeline view
- **Tables**: TanStack Table (legacy template screens) and a lightweight shared table for the hospitality modules
- **State**: local React state only — there is no server, API, or database
- **Tooling**: Biome, Husky

## Mock Data

Every guest, reservation, room, staff member, and invoice is generated deterministically from a seeded random generator in [`src/data/hospitality`](./src/data/hospitality), so the dataset is internally consistent (occupancy, arrivals/departures, and billing all derive from the same underlying reservations) and identical across every render.

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

## Colocation File System Architecture

This project follows a **colocation-based architecture**: each dashboard module keeps its own page, components, and logic inside its route folder (`src/app/(main)/dashboard/<module>/_components`). Shared UI, hooks, and the mock dataset live at the top level (`src/components`, `src/hooks`, `src/data/hospitality`).

## Credits

Dimension Hospitality is built on top of [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by [Mohammed Arham Khan](https://github.com/arhamkhnz), an open-source Next.js admin dashboard template — used here under its MIT license (see [`LICENSE`](./LICENSE)). The original template's admin shell, sidebar, theme system, and several demo dashboards remain in the codebase and are credited accordingly.
