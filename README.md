# Smart Food Exchange

A food redistribution platform that connects food donors with verified recipients to reduce food waste. Built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

## Overview

Smart Food Exchange lets restaurants, bakeries, farms, and households donate surplus food, while verified recipients reserve and collect it. The platform covers the full lifecycle: donation listing, automated safety verification, AI-assisted recipient matching, reservation tracking, and collection confirmation. The interface is bilingual (English / Bengali).

> This is a frontend/demo build. All data is seeded from `src/data/mock.ts` and held in a React context; there is no backend or database yet.

## Features

- **Public site** — landing page, about, how it works, and contact pages.
- **Authentication demo** — role selection (donor / recipient / admin) with demo accounts.
- **Donor workspace** — dashboard, add donation, my donations, reservations, history, notifications, profile.
- **Recipient workspace** — dashboard, available food, reservations, collections, history, notifications, profile.
- **Admin workspace** — dashboard, user management, account approvals, food reviews, donations, reservations, reports, settings.
- **Food safety workflow** — verification states and manual review for flagged donations.
- **Reservations** — provisional → awaiting → confirmed → in-progress → completed lifecycle, plus declines, expiry, and cancellation.
- **Split donations** — available, reserved, and collected quantities tracked independently.
- **Bilingual UI** — English and Bengali via `src/lib/i18n.ts`.
- **Reusable UI kit** — buttons, forms, tables, tabs, modals, cards, charts, toasts, pagination, and more.

## Tech Stack

| Category   | Technology                          |
| ---------- | ----------------------------------- |
| Framework  | Next.js 15 (App Router)             |
| Language   | TypeScript 5.7                      |
| UI         | React 19, Tailwind CSS 3.4          |
| Icons      | lucide-react                        |
| Fonts      | Inter, Noto Sans Bengali            |
| Linting    | ESLint via `next lint`              |

## Getting Started

### Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- npm

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm start`     | Run the production server    |
| `npm run lint`  | Run ESLint                   |

### Demo Credentials

Choose a role on the login page; the matching demo account loads automatically.

| Role      | Email                            | Password   |
| --------- | -------------------------------- | ---------- |
| Donor     | `nusrat@greenharvest.org`        | `demo1234` |
| Recipient | `imran@hopekitchen.org`          | `demo1234` |
| Admin     | `admin@smartfoodexchange.org`    | `demo1234` |

## Project Structure

```
src/
├─ app/
│  ├─ (auth)/                 # Login and registration
│  ├─ (public)/               # Landing, about, how-it-works, contact
│  ├─ admin/                  # Admin workspace pages
│  ├─ donor/                  # Donor workspace pages
│  ├─ recipient/              # Recipient workspace pages
│  ├─ layout.tsx              # Root layout, fonts, providers
│  └─ globals.css
├─ components/
│  ├─ how-it-works/           # Process timeline, reservation stepper
│  ├─ layout/                 # Headers, sidebars, shells, footer
│  ├─ notifications/          # Notification center
│  ├─ providers/              # App-wide context (state, i18n, toasts)
│  └─ ui/                     # Reusable UI components
├─ data/
│  └─ mock.ts                 # Seed data for users, donations, reservations
├─ lib/
│  ├─ i18n.ts                 # English/Bengali dictionary
│  ├─ nav.ts                  # Navigation config and food categories
│  └─ utils.ts                # Helpers (e.g. `cn`)
└─ types/
   └─ index.ts                # Domain types (Donation, Reservation, AppUser, ...)
```

## Routes

| Area      | Paths                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Public    | `/`, `/about`, `/how-it-works`, `/contact`                                                                                         |
| Auth      | `/login`, `/register`                                                                                                               |
| Donor     | `/donor/dashboard`, `/donor/add-donation`, `/donor/donations`, `/donor/donations/[id]`, `/donor/reservations`, `/donor/history`, `/donor/notifications`, `/donor/profile` |
| Recipient | `/recipient/dashboard`, `/recipient/available-food`, `/recipient/food/[id]`, `/recipient/reservations`, `/recipient/collections`, `/recipient/history`, `/recipient/notifications`, `/recipient/profile` |
| Admin     | `/admin/dashboard`, `/admin/users`, `/admin/approvals`, `/admin/food-reviews`, `/admin/donations`, `/admin/reservations`, `/admin/reports`, `/admin/settings` |

## Domain Model

Defined in `src/types/index.ts`:

- **Roles** — `admin`, `donor`, `recipient`
- **Donations** — food details, quantities, storage, allergens, pickup info, verification status, and lifecycle status (`available`, `reserved`, `completed`, `pending-review`, `rejected`, `expired`, `cancelled`)
- **Reservations** — provisional, awaiting, confirmed, declined, expired, in-progress, completed, cancelled
- **Users** — account type, status (`active`, `inactive`, `pending`, `rejected`, `under-review`), documents
- **Notifications** and **Activity** — role-scoped feeds

## Notes

- Data is in-memory only; refreshing the page resets changes made during a session.
- Authentication is simulated — any valid email and a 6+ character password signs you in to the selected role.
- The Next.js config allows remote images from `images.unsplash.com`.

## Contributing

This project is developed as coursework for **CSE327** by the group members on the `sanin`, `nasib`, and `shajuti` branches. Create a feature branch, make your changes, run `npm run lint`, and open a pull request.
