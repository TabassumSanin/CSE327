# UI guide

Design tokens and shared components for the Smart Food Exchange front end.
Use this guide before building any inner page so the public site and the
dashboards stay consistent.

## Rules in one place

- Warm, calm, trustworthy. Plain sentences with one real detail.
- No gradients, dotted backgrounds, glass effects, blobs or floating cards.
- No uppercase section labels ("01 · PROCESS", "THE PROBLEM"). Write headings in sentence case.
- Icons from `lucide-react`, used sparingly. No emoji, no icon-in-rounded-square tiles.
- Photos: always use `PhotoPlaceholder` (or a real photo with meaningful `alt`) instead of flat vector art.
- Numbers come from the database, or sit next to "Sample data for demonstration".
- Use **Registered recipients** everywhere. Do not switch to "verified recipients" for the same count.
- Public pages never link to the admin dashboard. Dashboard links belong behind login, per role.
- Every input needs a visible label. Every image needs alt text. Minimum 4.5:1 text contrast.

## Colours

Defined in `tailwind.config.ts` and mirrored as CSS variables in `src/app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `primary` | `#1F5D3A` | Buttons, links, active nav |
| `primary-hover` | `#174A2E` | Hover on primary buttons |
| `accent` | `#C2571A` | One key action per page, or "expiring soon" |
| `accent-hover` | `#A94A14` | Hover on accent buttons |
| `page` | `#FAF7F2` | Page background |
| `card` | `#FFFFFF` | Cards and sheets |
| `line` | `#E6E0D6` | Borders and dividers |
| `ink` | `#1E2A24` | Body and heading text |
| `muted` | `#5B665F` | Secondary text |
| `cream` | `#F3EDE2` | Soft information boxes, photo placeholders |
| `softgreen` | `#E3F2E8` | Safe/available highlights, never large section fills |
| `risk-safe` / `risk-safe-bg` | `#2E7D4F` / `#E3F2E8` | Safe badge |
| `risk-soon` / `risk-soon-bg` | `#9A6414` / `#FBF0D9` | Use soon, amber expiry text |
| `risk-review` / `risk-review-bg` | `#B3382C` / `#FBE4E1` | Risky or needs review |

Compatibility aliases (`secondary`, `lightgreen`, `success`, `warning`, `error`, `info`) resolve to the same palette for older screens. Do not introduce new hex values in page code. Amber expiry text uses `text-risk-soon`.

## Type

| Token | Font | Size |
| --- | --- | --- |
| `font-display` | Fraunces | headings |
| `font-sans` | DM Sans | body and UI |
| `font-bangla` | Hind Siliguri | applied automatically when Bangla is active |
| `text-h1` | Fraunces 600 | 32px |
| `text-h2` | Fraunces 600 | 25px |
| `text-h3` | Fraunces 600 | 19px |
| `text-lead` | DM Sans | 18px |
| `text-body` | DM Sans | 16px |
| `text-small` | DM Sans | 15px |
| `text-label` | DM Sans 500 | 14px |
| `text-caption` | DM Sans | 12.5px |

`globals.css` applies Fraunces to `h1`–`h4` and swaps the whole page to Hind Siliguri when `html` has `.font-bangla`. Test both languages at 390px.

## Layout

- Spacing follows the 8px grid. Standard section padding: `py-12 md:py-16`; hero/feature sections `py-16 md:py-24`.
- Radii: `rounded-lg` = 8px for buttons/inputs, `rounded-xl` = 12px for cards and panels. Nothing larger except `rounded-full` for pills and avatars.
- One shadow only: `shadow-soft`.
- Container: `.container-page` (max 1280px, 20px gutters, 32px at `md`, 40px at `xl`).
- Prefer a split layout, a timeline/list, or one wide feature plus small items. Avoid a row of identical cards for every section.

## Components

### `Button` — `src/components/ui/button.tsx`

```tsx
import { Button } from "@/components/ui/button";

<Button size="lg">Donate food</Button>
<Button variant="secondary">Find food</Button>
<Button variant="accent">List surplus food</Button>
```

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `primary \| secondary \| accent \| outline \| ghost \| danger \| soft \| white` | `primary` | `secondary` and `outline` are the quiet bordered button |
| `size` | `sm \| md \| lg \| icon` | `md` | Heights 36 / 40 / 48px |
| `loading` | `boolean` | `false` | Shows a spinner and disables the button |

`buttonStyles(variant, size, className)` is available for `next/link` elements.

### `Card` — `src/components/ui/card.tsx`

```tsx
import { Card } from "@/components/ui/card";

<Card padding="md" interactive>
  <h3 className="font-display text-h3">Wedding surplus</h3>
  <p className="mt-1 text-small text-muted">45 kg, Uttara, collect by 11 PM.</p>
</Card>
```

| Prop | Type | Default |
| --- | --- | --- |
| `padding` | `none \| sm \| md \| lg` | `md` |
| `interactive` | `boolean` | `false` |
| `as` | `div \| article \| li \| section` | `div` |

`CardDivider` renders a 1px `line` divider.

### `Badge` and `StatusBadge` — `src/components/ui/badge.tsx`

```tsx
<Badge tone="green">Available</Badge>
<StatusBadge status="confirmed" />
```

`Badge` tones: `neutral`, `green`, `safe`, `soon`, `review`, `outline`.
`StatusBadge` keeps the existing status vocabulary (`available`, `reserved`, `pending`, `needs-review`, `confirmed`, …) and now maps it to the palette above. Pass `showDot={false}` for a quieter pill.

### `RiskBadge` — `src/components/ui/risk-badge.tsx`

The food-safety signal. Always pass a one-line reason in the page language.

```tsx
<RiskBadge level="safe" reason="Cooked at 8:00 AM and held above 60°C." />
<RiskBadge level="soon" reason="Ripe fruit from Savar; collect before 8 November." />
<RiskBadge level="review" reason="Two hours of cold-chain log are missing." />
```

| Prop | Type | Notes |
| --- | --- | --- |
| `level` | `safe \| soon \| review` | Maps to the three risk colours |
| `reason` | `string` | Required in practice; one concrete sentence |
| `label` | `string` | Optional translation of Safe / Use soon / Needs review |

### `PageHeader` — `src/components/ui/page-header.tsx`

Compact title plus one sentence. No gradient band, no uppercase eyebrow.

```tsx
<PageHeader
  title="Available food"
  description="Six donations are open near Mirpur this afternoon."
  actions={<Button variant="secondary">Filters</Button>}
/>
```

`description` is optional, `actions` sits on the right at `sm` and above, and `eyebrow` (optional) renders as a muted sentence-case line.

### `Section` and `SectionHeading` — `src/components/ui/section.tsx`

```tsx
<Section tone="cream" spacing="md">
  <SectionHeading
    title="What comes through the exchange"
    description="Counts below are sample data for demonstration."
    actions={<Button variant="secondary">See all food</Button>}
  />
</Section>
```

`Section` props: `tone` (`page`, `white`, `cream`), `spacing` (`sm`, `md`, `lg`), `id`, `className`, `containerClassName`.
`SectionHeading` props: `title`, `description`, `actions`, `headingLevel` (`2` or `3`).

### `PhotoPlaceholder` — `src/components/ui/photo-placeholder.tsx`

```tsx
<PhotoPlaceholder
  alt="Trays of vegetable curry in the Green Harvest Kitchen, Gulshan 2"
  label="Vegetable curry in steel trays"
  caption="Green Harvest Kitchen, Gulshan 2 · packed at 8:00 AM"
  aspect="card"
  framed={false}
/>
```

| Prop | Type | Default |
| --- | --- | --- |
| `alt` | `string` (required) | — |
| `label` | `string` | — |
| `caption` | `string` | — |
| `src` | `string` | — (renders the placeholder) |
| `aspect` | `wide \| card \| square \| portrait \| none` | `card` |
| `framed` | `boolean` | `true` |
| `sizes`, `priority` | Next Image props | — |

When a real photo is ready, pass `src`; the layout and alt text stay the same.

### `FoodCard` — `src/components/ui/food-card.tsx`

```tsx
<FoodCard
  donation={donation}
  href={`/recipient/food/${donation.id}`}
  risk={{ level: "soon", reason: "Ripe fruit from Savar; collect before 8 November." }}
/>
```

Existing props (`donation`, `href`, `action`) are unchanged. The card now uses a photo placeholder, hides the redundant "Verified" chip, and shows "Needs review" only when verification differs. Pass `risk` from the page so the reason is specific to the item.

## Existing pieces you may reuse

- `src/components/ui/form.tsx`: `Field`, `Input`, `Textarea`, `Select` (labels are required).
- `src/components/ui/stat-card.tsx`: dashboard stat tiles.
- `src/components/ui/modal.tsx`, `table.tsx`, `tabs.tsx`, `timeline.tsx`, `empty-state.tsx`, `pagination.tsx`, `toaster.tsx`.
- `src/lib/i18n.ts`: shared English/Bangla keys. Do not rename keys; add page-level copy locally when a screen needs new sentences.
