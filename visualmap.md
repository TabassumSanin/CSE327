# Visual Map

**Smart Food Exchange — routes, navigation, user journeys, and screen relationships**

This document maps how the product is organized visually and behaviorally: every
route, how pages link to each other, how each role moves through the app, how the
UI is composed, and how domain states change. It complements
`tech_arcitechture.md` (implementation details) and `todo.md` (backlog).

---

## 1. Legend

```
──▶   navigation / user action
···▶   indirect or conditional link
[ ]    a page (route)
( )    a modal or transient UI
{}     a state or data entity
```

All routes are relative to `http://localhost:3000`.

---

## 2. Top-Level Route Tree

```
/
├── (public)
│   ├── /                     Landing / home
│   ├── /about                About the platform
│   ├── /how-it-works         Process explanation
│   └── /contact              Contact form
│
├── (auth)
│   ├── /login                Role-based sign in (demo)
│   └── /register             Donor/recipient registration
│       ?role=recipient       Pre-selects recipient application
│
├── /admin
│   ├── /admin/dashboard      KPIs, analytics, activity, quick actions
│   ├── /admin/users          Manage all accounts
│   ├── /admin/approvals      Approve/reject applications
│   ├── /admin/food-reviews   Verify flagged donations
│   ├── /admin/donations      Browse/edit all donations
│   ├── /admin/reservations   Monitor reservations and tracking
│   ├── /admin/reports        Analytics and exports
│   └── /admin/settings       Platform configuration
│
├── /donor
│   ├── /donor/dashboard      Donation KPIs and activity
│   ├── /donor/add-donation   Multi-section donation form
│   ├── /donor/donations      Donor's listing table
│   ├── /donor/donations/[id] Listing detail, edit, cancel
│   ├── /donor/reservations   Confirm/decline/complete reservations
│   ├── /donor/history        Closed donations and impact
│   ├── /donor/notifications  Notification center
│   └── /donor/profile        Organization, documents, security
│
└── /recipient
    ├── /recipient/dashboard      Recommendations and collections
    ├── /recipient/available-food Browse and reserve food
    ├── /recipient/food/[id]      Food detail and reservation
    ├── /recipient/reservations   Confirm/decline holds
    ├── /recipient/collections    Coordinate and confirm pickups
    ├── /recipient/history        Completed/closed collection history
    ├── /recipient/notifications  Notification center
    └── /recipient/profile        Organization, eligibility, security
```

Dynamic route highlights:

- `/donor/donations/[id]` also matches the "My Donations" nav item.
- `/recipient/food/[id]` also highlights "Available Food" via an explicit
  pathname check in `Topbar`.

---

## 3. Public Site Map

```
                 ┌───────────────────────────────┐
                 │        PublicHeader           │
                 │  Home · About · How it works  │
                 │  Contact · বাংলা · Log in     │
                 └───────────────┬───────────────┘
                                 │
        ┌────────────────┬───────┴────────┬─────────────────┐
        ▼                ▼                ▼                 ▼
    ┌───────┐       ┌────────┐      ┌─────────────┐   ┌────────┐
    │  /    │──▶    │ /about │──▶   │/how-it-works│──▶│/contact│
    └───┬───┘       └────────┘      └─────────────┘   └───┬────┘
        │                                                 │
        ├──▶ /register?role=donor      (Donate Food CTA)  │
        ├──▶ /register?role=recipient  (Find Food CTA)    │
        ├──▶ /login                                       │
        └──▶ Food category cards ──▶ /register            │
                                                          ▼
                                                   submits contact form → toast
```

Public page content:

| Page | Purpose | Primary components | Primary actions |
| ---- | ------- | ------------------ | --------------- |
| `/` | Hero, impact stats, how-it-works summary, benefits, categories, featured food, CTA | `PublicHeader`, `FoodCard`, sections | Donate / Find food / Log in / Register |
| `/about` | Mission, problem, approach, team/values content | Public shell | Register, contact |
| `/how-it-works` | Four-stage process, reservation stepper, safety and matching explanation | `ProcessTimeline`, `ReservationStepper` | Register, browse |
| `/contact` | Contact form and details | Form fields | Submit (toast only) |

---

## 4. Authentication Flow

```
                  ┌───────────────────────────────┐
                  │            /login             │
                  │  [Donor] [Recipient] [Admin]  │
                  │  role tabs prefill demo email │
                  └───────────────┬───────────────┘
                                  │ valid email + 6-char password
                                  ▼
                  ┌───────────────────────────────┐
                  │ 0.6 s simulated delay + toast │
                  └───────────────┬───────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        ▼                         ▼                         ▼
 /donor/dashboard        /recipient/dashboard        /admin/dashboard

                  ┌───────────────────────────────┐
                  │           /register           │
                  │ Donor | Recipient             │
                  │ Individual | Organization     │
                  │ documents (recipient required)│
                  └───────────────┬───────────────┘
                                  │ submit
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
        Donor: success screen + toast   Recipient: "pending approval"
        "account ready"                 screen + toast
                    │                           │
                    └──────────▶ /login ◀───────┘
```

Demo credentials (role tab auto-fills):

| Role | Email | Password |
| ---- | ----- | -------- |
| Donor | `nusrat@greenharvest.org` | `demo1234` |
| Recipient | `imran@hopekitchen.org` | `demo1234` |
| Admin | `admin@smartfoodexchange.org` | `demo1234` |

> Registration does not create a real account or persist anything. Approval is
> simulated.

---

## 5. Workspace Navigation Maps

### 5.1 Donor workspace

```
Sidebar / Desktop                              Mobile bottom bar
┌───────────────────────────┐                  ┌───────────────────────────┐
│ Dashboard                 │                  │ Home  Add  Mine  Inbox  Me│
│ Add Donation              │                  │  │     │     │     │      │
│ My Donations              │                  │  ▼     ▼     ▼     ▼      ▼│
│ Reservations              │                  │ /dashboard /add /donations│
│ History                   │                  │ /notifications /profile   │
│ Notifications             │                  └───────────────────────────┘
│ Profile                   │
└───────────────────────────┘
  Topbar: page title · search pages · language · bell · profile menu
```

| Nav item | Route | Screen highlights |
| -------- | ----- | ----------------- |
| Dashboard | `/donor/dashboard` | Active donations, pending review, collected kg, meals; 6-month area chart; category donut; recent donations; upcoming reservations; quick actions; notifications |
| Add Donation | `/donor/add-donation` | Food details, preparation/safety, allergens, photo drop, pickup details, live preview, readiness checklist, submit |
| My Donations | `/donor/donations` | Search/filter/sort table, status badges, pagination, row → detail |
| Donation Detail | `/donor/donations/[id]` | Summary, safety review, pickup, linked reservations, quantity summary, timeline, edit modal, cancel confirm |
| Reservations | `/donor/reservations` | Tabs by status, stat cards, detail modal, confirm collected quantity, decline confirm |
| History | `/donor/history` | Outcomes breakdown, filterable closed records, export toast, impact summary |
| Notifications | `/donor/notifications` | Shared `NotificationCenter` for donor audience |
| Profile | `/donor/profile` | Organization details, verification documents, notification preferences, language, security, sessions, deactivate |

### 5.2 Recipient workspace

```
Sidebar / Desktop                              Mobile bottom bar
┌───────────────────────────┐                  ┌───────────────────────────┐
│ Dashboard                 │                  │ Home Browse Holds Inbox Me│
│ Available Food            │                  │  │     │     │     │    │ │
│ Reservations              │                  │  ▼     ▼     ▼     ▼    ▼ │
│ Collections               │                  │ /dashboard /available-food│
│ History                   │                  │ /reservations /notifications│
│ Notifications             │                  │ /profile                  │
│ Profile                   │                  └───────────────────────────┘
└───────────────────────────┘
```

| Nav item | Route | Screen highlights |
| -------- | ----- | ----------------- |
| Dashboard | `/recipient/dashboard` | Available count, pending holds, active reservations, received kg; recommended food grid; upcoming collections; category donut and goal; quick actions; notifications |
| Available Food | `/recipient/available-food` | Stat cards, search/category/expiry filters, sort, food card grid, pagination, reserve modal |
| Food Detail | `/recipient/food/[id]` | Food summary, safety/verification, pickup location, donor, reserve form, collection guidance, other food |
| Reservations | `/recipient/reservations` | Tabs, stat cards, confirm/decline/cancel actions, detail modal, confirmation rules |
| Collections | `/recipient/collections` | Upcoming / in progress / completed tabs, confirm collected quantity, report issue modal, leave feedback modal |
| History | `/recipient/history` | Outcomes breakdown, filterable records, export toast, impact summary |
| Notifications | `/recipient/notifications` | Shared `NotificationCenter` for recipient audience |
| Profile | `/recipient/profile` | Organization details, documents, eligibility/approval status, preferences, language, security, sessions, deactivate |

### 5.3 Admin workspace

```
Sidebar / Desktop                                    Mobile bottom bar
┌───────────────────────────┐                        ┌─────────────────────────┐
│ Dashboard                 │                        │ Dash Approvals Reviews  │
│ Manage Users              │                        │ Donations Settings      │
│ Account Approvals         │                        └─────────────────────────┘
│ Food Reviews              │
│ Donations                 │
│ Reservations              │
│ Reports                   │
│ Settings                  │
└───────────────────────────┘
```

| Nav item | Route | Screen highlights |
| -------- | ----- | ----------------- |
| Dashboard | `/admin/dashboard` | Users/donations/pending/completed KPIs; 6-month vs weekly chart; category donut; recent donations; recent registrations; quick actions; activity feed |
| Manage Users | `/admin/users` | Filters, table, view profile modal, edit modal, activate/deactivate confirm |
| Account Approvals | `/admin/approvals` | Application queue, filters, detail modal with documents, approve/reject confirm |
| Food Reviews | `/admin/food-reviews` | Queue tabs (pending etc.), filters, detail modal, request information modal, approve/reject confirm |
| Donations | `/admin/donations` | Search/filter table, detail modal, edit modal (quantity/category/status/pickup) |
| Reservations | `/admin/reservations` | Status filter table, detail modal, tracking modal with timeline |
| Reports | `/admin/reports` | Range/format controls, trends, redistribution, categories, status, recipient activity, matching metrics, summary, export modal |
| Settings | `/admin/settings` | General, language, food categories, safety rules, matching, notifications, permissions, administrator access; save toasts |

---

## 6. User Journeys

### 6.1 Donor journey: share surplus food

```
Open app
  │
  ├──▶ /login (Donor tab) ──▶ /donor/dashboard
  │                                │
  │                                ▼
  │                        (Add donation)
  │                                │
  │                                ▼
  │                       /donor/add-donation
  │        fill food details ─▶ preparation & safety ─▶
  │        allergens/photos ─▶ pickup ─▶ preview ─▶ submit
  │                                │
  │                                ▼
  │                    addDonation(input)
  │                                │
  │            ┌───────────────────┴───────────────────┐
  │            ▼                                       ▼
  │   missing allergens or                     details complete
  │   cold-chain temperature                          │
  │            │                                       │
  │            ▼                                       ▼
  │   status: pending-review                  status: available
  │   verification: needs-review              verification: verified
  │   qty available: 0                         qty available: full
  │            │                                       │
  │            └───────────┬───────────────────────────┘
  │                        ▼
  │                 notifications + activity
  │                        │
  │                        ▼
  │               /donor/donations/[id]
  │                (view review status / timeline)
  │                        │
  │                        ├──▶ Admin approves/rejects in /admin/food-reviews
  │                        ▼
  │               Recipients reserve ──▶ /donor/reservations
  │                        │
  │                        ▼
  │          confirm reservation ──▶ coordinate transport
  │                        │
  │                        ▼
  │        confirm collected quantity ──▶ donation completed
  │                        │
  │                        ▼
  │                 /donor/history (impact)
```

### 6.2 Recipient journey: find and collect food

```
/donor? no — recipient signs in
  │
  ▼
/login (Recipient tab) ──▶ /recipient/dashboard
  │                              │
  │                              ├──▶ Recommended food card
  │                              │         │
  │                              ▼         ▼
  │                    /recipient/available-food ──▶ /recipient/food/[id]
  │                              │                         │
  │                              │                         ▼
  │                              │                 (Reserve food modal)
  │                              │                         │
  │                              │                 reserveFood(id, qty)
  │                              │                         │
  │                              │             qty moves available → reserved
  │                              │             reservation: provisional
  │                              │                         │
  │                              ▼                         ▼
  │                    /recipient/reservations ◀──── notification
  │                              │
  │                    confirm ──▶ status: confirmed
  │                    decline ──▶ status: declined (qty released)
  │                              │
  │                              ▼
  │                    /recipient/collections
  │                              │
  │                    start ──▶ status: in-progress
  │                              │
  │                    confirm collected qty ──▶ status: completed
  │                              │
  │                              ├──▶ /recipient/history (impact)
  │                              └──▶ (report issue / leave feedback)
```

### 6.3 Admin journey: moderate the platform

```
/login (Administrator tab) ──▶ /admin/dashboard
        │
        ├──▶ /admin/approvals ──▶ view application ──▶ approve/reject
        │
        ├──▶ /admin/food-reviews ──▶ inspect flags ──▶ request info
        │                                      └──▶ approve (available)
        │                                      └──▶ reject (qty 0)
        │
        ├──▶ /admin/users ──▶ view/edit ──▶ activate/deactivate
        │
        ├──▶ /admin/donations ──▶ view/edit quantity, status, pickup
        │
        ├──▶ /admin/reservations ──▶ inspect / track timeline
        │
        ├──▶ /admin/reports ──▶ choose range/format ──▶ export
        │
        └──▶ /admin/settings ──▶ adjust rules ──▶ save (toast)
```

---

## 7. Page-to-Page Link Map

```
PublicHeader ──▶ / · /about · /how-it-works · /contact · /login · /register
PublicFooter ──▶ / · /about · /how-it-works · /contact · /login · /register
Landing hero ──▶ /register?role=donor · /register?role=recipient
Landing categories ──▶ /register
Login role tabs ──▶ prefill + push /{role}/dashboard
Login "Create account" ──▶ /register
Login "Forgot password" ──▶ toast (no page)
Register success ──▶ /login

Sidebar logo ──▶ /
Sidebar Logout ──▶ /
Topbar bell ──▶ /{role}/notifications
Topbar profile menu ──▶ /{role}/profile · /{role}/settings
Topbar role switcher ──▶ /admin/dashboard · /donor/dashboard · /recipient/dashboard
Topbar "Log out" ──▶ /login
Topbar search results ──▶ any nav destination (admin + donor + recipient)

Donor dashboard ──▶ /donor/add-donation · /donor/donations · /donor/reservations
                    · /donor/history · /donor/notifications
Donor donations row ──▶ /donor/donations/[id]
Donor notifications ──▶ /donor/profile (preferences)
Recipient dashboard ──▶ /recipient/available-food · /recipient/reservations
                    · /recipient/collections · /recipient/history
                    · /recipient/food/[id] (recommended cards)
Recipient available food ──▶ /recipient/food/[id]
Recipient food detail ──▶ /recipient/available-food (back) · reserve modal
Recipient notifications ──▶ /recipient/profile
Admin dashboard ──▶ /admin/approvals · /admin/food-reviews · /admin/reports
                 · /admin/donations · /admin/users
Admin quick actions ──▶ same destinations as above
Admin settings ──▶ no navigation (local toggles + toasts)
```

---

## 8. Component Hierarchy

### 8.1 Public pages

```
RootLayout (AppProvider, Toaster, fonts, metadata)
└── PublicLayout
    ├── PublicHeader
    │   ├── Brand
    │   ├── Nav links
    │   └── LanguageToggle · Auth actions
    ├── <main> Page
    │   ├── Hero / sections
    │   ├── FoodCard grid
    │   └── ProcessTimeline · ReservationStepper
    └── PublicFooter
```

### 8.2 Authentication pages

```
RootLayout
└── AuthLayout
    ├── Brand header + Back to home
    └── Page
        ├── LoginPage
        │   ├── Role tabs
        │   ├── Field + Input (email/password)
        │   └── Button
        └── RegisterPage
            ├── RoleSwitch (donor/recipient)
            ├── Field groups (identity, contact, security)
            ├── Document upload
            └── Success state
```

### 8.3 Dashboard pages

```
RootLayout
└── {Role}Layout
    └── DashboardShell
        ├── Sidebar (desktop + mobile drawer)
        │   ├── Brand
        │   ├── Role badge
        │   ├── Nav links
        │   └── Logout / Collapse
        ├── Topbar
        │   ├── Mobile menu trigger
        │   ├── Page title
        │   ├── Search modal
        │   ├── Language toggle
        │   ├── Notifications bell
        │   └── Profile menu
        │       ├── Profile / Settings
        │       ├── Demo role switcher
        │       └── Log out
        ├── <main>
        │   ├── PageHeader (title, description, actions)
        │   ├── StatCard grid
        │   ├── SectionCard blocks
        │   │   ├── TableWrap / lists / FoodCard
        │   │   ├── Charts (Area/Bar/Donut/Progress)
        │   │   ├── Tabs · SearchField · Select · Pagination
        │   │   └── StatusBadge
        │   ├── Modal / ConfirmDialog
        │   └── EmptyState
        └── MobileBottomNav
```

---

## 9. Entity Relationship Map

```
                    ┌──────────────────────────┐
                    │          AppUser         │
                    │ id · role · status       │
                    │ accountType · documents  │
                    └────────────┬─────────────┘
                                 │ referenced by
                                 │ (demo identity)
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
   ┌────────────────────┐                ┌──────────────────────┐
   │      Donation      │                │     Reservation      │
   │ id                 │ 1           n  │ id                   │
   │ donor: DonorInfo   │───────────────▶│ donationId           │
   │ category           │                │ recipientName        │
   │ quantity           │                │ donorName            │
   │ availableQty       │                │ quantity · unit      │
   │ reservedQty        │                │ status               │
   │ collectedQty       │                │ collectedQty         │
   │ status             │                │ timeline[]           │
   │ verification       │                └──────────────────────┘
   │ allergens · flags  │
   │ expiresAt          │
   └─────────┬──────────┘
             │ produces
             ▼
   ┌────────────────────┐        ┌──────────────────────┐
   │    Notification    │        │     ActivityItem     │
   │ audience (role)    │        │ kind · title          │
   │ type · read        │        │ message · time        │
   └────────────────────┘        └──────────────────────┘
```

Notes:

- `Donation.donor` is an embedded `DonorInfo` snapshot, not a foreign key.
- `Reservation.recipientName` is a display string matched against
  `currentRecipient.organization` for filtering.
- `Notification` and `ActivityItem` are flat records, created by context actions.

---

## 10. State Machine Maps

### 10.1 Donation status

```
                         submit with complete safety data
                 ┌────────────────────────────────────────┐
                 │                                        ▼
   (new) ────────┤                                    ┌───────────┐
                 │                                    │ available │
                 │                                    └─────┬─────┘
                 │                                          │ reserve all remaining qty
                 │                                          ▼
                 │                                    ┌───────────┐
                 │                                    │ reserved  │
                 │                                          │ all reserved qty collected
                 │                                          ▼
                 │                                    ┌───────────┐
                 └── submit with missing data ──────▶│ completed │
                        │                            └───────────┘
                        ▼
                 ┌────────────────┐   admin approve  ┌───────────┐
                 │ pending-review │─────────────────▶│ available │
                 └───────┬────────┘                  └───────────┘
                         │ admin reject
                         ▼
                 ┌──────────┐
                 │ rejected │
                 └──────────┘

 Other terminal states reachable from admin/donor actions: expired, cancelled.
```

### 10.2 Reservation status

```
             reserveFood()
                  │
                  ▼
           ┌──────────────┐
           │ provisional  │
           └──────┬───────┘
                  │
       ┌──────────┼───────────┬───────────────┐
       │          │           │               │
       ▼          ▼           ▼               ▼
   confirm     decline     cancel          expire
       │          │           │               │
       ▼          ▼           ▼               ▼
 ┌───────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
 │ confirmed │ │declined│ │cancelled │ │ expired  │
 └─────┬─────┘ └────────┘ └──────────┘ └──────────┘
       │              (all three release quantity back to available)
       │ start collection
       ▼
 ┌─────────────┐
 │ in-progress │
 └──────┬──────┘
        │ confirm collected qty
        ▼
 ┌───────────┐
 │ completed │
 └───────────┘
```

### 10.3 Account status

```
pending ──approve──▶ active ──deactivate──▶ inactive
   │                    ▲                      │
   │ reject             └──────activate────────┘
   ▼
rejected

under-review is available for eligibility/document follow-up.
```

---

## 11. Data Mutation Map

Where each context action is triggered:

| Action | Trigger screens |
| ------ | --------------- |
| `addDonation` | `/donor/add-donation` submit |
| `updateDonationStatus` | `/admin/food-reviews` approve/reject |
| `updateDonation` | `/admin/donations` edit modal; `/donor/donations/[id]` edit modal |
| `reserveFood` | `/recipient/available-food` reserve modal; `/recipient/food/[id]` reserve form |
| `updateReservation` | `/donor/reservations` confirm/decline/complete; `/recipient/reservations` confirm/decline/cancel; `/recipient/collections` start/complete |
| `markNotificationRead` | Notification center rows; dashboards (links only) |
| `markAllNotificationsRead` | `/donor/notifications`, `/recipient/notifications` |
| `updateUserStatus` | `/admin/approvals`, `/admin/users` |
| `updateUser` | `/admin/users` edit modal |
| `notify` | Almost every page (exports, uploads, saves, simulated actions) |
| `setLanguage` / `toggleLanguage` | Public header, topbar, profile language section |

State covered by local component state (not context): filters, search, tabs,
pagination, modals, toggles, settings forms, profile form drafts, file selections.

---

## 12. Visual Design Map

### 12.1 Color semantics

```
Primary green   #245C45  ── brand, primary buttons, active nav, chart lines
Secondary green #3B8062  ── hover states, highlights, focus ring
Light green     #E7F2EB  ── icon tiles, subtle fills, recommendation pills
Page            #F5F7F5  ── app background
Ink             #25332B  ── headings and primary text
Muted           #6B7870  ── secondary text and metadata
Line            #DDE5DF  ── borders and dividers

Status colors
  success  #DDF3E4  (approved, verified, active, completed, confirmed)
  warning  #FFF1CC  (pending, awaiting, provisional, needs review)
  info     #E1EDFC  (reserved, in progress)
  error    #FCE3E1  (rejected, declined)
  neutral  #EEF1EF  (inactive, expired, cancelled, draft)
```

### 12.2 Typography

```
Inter (Latin) + Noto Sans Bengali (বাংলা)
  h1      28px / 700
  h2      22px / 600
  h3      18px / 600
  body    16px / 400 / 1.6
  small   14px / 400
  label   14px / 500
  caption 12px / 400
  btn     14px / 600
```

### 12.3 Layout by breakpoint

```
Mobile (< 640px)                 Tablet (640–1023)             Desktop (≥ 1024)
┌───────────────────┐            ┌───────────────────────┐     ┌──────────┬─────────────────────┐
│ Topbar + hamburger│            │ Topbar                 │     │ Sidebar  │ Topbar              │
│───────────────────│            │───────────────────────│     │ 264px    │─────────────────────│
│ Content (1 col)   │            │ Content (2 col grids)  │     │ (76px    │ Content (2–4 cols)  │
│   stat cards 2-up │            │                       │     │ collapsed)│                    │
│───────────────────│            │───────────────────────│     │          │                    │
│ Bottom nav (5)    │            │ Bottom nav (5)         │     │          │                    │
└───────────────────┘            └───────────────────────┘     └──────────┴─────────────────────┘
```

- Tables scroll horizontally on narrow screens; some admin lists switch to card
  rows on mobile.
- Modals are centered with max widths `sm` (28rem), `md` (32rem), `lg` (42rem).
- Sidebar becomes an off-canvas drawer below `lg`.

### 12.4 Recurring page pattern

```
┌──────────────────────────────────────────────────────────────┐
│ PageHeader                                                   │
│  eyebrow (optional)                                          │
│  H1 title                          [secondary] [primary CTA] │
│  description                                                 │
├──────────────────────────────────────────────────────────────┤
│ StatCard │ StatCard │ StatCard │ StatCard                    │
├──────────────────────────────────────────────────────────────┤
│ SectionCard (chart / table)      │ SectionCard (side panel)  │
├──────────────────────────────────────────────────────────────┤
│ SectionCard (list / quick actions / activity)                │
└──────────────────────────────────────────────────────────────┘
```

### 12.5 Screen inventory summary

| Area | Screens | Dominant UI |
| ---- | ------- | ----------- |
| Public | 4 | Hero, feature sections, food cards, timeline, form |
| Auth | 2 | Split panel, tabs, forms, document upload |
| Donor | 8 | Stat cards, charts, tables, detail views, multi-section form |
| Recipient | 8 | Food grid, filters, reservation modals, collection actions |
| Admin | 8 | Dense tables, review queues, analytics, settings sections |
| Shared | — | Sidebar, topbar, mobile nav, notification center, toasts, modals |

---

## 13. Cross-References

- Implementation and business rules: `tech_arcitechture.md`
- Prioritized remaining work: `todo.md`
- Project overview and setup: `README.md`
