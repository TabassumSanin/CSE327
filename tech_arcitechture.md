# Technical Architecture

**Project:** Smart Food Exchange (CSE327)
**Stack:** Next.js 15 (App Router) · React 19 · TypeScript 5.7 · Tailwind CSS 3.4
**Status:** Frontend prototype with in-memory mock data (no backend)

---

## 1. Purpose of This Document

This document describes how the application is built: the runtime model, routing
architecture, component layers, state management, domain model, business rules, and
the path to a production deployment. It reflects the code in `src/` as it exists
today and separates what is real from what is simulated.

---

## 2. Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Browser (client)                         │
│                                                                     │
│  Next.js App Router (src/app)                                       │
│   ├─ Public route group        (marketing pages)                    │
│   ├─ Auth route group          (login / register)                   │
│   ├─ Admin workspace           (admin/*)                            │
│   ├─ Donor workspace           (donor/*)                            │
│   └─ Recipient workspace       (recipient/*)                        │
│                                                                     │
│  Shared layout system (src/components/layout)                       │
│   ├─ PublicHeader / PublicFooter                                    │
│   ├─ DashboardShell → Sidebar + Topbar + MobileBottomNav            │
│                                                                     │
│  Global state: AppProvider (React Context)  ── src/components/       │
│   ├─ donations, reservations, users, notifications, activities      │
│   ├─ mutation actions (addDonation, reserveFood, updateReservation) │
│   ├─ i18n language + translate()                                    │
│   └─ toast queue                                                    │
│                                                                     │
│  Seed data: src/data/mock.ts  (in-memory, reset on reload)          │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    No API / no database / no auth server
```

Everything runs in the browser. There are no API routes, server actions, database
calls, or external services. Refreshing the page restores the seed data.

---

## 3. Technology Stack

| Layer            | Choice                          | Notes                                            |
| ---------------- | ------------------------------- | ------------------------------------------------ |
| Framework        | Next.js 15.5 (App Router)       | Route groups, nested layouts, `next/font`        |
| UI runtime       | React 19                        | Hooks, Context, client components                |
| Language         | TypeScript 5.7 (strict)         | Path alias `@/*` → `src/*`                       |
| Styling          | Tailwind CSS 3.4               | Custom design tokens in `tailwind.config.ts`     |
| Icons            | lucide-react 0.468              | One consistent icon set                          |
| Fonts            | Inter + Noto Sans Bengali       | Loaded with `next/font/google` in the root layout |
| Linting          | ESLint via `next lint`          | Configured by Next.js defaults                   |
| Package manager  | npm                             | `package-lock.json` committed                    |

---

## 4. Rendering Model

- The App Router is used, but the application is **client-heavy**.
- Route-group layouts (`(public)`, `(auth)`, `admin`, `donor`, `recipient`) are
  server components that compose the shell and render children.
- Nearly every page is marked `"use client"` because it reads state from
  `AppProvider` through `useApp()`.
- `src/app/layout.tsx` is the only root layout. It:
  1. Loads the Inter and Noto Sans Bengali font variables.
  2. Sets global metadata (`Smart Food Exchange | Food Redistribution Platform`).
  3. Wraps the tree in `AppProvider` and mounts the global `Toaster`.

There is no SSR data fetching, no `generateStaticParams`, no middleware, and no
server-side session. Navigation is entirely client-side via `<Link>` and
`useRouter().push()`.

---

## 5. Directory Structure

```
src/
├─ app/
│  ├─ layout.tsx                 # Root layout: fonts, metadata, AppProvider, Toaster
│  ├─ globals.css                # Tailwind layers, CSS variables, component classes
│  │
│  ├─ (auth)/                    # Auth route group (shares a minimal header)
│  │  ├─ layout.tsx
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  │
│  ├─ (public)/                  # Marketing / public route group
│  │  ├─ layout.tsx              # PublicHeader + main + PublicFooter
│  │  ├─ page.tsx                # Landing page
│  │  ├─ about/page.tsx
│  │  ├─ how-it-works/page.tsx
│  │  └─ contact/page.tsx
│  │
│  ├─ admin/                     # Admin workspace
│  │  ├─ layout.tsx              # DashboardShell role="admin"
│  │  ├─ dashboard/page.tsx
│  │  ├─ users/page.tsx
│  │  ├─ approvals/page.tsx
│  │  ├─ food-reviews/page.tsx
│  │  ├─ donations/page.tsx
│  │  ├─ reservations/page.tsx
│  │  ├─ reports/page.tsx
│  │  └─ settings/page.tsx
│  │
│  ├─ donor/                     # Donor workspace
│  │  ├─ layout.tsx              # DashboardShell role="donor"
│  │  ├─ dashboard/page.tsx
│  │  ├─ add-donation/page.tsx
│  │  ├─ donations/page.tsx
│  │  ├─ donations/[id]/page.tsx
│  │  ├─ reservations/page.tsx
│  │  ├─ history/page.tsx
│  │  ├─ notifications/page.tsx
│  │  └─ profile/page.tsx
│  │
│  └─ recipient/                 # Recipient workspace
│     ├─ layout.tsx              # DashboardShell role="recipient"
│     ├─ dashboard/page.tsx
│     ├─ available-food/page.tsx
│     ├─ food/[id]/page.tsx
│     ├─ reservations/page.tsx
│     ├─ collections/page.tsx
│     ├─ history/page.tsx
│     ├─ notifications/page.tsx
│     └─ profile/page.tsx
│
├─ components/
│  ├─ layout/
│  │  ├─ dashboard-shell.tsx     # Sidebar + Topbar + content + mobile nav
│  │  ├─ sidebar.tsx             # Desktop/mobile sidebar, collapsible
│  │  ├─ topbar.tsx              # Page title, search modal, language, notifications, profile menu
│  │  ├─ mobile-nav.tsx          # Five-item bottom navigation on small screens
│  │  ├─ public-header.tsx
│  │  └─ public-footer.tsx
│  ├─ how-it-works/
│  │  ├─ process-timeline.tsx    # Public process stages
│  │  └─ reservation-stepper.tsx # Reservation lifecycle visualization
│  ├─ notifications/
│  │  └─ notification-center.tsx # Shared donor/recipient notification page
│  ├─ providers/
│  │  └─ app-provider.tsx        # Global context: state, actions, i18n, toasts
│  └─ ui/                        # Reusable presentational kit (see section 9)
│
├─ data/
│  └─ mock.ts                    # Seed donations, reservations, users, notifications, charts
│
├─ lib/
│  ├─ i18n.ts                    # Translation dictionary + translate()
│  ├─ nav.ts                     # Role navigation config + food categories
│  └─ utils.ts                   # cn(), date helpers, initials(), categorySlug()
│
└─ types/
   └─ index.ts                   # Domain interfaces and union types
```

---

## 6. Routing Architecture

| Group      | URL prefix    | Layout shell                     | Purpose                          |
| ---------- | ------------- | -------------------------------- | -------------------------------- |
| Public     | `/`           | `PublicHeader` + `PublicFooter`  | Marketing and information        |
| Auth       | `/login`, `/register` | Minimal header           | Account entry                    |
| Admin      | `/admin/*`    | `DashboardShell role="admin"`    | Moderation and platform control  |
| Donor      | `/donor/*`    | `DashboardShell role="donor"`    | Donation management              |
| Recipient  | `/recipient/*`| `DashboardShell role="recipient"`| Food discovery and collections   |

Dynamic routes:

- `/donor/donations/[id]` — donor's own donation detail (edit, cancel, timeline).
- `/recipient/food/[id]` — recipient-facing food detail (reserve quantity).

`usePathname()` is used across the shell to derive the active navigation item,
including the special case that `/recipient/food/*` highlights "Available Food".

> There is **no route-level authorization**. Any URL can be opened directly. The
> role switcher in the Topbar profile menu intentionally allows jumping between
> workspaces for demo purposes.

---

## 7. Layout Architecture

### 7.1 Public shell

`src/app/(public)/layout.tsx`:

```
<div min-h-screen flex-col>
  <PublicHeader />      # brand, nav links, language toggle, login/register
  <main flex-1>         # page content
  <PublicFooter />      # links, contact, copyright
</div>
```

### 7.2 Auth shell

`src/app/(auth)/layout.tsx` renders a slim header with the brand block and a
"Back to home" link. The login page itself is a two-column split: role-selector
illustration panel (desktop) and the form (all breakpoints).

### 7.3 Dashboard shell

`src/components/layout/dashboard-shell.tsx`:

```
<div flex min-h-screen>
  <Sidebar role nav mobileOpen onCloseMobile />
  <div flex-1>
    <Topbar role nav user onOpenMobile />
    <main container-page>   # page content
    <MobileBottomNav role nav />
  </div>
</div>
```

- Desktop sidebar: sticky, 264 px, collapsible to 76 px (`state: collapsed`).
- Mobile: off-canvas sidebar opened from the Topbar hamburger.
- Mobile bottom nav: fixed, 5 role-specific items.
- Topbar: page title, ⌘K-style page search modal, language toggle, notification
  bell with unread count, profile menu with role switcher and logout.

Each workspace layout hardcodes the demo identity for its shell:

- Donor: `currentDonor` (Nusrat Jahan / Green Harvest Kitchen).
- Recipient: `currentRecipient` (Imran Hossain / Hope Community Kitchen).
- Admin: `currentAdmin` (Ayesha Rahman / Platform Administrator).

---

## 8. State Management

### 8.1 Provider

`src/components/providers/app-provider.tsx` exposes one React Context, created
by `AppProvider` and consumed through `useApp()`. It initializes state from
`src/data/mock.ts` and holds everything for the session.

Context value:

| Field / action              | Type / signature                                                   | Effect |
| --------------------------- | ------------------------------------------------------------------ | ------ |
| `language`                  | `"en" \| "bn"`                                                     | Current UI language |
| `setLanguage`               | `(l: Language) => void`                                            | Updates `<html lang>` and `font-bangla` class |
| `toggleLanguage`            | `() => void`                                                       | Flips language |
| `t`                         | `(key: string) => string`                                          | Dictionary lookup |
| `donations`                 | `Donation[]`                                                       | All donation listings |
| `reservations`              | `Reservation[]`                                                    | All reservations |
| `notifications`             | `Notification[]`                                                   | All role-scoped notifications |
| `users`                     | `AppUser[]`                                                        | All accounts |
| `activities`                | `ActivityItem[]`                                                   | Platform activity feed |
| `toasts`                    | `Toast[]`                                                          | Active toast queue |
| `notify`                    | `(message, variant?) => void`                                      | Push toast, auto-dismiss in 4.2 s |
| `dismissToast`              | `(id: number) => void`                                             | Remove toast |
| `addDonation`               | `(input: DonationFormInput) => Donation`                           | Creates a donation + notification + activity |
| `updateDonationStatus`      | `(id, status, notes?) => void`                                     | Admin review outcome, updates verification |
| `updateDonation`            | `(id, patch) => void`                                              | Admin edit of donation fields |
| `reserveFood`               | `(donationId, quantity) => Reservation \| null`                    | Creates provisional reservation and moves quantity |
| `updateReservation`         | `(id, status, collectedQty?) => void`                              | Advances lifecycle and reconciles quantities |
| `markNotificationRead`      | `(id) => void`                                                     | Marks one as read |
| `markAllNotificationsRead`  | `(audience) => void`                                               | Marks all for a role as read |
| `updateUserStatus`          | `(id, status) => void`                                             | Approve / reject / activate / deactivate |
| `updateUser`                | `(id, patch) => void`                                              | Edit account details |

All mutators use functional `setState` updates and record an `ActivityItem`
and/or `Notification` where appropriate.

### 8.2 Data flow

```
Page component (client)
   │  reads: useApp()
   ▼
AppProvider context
   ├─ donations[] ──────────────┐
   ├─ reservations[] ───────────┤ derived UI (filters, stats, charts)
   ├─ users[]                   │
   ├─ notifications[]           │
   └─ activities[]              │
   ▲                            │
   │  writes: action call       │
   └────────────────────────────┘
        (state updates re-render all consumers)
```

Derived data (stat cards, filtered tables, charts, match scores) is computed
inside page components on each render; there is no selector/memoization layer.
This is acceptable at prototype scale.

### 8.3 Persistence

None. There is no `localStorage`, `sessionStorage`, cookie, or API call anywhere.
Reloading resets all changes to the seed values. This is intentional for the demo.

---

## 9. Component Architecture

### 9.1 Layout components

| Component            | Responsibility |
| -------------------- | -------------- |
| `DashboardShell`     | Composes sidebar, topbar, content, mobile nav; owns mobile drawer state |
| `Sidebar`            | Role badge, nav links, collapse control, mobile close, logout |
| `Topbar`             | Active page title, page search modal, language toggle, unread bell, profile menu, role switcher |
| `MobileBottomNav`    | Fixed 5-item bottom bar |
| `PublicHeader`       | Public nav, language toggle, auth actions |
| `PublicFooter`       | Public link columns and legal/contact info |

### 9.2 UI kit (`src/components/ui`)

| File                  | Exports / purpose |
| --------------------- | ----------------- |
| `badge.tsx`           | `StatusBadge` with status → color/label mapping |
| `breadcrumbs.tsx`     | Breadcrumb trail |
| `button.tsx`          | `Button` (variants, sizes, loading) and `buttonStyles()` |
| `charts.tsx`          | `BarChart`, `AreaChart`, `DonutChart`, `ProgressBar` (pure SVG/CSS, no chart library) |
| `empty-state.tsx`     | `EmptyState`, `ErrorMessage` |
| `food-card.tsx`       | Food listing card used in grids |
| `form.tsx`            | `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `Toggle`, `FileDrop` styles |
| `modal.tsx`           | `Modal` (Esc/scroll-lock) and `ConfirmDialog` |
| `notification-card.tsx`| Notification row with read action |
| `page-header.tsx`     | `PageHeader`, `SectionCard` |
| `pagination.tsx`      | Page-number controls with item count |
| `search-field.tsx`    | Debounced-free search input with clear button |
| `stat-card.tsx`       | KPI card with icon, hint, change |
| `table.tsx`           | `TableWrap`, `Th`, `Td`, `Tr`, `Avatar`, `InfoRow` |
| `tabs.tsx`            | Tab pill group with optional counts |
| `timeline.tsx`        | Vertical event timeline |
| `toaster.tsx`         | Global toast renderer bound to context |

### 9.3 Feature components

| Component | Purpose |
| --------- | ------- |
| `NotificationCenter` | Shared donor/recipient inbox: stats, tabs, type filter, search, mark-all-read |
| `ProcessTimeline` | Public "how it works" stage visualization |
| `ReservationStepper` | Reservation lifecycle steps |

Pages are composed from `PageHeader` + `SectionCard` + `StatCard` + tables/cards/
charts/modals. There are no data-fetching components and no server components
beyond the layout shells.

---

## 10. Domain Model

Defined in `src/types/index.ts`.

```
Donation 1 ──────< Reservation          (via donationId)
   │                    │
   └ donor: DonorInfo    └ recipientName (string, matched to AppUser.organization)

AppUser (role: admin | donor | recipient)
Notification (audience: admin | donor | recipient)
ActivityItem (kind: donation | user | reservation | review)
```

### 10.1 Types

| Type               | Key fields |
| ------------------ | ---------- |
| `Role`             | `admin`, `donor`, `recipient` |
| `DonationStatus`   | `available`, `reserved`, `completed`, `pending-review`, `rejected`, `expired`, `cancelled` |
| `VerificationStatus`| `verified`, `needs-review`, `rejected` |
| `ReservationStatus`| `provisional`, `awaiting`, `confirmed`, `declined`, `expired`, `in-progress`, `completed`, `cancelled` |
| `FoodCategory`     | Prepared Food, Packaged Food, Produce, Bakery, Refrigerated, Frozen |
| `Donation`         | identity, category, description, donor, total/available/reserved/collected quantities, preparation and expiry timestamps, storage, temperature, allergens, photos count, pickup details, transportation, status, verification, flags, review notes |
| `Reservation`      | donation link, food and party names, quantity, status, transport, created/confirmation/collection dates, collection window, collected quantity, address, instructions, timeline events |
| `AppUser`          | identity, contact, role, account type, organization, location, status, joined date, documents, applicant type, avatar color |
| `Notification`     | audience role, type, title, message, relative time, read flag |
| `ActivityItem`     | title, message, relative time, kind |

### 10.2 Quantity accounting

A donation tracks three quantities plus a total:

```
quantity = availableQty + reservedQty + collectedQty + (quantity released/lost)
```

Rules implemented in `AppProvider`:

1. **Reserve** (`reserveFood`): requires `0 < qty <= availableQty`. Moves
   `qty` from `availableQty` to `reservedQty`; sets donation to `reserved`
   when nothing remains available. Creates a `provisional` reservation.
2. **Release** (`declined | cancelled | expired`): moves the reservation
   quantity back to `availableQty`, reduces `reservedQty`, and makes the
   donation `available` again (unless it was expired/cancelled).
3. **Complete**: reduces `reservedQty`, increases `collectedQty`; the donation
   becomes `completed` when both available and reserved reach zero.

---

## 11. Business Logic and Rules

### 11.1 Automated food verification (simulated)

When a donor submits a donation (`addDonation`, `app-provider.tsx`):

```ts
needsReview =
  input.allergens.length === 0 ||
  (["Refrigerated", "Frozen"].includes(input.category) && !input.temperature);
```

- If `needsReview` → `status: "pending-review"`, `verification: "needs-review"`,
  `availableQty: 0`, a flag and review note are attached, and the donor receives
  a "Donation needs review" notification.
- Otherwise → `status: "available"`, `verification: "verified"`, full quantity
  available, and a "Donation verified" notification is created.
- An activity item is always recorded.

Admins resolve reviews in `admin/food-reviews` via `updateDonationStatus`:

- `rejected` → verification `rejected`, available quantity zeroed.
- `available` / `reserved` → verification `verified`.
- Other statuses keep existing verification.
- Review notes can be attached.

### 11.2 Reservation lifecycle (simulated)

```
provisional ──confirm──▶ confirmed ──start──▶ in-progress ──complete──▶ completed
     │                       │
     ├──decline──────────────┴──▶ declined        (quantity released)
     ├──cancel───────────────▶ cancelled          (quantity released)
     └──timeout──────────────▶ expired            (quantity released)
```

`updateReservation` also:

- Sets `confirmationDate` on confirmation.
- Rewrites the four-step reservation timeline (provisional → confirmation →
  transport → collection).
- Records donor notifications on confirmation and an activity item for every
  transition.
- Emits toasts for confirmation, decline, completion, and in-progress.

### 11.3 Donor and recipient identity

The app assumes a single logged-in actor per workspace using the seed records:

- Donor dashboard filters donations by `donor.id === currentDonor.id`.
- Donor reservations are those linked to the donor's donation IDs.
- Recipient reservations are filtered by `recipientName === currentRecipient.organization`.
- New reservations always use `currentRecipient.organization` and the donation's
  existing donor.

### 11.4 Impact estimates

The UI estimates meals as `collected kilograms × 3` (donor/recipient dashboards
and history), clearly labeled as an estimate. Monthly recipient goal is a fixed
`50 kg` progress bar.

### 11.5 Notifications and toasts

- Notifications are role-scoped (`audience`) and filterable by type.
- Creating a donation adds donor notifications.
- Creating a reservation adds one recipient and one donor notification.
- Confirming a reservation adds a donor notification.
- Toasts are transient (4.2 s) and rendered by `Toaster` from context.
- Many other actions (export, upload, save settings) only emit a toast to
  simulate the action.

### 11.6 Admin controls (UI + in-memory state)

- **Users**: view, edit profile fields, activate/deactivate (`updateUserStatus`).
- **Approvals**: approve/reject applications (`updateUserStatus`), view documents.
- **Food reviews**: inspect flagged donations, request more information,
  approve (`available`) or reject.
- **Donations**: view and edit quantity/category/status/pickup details
  (`updateDonation`), with toast feedback.
- **Reservations**: monitor and inspect tracking timelines (read-only).
- **Reports**: range and format selectors, chart summaries, export toast.
- **Settings**: general info, languages, food categories, food safety toggles,
  matching configuration, notifications, permissions, administrator access.
  State is local to the page; "Save" emits a toast.

---

## 12. Internationalization

- `src/lib/i18n.ts` defines `Language = "en" | "bn"`, a flat dictionary of
  ~130 keys (`{ en, bn }`), and `translate(key, language)`.
- `AppProvider` exposes `language`, `setLanguage`, `toggleLanguage`, and `t`.
- Switching language:
  - updates `document.documentElement.lang`,
  - toggles the `font-bangla` class for the Bengali font,
  - re-renders components that use `t`.
- `src/lib/nav.ts` carries translated nav labels (`labelBn`) and food category
  names; the sidebar, topbar, and mobile nav switch between them.
- Coverage is partial: many page bodies still use hardcoded English strings.
  Full localization is tracked in `todo.md`.

---

## 13. Styling and Design System

### 13.1 Tailwind tokens (`tailwind.config.ts`)

| Token         | Value     | Use |
| ------------- | --------- | --- |
| `primary`     | `#245C45` | Brand, buttons, active nav |
| `secondary`   | `#3B8062` | Hover, accents |
| `lightgreen`  | `#E7F2EB` | Soft surfaces, icon tiles |
| `page`        | `#F5F7F5` | Page background |
| `card`        | `#FFFFFF` | Cards |
| `ink`         | `#25332B` | Primary text |
| `muted`       | `#6B7870` | Secondary text |
| `line`        | `#DDE5DF` | Borders |
| `success`     | `#DDF3E4` | Positive badges |
| `warning`     | `#FFF1CC` | Pending/holds |
| `error`       | `#FCE3E1` | Negative actions |
| `info`        | `#E1EDFC` | Informational |

Typography scale: `h1` 28/700, `h2` 22/600, `h3` 18/600, `body` 16/400,
`small` 14/400, `label` 14/500, `caption` 12/400, `btn` 14/600. Font families:
`font-sans` (Inter) and `font-bangla` (Noto Sans Bengali).

Spacing is based on a 4 px scale; radii extend `xl` 16 px and `2xl` 20 px;
`shadow-soft` is the standard card shadow.

### 13.2 Global CSS (`src/app/globals.css`)

- Tailwind base/components/utilities.
- CSS variables mirroring the palette.
- Reusable component classes: `.container-page`, `.card`, `.field`, `.label`,
  `.section-title`, `.muted`, `.scrollbar-thin`.
- Utilities/animations: `.animate-fade-up`, `.animate-fade-in`, `.leaf-grid`,
  `.hero-glow`.
- Focus-visible outline for keyboard accessibility.

### 13.3 Assets

`public/images/` holds SVG illustrations for the hero and six food categories.
`next.config.mjs` also allows remote images from `images.unsplash.com` (not
currently used).

---

## 14. Mock Data Layer

`src/data/mock.ts` exports:

| Export | Content |
| ------ | ------- |
| `currentDonor`, `currentRecipient`, `currentAdmin` | Demo identities |
| `donations` | Multiple listings across statuses and categories |
| `reservations` | Reservations across the lifecycle |
| `users` | Admin, donor, and recipient accounts with statuses and documents |
| `notifications` | Donor and recipient notifications |
| `activities` | Recent platform activity |
| `monthlyData`, `weeklyData`, `categoryDistribution`, `donationStatusData`, `recipientActivity`, `matchStats` | Chart and report datasets |

Demo dates are clustered around November 2026 to match `daysUntil()`, which
compares against the fixed timestamp `2026-11-06T12:00:00` in `src/lib/utils.ts`.

`mock.ts` also contains helper donor records (Green Harvest Kitchen, Sunrise
Bakery, and others) referenced by donations.

---

## 15. Configuration and Tooling

| File | Purpose |
| ---- | ------- |
| `package.json` | Scripts: `dev`, `build`, `start`, `lint`; dependencies |
| `tsconfig.json` | Strict mode, bundler resolution, `@/*` → `./src/*` |
| `next.config.mjs` | Remote image allowance for Unsplash |
| `tailwind.config.ts` | Color/typography/spacing/shadow extensions |
| `postcss.config.mjs` | Tailwind + autoprefixer |
| `.gitignore` | Ignores `node_modules`, `.next`, env files, build output |

Build commands:

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

---

## 16. Accessibility and Responsiveness

- Semantic landmarks: `header`, `nav`, `main`, `aside`, `footer`, lists, tables.
- `aria-label`, `aria-current`-style active states, `aria-selected` on role tabs,
  `aria-haspopup`/`aria-expanded` on the profile menu, `role="img"` with labels
  on charts, and dialog semantics in `Modal`.
- Keyboard support: focus-visible ring; modal closes on Escape; forms use native
  controls and labels.
- Responsive breakpoints: mobile-first layout, desktop sidebar at `lg`, adaptive
  grids (`grid-cols-2` → `lg:grid-cols-4`), horizontally scrollable tables, and
  a dedicated mobile bottom nav.

Known gaps are listed in `todo.md` (focus trapping in modals, full screen-reader
audit, contrast verification on status colors).

---

## 17. Security, Constraints, and Known Limitations

This prototype deliberately omits production concerns:

- **No authentication/authorization.** Login is a simulated delay + redirect;
  role switcher bypasses access control; any route is reachable directly.
- **No backend or persistence.** All data is in React state; reload resets it.
- **No input sanitization beyond form validation.** No file uploads are stored;
  selected files are read by name only.
- **No real matching, verification, notifications, email, or SMS.** These are
  represented by status flags, seeded data, and toasts.
- **Charts are hand-built** with SVG/CSS and static datasets in several places
  rather than derived from live state.
- **Localization is partial** (dictionary exists; not every string uses it).
- **Demo time is fixed** to November 2026 for expiry calculations.
- **No tests.** No testing framework is configured.

---

## 18. Proposed Production Architecture

To evolve the prototype into a real system, the recommended target is:

```
Next.js app (App Router)
   │  server components for authenticated data where possible
   ▼
API layer (Route Handlers / tRPC / REST)
   ├─ auth service        (session/JWT, RBAC: admin/donor/recipient)
   ├─ donation service    (CRUD, verification, lifecycle)
   ├─ reservation service (atomic quantity allocation, hold expiry)
   ├─ matching service    (scores: urgency, distance, eligibility, expiry)
   ├─ notification service(email, SMS, in-app, queues)
   ├─ user service        (profiles, documents, approvals)
   └─ reporting service   (aggregations, exports)
   ▼
PostgreSQL (Prisma/Drizzle)
   ├─ users, donor_profiles, recipient_profiles, documents
   ├─ donations, donation_photos, allergens
   ├─ reservations, reservation_events
   ├─ notifications, activities
   └─ settings, audit_logs
Object storage (S3-compatible) for photos and verification documents
Background jobs (queues/cron): hold expiry, reminders, daily digests, match runs
```

Implementation priorities:

1. Authentication with role-based access control and protected route groups.
2. Database schema and API contracts mirroring `src/types/index.ts`.
3. Atomic reservation allocation (transaction with row locking) and scheduled
   expiry/release jobs.
4. Real verification rules and administrator review workflow with audit logs.
5. Server-side matching with explainable scores.
6. Notification delivery and full i18n.
7. Automated tests and CI/CD.

A detailed, prioritized backlog is maintained in `todo.md`.

---

## 19. Deployment Notes

- Static-friendly Next.js deployment (Vercel, Node server, or container).
- No environment variables are required today. A real backend will require
  database, auth, storage, email/SMS, and map configuration via `.env` files
  (already git-ignored).
- Build with `npm run build`; serve with `npm start`.
- Because all pages are client components using context, the app builds as a
  standard Next.js application with no special runtime requirements.

---

## 20. Key File Reference

| Concern | File |
| ------- | ---- |
| Global provider and mutation logic | `src/components/providers/app-provider.tsx` |
| Domain types | `src/types/index.ts` |
| Seed data and chart datasets | `src/data/mock.ts` |
| Navigation and categories | `src/lib/nav.ts` |
| i18n dictionary | `src/lib/i18n.ts` |
| Date/format helpers | `src/lib/utils.ts` |
| Dashboard shell | `src/components/layout/dashboard-shell.tsx` |
| Sidebar / Topbar / mobile nav | `src/components/layout/*` |
| Notification center | `src/components/notifications/notification-center.tsx` |
| UI kit | `src/components/ui/*` |
| Design tokens | `tailwind.config.ts` |
| Global styles | `src/app/globals.css` |

For screen-by-screen navigation and flows, see `visualmap.md`.
For the prioritized backlog, see `todo.md`.
