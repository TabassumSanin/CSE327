# TODO / Backlog

**Smart Food Exchange (CSE327) — prioritized task tracker**

This file tracks what is done, what is simulated, and what remains to turn the
frontend prototype into a working product. Update checkboxes as work lands.

Related documents:

- `README.md` — overview and setup
- `tech_arcitechture.md` — implementation architecture
- `visualmap.md` — routes, navigation, and user flows

---

## Status Legend

```
[x]  Done (implemented in the current codebase)
[ ]  Not started
[~]  Partially done / demo-only (needs real implementation)
```

Priority:

```
P0  Blocker for a functional product
P1  Core feature completeness
P2  Quality, polish, and operations
P3  Nice-to-have / future
```

> "Demo-only" means the UI exists but the action is simulated with React state
> and/or a toast. No data leaves the browser and nothing persists.

---

## 0. Current Snapshot

- [x] Next.js 15 + React 19 + TypeScript + Tailwind project scaffolded
- [x] Public marketing site (home, about, how it works, contact)
- [x] Login/register UI with role selection and validation
- [x] Donor workspace UI with in-memory state
- [x] Recipient workspace UI with in-memory state
- [x] Admin workspace UI with in-memory state
- [x] Shared design system and component kit
- [x] English/Bengali language toggle foundation
- [~] Business workflows (verification, reservations, collections) simulated in context
- [ ] Backend, database, real authentication, file storage, notifications
- [ ] Automated tests and CI/CD

**Technical debt headline:** everything is client state seeded from
`src/data/mock.ts`; no route protection; partial i18n; fixed demo dates.

---

## 1. Foundations and Project Setup

- [x] Initialize Next.js App Router project with TypeScript
- [x] Configure Tailwind CSS with brand tokens
- [x] Configure path alias `@/*` → `src/*`
- [x] Add Inter and Noto Sans Bengali fonts
- [x] Establish route groups `(public)`, `(auth)`, plus role workspaces
- [x] Create shared UI kit (`components/ui/*`)
- [x] Create layout shell (`DashboardShell`, `Sidebar`, `Topbar`, `MobileBottomNav`)
- [x] Create global provider for state and i18n
- [x] Seed demo data in `src/data/mock.ts`
- [x] Define domain types in `src/types/index.ts`
- [x] Write project documentation (`README.md`, architecture, visual map, this file)
- [ ] P1 Add a proper ESLint/Prettier configuration and format check
- [ ] P2 Add a `typecheck` script (`tsc --noEmit`) and run it in CI
- [ ] P2 Add a license file and contribution guidelines
- [ ] P2 Add `.env.example` for future backend configuration

---

## 2. P0 — Backend and Data Layer

- [ ] Choose ORM (Prisma or Drizzle) and database (PostgreSQL recommended)
- [ ] Design schema for users, donor/recipient profiles, donations, reservations,
      notifications, activities, documents, settings, audit logs
- [ ] Add migrations and seed scripts
- [ ] Replace `src/data/mock.ts` reads with API/database queries
- [ ] Implement API layer (Route Handlers, tRPC, or REST) with validation (Zod)
- [ ] Persist donation create/update/status changes
- [ ] Persist reservations with atomic quantity allocation (transactions/row locks)
- [ ] Persist notifications and read state per user
- [ ] Persist user approvals, status changes, and profile edits
- [ ] Persist admin settings (general, safety, matching, notification prefs)
- [ ] Implement pagination, filtering, and sorting server-side for large tables
- [ ] Add optimistic UI or revalidation after mutations
- [ ] Add audit logging for admin actions
- [ ] P1 Add database indexes for status, category, expiry, and donor/recipient lookups

**Acceptance:** data survives reloads, two browser sessions see consistent state,
and concurrent reservations cannot oversell a donation.

---

## 3. P0 — Authentication and Authorization

- [ ] Replace the simulated login with real authentication (Auth.js, Clerk,
      Supabase Auth, or custom credentials/session)
- [ ] Hash and verify passwords; remove plaintext demo credentials
- [ ] Implement registration that creates real accounts and applications
- [ ] Persist and review uploaded verification documents
- [ ] Enforce recipient approval before granting access
- [ ] Add middleware / server-side guards for `/admin`, `/donor`, `/recipient`
- [ ] Add role-based access control on every API endpoint
- [ ] Remove the demo role switcher (or gate it behind `NODE_ENV !== production`)
- [ ] Implement logout that destroys the session
- [ ] Add password reset flow and email verification
- [ ] Add session expiry, secure cookies, and CSRF protection
- [ ] Add rate limiting on auth and sensitive endpoints
- [ ] P2 Add optional two-factor authentication for admins
- [ ] P2 Add active session management (list/revoke sessions)

**Acceptance:** unauthenticated users are redirected, donors cannot access admin
routes/APIs, and recipients cannot act before approval.

---

## 4. P1 — Donor Features

- [x] Donor dashboard with KPIs, trend chart, category mix, recent activity
- [x] Multi-section add-donation form with validation and readiness checklist
- [x] My Donations list with search, category/status filters, pagination
- [x] Donation detail with safety review, pickup info, reservations, timeline
- [x] Edit donation and cancel donation modals (in-memory)
- [x] Reservations page with confirm/decline/complete actions (in-memory)
- [x] Donation history with filters and export toast
- [x] Profile with organization details, documents, preferences, security
- [ ] Persist new donations and uploaded photos to backend/storage
- [ ] Implement real photo upload (validation, size limits, thumbnails)
- [ ] Enforce server-side donation validation and verification rules
- [ ] Add real edit/cancel with confirmation emails/notifications
- [ ] Let donors specify multiple pickup windows and transport options
- [ ] Add donation duplication and drafts
- [ ] Add real export (CSV/PDF) of donation history and impact
- [ ] Add donor analytics backed by real data
- [ ] P2 Add recurring donations / templates
- [ ] P2 Add donor ratings/feedback visibility

---

## 5. P1 — Recipient Features

- [x] Recipient dashboard with recommendations, upcoming collections, impact
- [x] Available food grid with search, category, expiry, sort, pagination
- [x] Food detail with safety info, pickup details, reserve form
- [x] Reservations page with confirm/decline/cancel (in-memory)
- [x] Collections page with start/complete, report issue, leave feedback
- [x] Collection history with outcomes and export toast
- [x] Profile with organization details, eligibility, documents, preferences
- [ ] Enforce recipient approval and eligibility on browse/reserve APIs
- [ ] Implement real reservation holds with deadlines and automatic expiry jobs
- [ ] Implement server-side matching (urgency, distance, eligibility, expiry)
- [ ] Make match scores dynamic and explainable per recipient
- [ ] Add map/distance and pickup routing assistance
- [ ] Persist collection confirmations, issues, and feedback
- [ ] Add real export of collection history
- [ ] Add saved favourites / watchlist for food
- [ ] P2 Add recipient demand forecasting and recurring needs
- [ ] P2 Add SMS/email reminders for confirmations and pickups

---

## 6. P1 — Admin Features

- [x] Admin dashboard with KPIs, charts, recent donations/users, activity
- [x] Manage Users with filters, profile view, edit, activate/deactivate
- [x] Account Approvals with application details and approve/reject
- [x] Food Reviews with queue tabs, filters, inspect, request info, approve/reject
- [x] Manage Donations with detail and edit modals
- [x] Monitor Reservations with detail and tracking timeline
- [x] Reports with range/format controls, charts, matching metrics, export modal
- [x] Platform Settings sections with local toggles and save toasts
- [ ] Persist all approvals, reviews, edits, and settings server-side
- [ ] Implement real document review (view/download uploaded files)
- [ ] Add admin action history/audit trail with actor, time, and reason
- [ ] Add bulk actions (approve, reject, export selected)
- [ ] Add role management and fine-grained permissions
- [ ] Make verification rules configurable and actually enforced by the backend
- [ ] Make matching configuration drive the matching engine
- [ ] Add real report generation (CSV/PDF) for donations, users, redistribution
- [ ] Add scheduled digests and alert configuration
- [ ] P2 Add content moderation for photos/descriptions
- [ ] P2 Add admin notification center (currently only donor/recipient shared)

---

## 7. P1 — Shared Workflows and Business Logic

- [ ] Move verification rules from `AppProvider` into the backend
- [ ] Implement reservation expiry scheduler and auto-release
- [ ] Implement partial fulfilment rules when collected quantity differs
- [ ] Validate quantity invariants (`available + reserved + collected <= total`)
- [ ] Add concurrency-safe reservation allocation
- [ ] Implement real notification delivery (in-app + email, optional SMS)
- [ ] Add notification preferences enforcement (not just UI toggles)
- [ ] Replace activity/toast simulations with real events
- [ ] Add a donation audit timeline generated from real events
- [ ] Add dispute/issue resolution workflow for collection problems
- [ ] Add platform-wide search across donations, users, reservations
- [ ] Add saved filters and URL-synced query parameters

---

## 8. P2 — UX, Accessibility, and Polish

- [x] Responsive layouts, mobile bottom nav, off-canvas sidebar
- [x] Focus-visible styling and semantic landmarks
- [x] Status badge color/label system
- [x] Empty states for filtered/empty tables
- [x] Loading state on primary buttons (login)
- [ ] Add focus trapping and focus return for all modals
- [ ] Add skip-to-content link and improve landmark labelling
- [ ] Audit color contrast, especially warning/neutral badges
- [ ] Add keyboard navigation tests for menus, tabs, and dialogs
- [ ] Add skeleton loaders and error boundaries for async data
- [ ] Add pagination to all long tables (some are client-sliced only)
- [ ] Make all analytics derive from live data rather than static datasets
- [ ] Add consistent date/time formatting across time zones
- [ ] Add print-friendly report views
- [ ] Add dark mode (optional)
- [ ] P3 Add onboarding tours for each role

---

## 9. P2 — Internationalization (i18n)

- [x] Language type, dictionary, and `translate()` helper
- [x] Language toggle in public header, topbar, and profiles
- [x] Bengali font switching via `font-bangla`
- [x] Translated navigation labels and food categories
- [~] Dictionary covers many common labels, but page bodies are still mostly English
- [ ] Move every hardcoded string to the dictionary (or adopt `next-intl`)
- [ ] Add locale-aware number, date, and currency formatting
- [ ] Persist language preference per user/session
- [ ] Add `lang` and metadata per locale; consider localized routes
- [ ] Translate validation messages, toasts, and empty states
- [ ] Add Bengali review for terminology and tone
- [ ] Add tests for translation key coverage

---

## 10. P2 — Testing and Quality

- [ ] Set up a test runner (Vitest/Jest) and React Testing Library
- [ ] Add unit tests for `AppProvider` quantity accounting
- [ ] Add unit tests for verification rules and status transitions
- [ ] Add unit tests for `lib/utils.ts` date/format helpers
- [ ] Add component tests for forms, tables, modals, and notification center
- [ ] Add end-to-end tests (Playwright) for all three role journeys
- [ ] Add API contract tests once the backend exists
- [ ] Add accessibility tests (axe) in CI
- [ ] Add visual regression tests for key screens
- [ ] Add lint and typecheck gates in CI
- [ ] Define coverage targets and quality checklist

Suggested end-to-end scenarios:

1. Donor submits incomplete donation → admin sees pending review → approves →
   recipient reserves → donor confirms → recipient collects.
2. Donor submits complete donation → available immediately → reserve → decline
   → quantity released and donation available again.
3. Recipient application requires documents → admin approves → recipient can
   reserve food.
4. Admin rejects donation → quantity stays zero and donor is notified.

---

## 11. P2 — DevOps and Operations

- [ ] Add CI pipeline (lint, typecheck, tests, build)
- [ ] Configure preview deployments per pull request
- [ ] Add environment management (development, staging, production)
- [ ] Add structured logging and error monitoring (e.g. Sentry)
- [ ] Add uptime and performance monitoring
- [ ] Add database backups and retention policy
- [ ] Add seeds/fixtures for staging demos
- [ ] Add security headers and dependency scanning
- [ ] Add analytics for product usage (privacy-aware)
- [ ] Document deployment runbook and rollback steps

---

## 12. P3 — Future Enhancements

- [ ] Mobile app or PWA with offline support
- [ ] Advanced matching with ML ranking and feedback loops
- [ ] Route optimization for multi-stop pickups
- [ ] Cold-chain IoT temperature sensor integration
- [ ] Public impact dashboard and open data exports
- [ ] Partner/NGO integrations and API for third parties
- [ ] Gamification and donor recognition badges
- [ ] Carbon/water savings calculations
- [ ] Multi-city / multi-tenant support
- [ ] Payments or reimbursements for transport (if required)
- [ ] Calendar integrations for pickup scheduling

---

## 13. Known Limitations (Must Be Addressed)

- [ ] No persistence: refresh resets all changes
- [ ] No real authentication or route protection
- [ ] Demo role switcher bypasses account boundaries
- [ ] Uploaded files/photos are not stored
- [ ] Verification, matching, notifications, exports, and saves are simulated
- [ ] Fixed demo clock (`2026-11-06`) drives expiry calculations
- [ ] Charts and some reports use static datasets
- [ ] Partial Bengali coverage
- [ ] No automated tests
- [ ] Some profile/settings forms do not write back to shared state

---

## 14. Milestones

### M1 — Demo polish (current focus)

- [x] Complete all role screens and navigation
- [x] Consistent design system and responsive shell
- [ ] Finish remaining demo interactions and fix any dead links
- [ ] Final visual QA across breakpoints
- [ ] Record a walkthrough of all three role journeys

### M2 — Persistence

- [ ] Database schema, API layer, and seed migration
- [ ] Persist donations, reservations, users, notifications, settings
- [ ] Replace mock reads with server data

### M3 — Security and accounts

- [ ] Real auth, RBAC, route guards
- [ ] Real registration, documents, and approvals
- [ ] Remove demo-only shortcuts from production builds

### M4 — Real workflows

- [ ] Server-side verification rules and matching
- [ ] Reservation expiry jobs and atomic allocation
- [ ] Real notifications and exports

### M5 — Quality and launch

- [ ] Automated test suite and CI/CD
- [ ] Accessibility and performance audits
- [ ] Production deployment and monitoring

---

## 15. Definition of Done

A task is done when:

1. The feature works end-to-end against real data (or is explicitly labeled demo).
2. Validation and error states are handled on the client and server.
3. Permissions are enforced server-side.
4. Strings are localized (or an issue is filed for missing translations).
5. Responsive behavior and keyboard access are verified.
6. Lint, typecheck, and tests pass.
7. Documentation is updated (`README.md`, architecture, this file).

---

## 16. Useful Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
npm run lint       # ESLint
npm run build      # production build
npm start          # run the production build
```

Demo credentials: see `README.md` or the login page.

---

## 17. Contribution Notes

- Work on feature branches (`sanin`, `nasib`, `shajuti`, or `feature/*`).
- Keep changes scoped; update the relevant docs when behavior or routes change.
- Run `npm run lint` before opening a pull request.
- Never commit secrets or environment files.
- When a demo-only interaction becomes real, tick the item here and remove the
  "simulated" wording from the UI.
