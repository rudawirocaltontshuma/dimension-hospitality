# Contributing to Dimension Hospitality

Thanks for your interest in improving **Dimension Hospitality**. This guide covers how to set up your environment and contribute.

---

## Overview

Dimension Hospitality is a frontend-only hotel & hospitality management interface built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. There is no backend, database, or authentication — every screen reads from a deterministic, seeded mock dataset in `src/data/hospitality`. Keep the codebase modular, scalable, and frontend-only when contributing.

---

## Project Layout

We use a **colocation-based file system**: each module keeps its own page, components, and logic.

```
src
├── app
│   └── (main)/dashboard
│       ├── _components
│       │   ├── hospitality   # Shared UI: data table, status badge, stat card, page header
│       │   ├── overview      # Dashboard KPI/chart widgets
│       │   ├── header        # App header
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

Every module's route-specific components live in that module's own `_components/` directory. Only promote a component to a shared location once a second module actually reuses it.

---

## Getting Started

1. Fork the repository and clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/hospitality_management.git
   cd hospitality_management
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the dev server
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Create a new branch before making changes:
  ```bash
  git checkout -b feature/my-update
  ```
- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add loyalty tier filter to guests directory"
  ```
- Open a Pull Request once ready. If your change adds or changes a screen, include a screenshot.

---

## Where to Contribute

- **Modules**: `src/app/(main)/dashboard/<module>/` — reservations, guests, rooms, room-types, housekeeping, front-desk, check-in, check-out, maintenance, services, billing, staff, calendar, reports, analytics, settings
- **Mock dataset**: `src/data/hospitality/` — generators, types, status color maps, formatters, and derived aggregates (occupancy, revenue, etc.)
- **Shared hospitality UI**: `src/app/(main)/dashboard/_components/hospitality/`
- **Shared UI primitives**: `src/components/ui/` — keep these intact; style or customize a component where it's used instead of editing the primitive itself
- **Theme presets**: `src/styles/presets/`

---

## Guidelines

- All data must stay fictional and frontend-only — no real backend calls, no persistence beyond local component state.
- Prefer **TypeScript types** over `any`.
- Husky pre-commit hooks run linting and formatting automatically; the commit is blocked until issues are fixed.
- Follow **shadcn/ui** conventions and semantic Tailwind theme tokens (avoid arbitrary hex/OKLCH values).
- Keep accessibility in mind (ARIA, keyboard navigation, labeled form controls).
- Use conventional commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Avoid unnecessary dependencies — prefer existing utilities and components where possible.

---

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting.
- Run `npm run check` and `npm run build` locally before opening the PR.
- Reference any related issue in your PR for context.

---

## Questions & Support

Report bugs, suggestions, or issues via [GitHub Issues](https://github.com/rudawirocaltontshuma/hospitality_management/issues).
