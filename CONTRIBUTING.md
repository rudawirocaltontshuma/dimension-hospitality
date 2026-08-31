# Contributing to Dimension Hospitality

Thanks for showing interest in improving **Dimension Hospitality** (repo: `hospitality_management`).
This guide will help you set up your environment and understand how to contribute.

---

## Overview

This project is a frontend-only hotel & hospitality management platform demo, built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**, on top of the open-source [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) template.

There is no backend, database, or authentication — every screen reads from a deterministic, seeded mock dataset. Keep the codebase modular, scalable, and frontend-only when contributing.

---

## Project Layout

We use a **colocation-based file system**. Each module keeps its own page, components, and logic.

```
src
├── app
│   ├── (external)          # Public/marketing routes
│   └── (main)
│       ├── dashboard        # App shell (sidebar, header) + every module
│       │   ├── _components
│       │   │   ├── hospitality   # Shared hospitality UI (table, status badge, stat card...)
│       │   │   └── overview      # Dashboard KPI/chart widgets
│       │   ├── reservations
│       │   ├── guests
│       │   ├── rooms
│       │   ├── room-types
│       │   ├── housekeeping
│       │   ├── front-desk
│       │   ├── check-in
│       │   ├── check-out
│       │   ├── maintenance
│       │   ├── services
│       │   ├── billing
│       │   ├── staff
│       │   ├── calendar
│       │   ├── reports
│       │   ├── analytics
│       │   ├── settings
│       │   └── ...           # original template demo dashboards (crm, ecommerce, ...)
│       └── auth
├── components               # Shared shadcn/ui components (do not edit src/components/ui or src/components/calendar directly)
├── data
│   └── hospitality           # The mock dataset: generators, types, selectors, formatters
├── hooks                    # Reusable hooks
├── lib                       # Config & utilities
├── navigation                # Sidebar nav config
└── styles                    # Tailwind / theme setup
```

Every module's route-specific components live in that module's own `_components/` directory. Only promote a component to a shared location once a second module actually reuses it.

---

## Getting Started

### Fork and Clone the Repository

1. Fork the repository on GitHub.
2. Clone your fork
   ```bash
   git clone https://github.com/YOUR_USERNAME/hospitality_management.git
   cd hospitality_management
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Run the dev server
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Contribution Flow

- Always create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```
- Use clear, conventional commit messages:
  ```bash
  git commit -m "feat: add loyalty tier filter to guests directory"
  ```
- Open a Pull Request once ready.
- If your change adds or changes a screen, include a screenshot in your PR description.

---

## Where to Contribute

- **Hospitality modules**: `src/app/(main)/dashboard/<module>/` (reservations, guests, rooms, housekeeping, front-desk, check-in, check-out, maintenance, services, billing, staff, calendar, reports, analytics, settings)
- **Mock dataset**: `src/data/hospitality/` — generators, types, status color maps, formatters, and derived aggregates (occupancy, revenue, etc.)
- **Shared hospitality UI**: `src/app/(main)/dashboard/_components/hospitality/`
- **Auth screens** (template only, not part of the product): `src/app/(main)/auth/`
- **Shared UI components**: `src/components/` (do not modify `src/components/ui/` or `src/components/calendar/` — style/customize where they're used instead)
- **Themes**: new presets under `src/styles/presets/`

---

## Guidelines

- All data must stay fictional and frontend-only — no real backend calls, no persistence beyond local component state.
- Prefer **TypeScript types** over `any`.
- Husky pre-commit hooks are enabled — linting and formatting run automatically when you commit, and the commit is blocked until issues are fixed.
- Follow **shadcn/ui** conventions and semantic Tailwind theme tokens (avoid arbitrary hex/OKLCH values).
- Keep accessibility in mind (ARIA, keyboard navigation, labeled form controls).
- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- Avoid unnecessary dependencies — prefer existing utilities and components where possible.

---

## Submitting PRs

- Open a Pull Request once your changes are ready.
- Ensure your branch is up to date with `main` before submitting.
- Reference any related issue in your PR for context.
- Run `npm run check` and `npm run build` locally before opening the PR.

---

## Questions & Support

- Report bugs, suggestions, or issues via [GitHub Issues](https://github.com/rudawirocaltontshuma/hospitality_management/issues)

---

Your contributions keep this project growing. 🚀
