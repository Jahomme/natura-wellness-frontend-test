# Natura Wellness Frontend Test — Mobile-First Analysis & Implementation Plan

## 1. Analysis of `INSTRUCTIONS.md` & Mobile-First Strategy

The starter ([package.json](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/package.json)) uses **Vite 7 + React 19 + TypeScript 5.8 (`strict: true`)** with `Fraunces` (500, 600) and `Inter` (400–700) preloaded in [index.html](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/index.html), and [src/App.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/App.tsx) routing via `?part=a` (default) and `?part=b`.

Because most customers open Natura Wellness on their phones (`375px` wide), **the entire project—global styles, navigation shell, Part A, and Part B—will be authored strictly mobile-first**:
- **Unprefixed Tailwind utilities (`base`)** always style the `375px` mobile phone layout first (single-column flow, `>= 48px` coarse-pointer tap targets, `1rem`/`16px` form controls to prevent iOS Safari auto-zoom, bottom-sheet modal ergonomics, safe-area padding, and `dvh` viewport units).
- **Responsive breakpoint prefixes (`sm:`, `md:`, `lg:`)** progressively enhance spacing, typography, and multi-column grids—culminating in Part B's exact `1200px` two-column desktop layout (`grid-cols-[33.75rem_29.25rem] gap-16`) matching [buy-box.png](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/public/reference/buy-box.png).

### Key Technical Findings from the Codebase & Assets

| Area | Source File(s) | Technical Findings & Implications |
| :--- | :--- | :--- |
| **Mock API Latency** | [mockApi.ts](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/api/mockApi.ts#L19) | `getSubscription()` and `skipNextShipment()` sleep `400ms–2500ms`. Requires `aria-busy` skeleton loading states and in-flight button locking to prevent double-taps on slow mobile networks. |
| **Optimistic Concurrency (`409`)** | [mockApi.ts](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/api/mockApi.ts#L33-L39) | `skipNextShipment({ subscriptionId, expectedUpdatedAt })` mutates `server.updatedAt` ~33% of the time (or 100% with `&conflict=always`) and throws `ApiError(409, ...)`. Recovery requires re-fetching `getSubscription()` so the customer sees fresh details before retrying. |
| **Nullable Fields & Missing Images** | [types.ts](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/api/types.ts#L3-L29), [fixtures.ts](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/api/fixtures.ts#L6-L9) | `NW-MULTI-30` (`Multivitamin, 30 tablets`) has `imageUrl: null`. `nextChargeAt` and `nextChargeTotalCents` are `null` unless `status === "active"`. `pausedUntil` is set only when `paused`; `cancelledAt` only when `cancelled`. |
| **Part B Reference Image (`2x`)** | [buy-box.png](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/public/reference/buy-box.png), [copy.ts](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/part-b/copy.ts) | `2400×1560` (`1200×780` @ `1x`). At `1200px` (`lg:`/`xl:`): `64px` (`4rem`) horizontal padding, `56px` (`3.5rem`) top padding, `540×540px` (`33.75rem`) square image card, `64px` (`4rem`) column gap, and `468px` (`29.25rem`) buy-box column. |

---

## 2. UI/UX & Web Standards Audit (Modern Web Guidance + Mobbin Check)

> [!WARNING]
> **Mobbin MCP Status:** Querying `mobbin_mobbin` returned `"Mobbin MCP requires a paid plan. Upgrade at https://mobbin.com/pricing to continue."` Per Mobbin plugin rules, no external guesses were substituted for Mobbin results. If you upgrade or switch accounts, we can run visual reference pulls directly.

Auditing our initial specification against **Modern Web Guidance** (`forms`, `accessibility`, `responsive-design`, `css-layout`, `respect-os-text-scale`, `branded-select-styling`, `dialog`, `prevent-page-scroll-under-modal-dialog`) surfaced **8 concrete mobile UI/UX upgrades** now baked into the plan:

1. **Prevent iOS Auto-Zoom on `<select>` (`forms`)**: Our initial draft styled Part B's frequency `<select>` at `13.5px` across all viewports, which triggers involuntary page zoom on iOS Safari (`< 16px`). **Updated**: Base mobile styling uses `text-base` (`1rem` / `16px`) and `min-h-11` (`44px`), stepping down to exact `lg:text-[0.84375rem] lg:min-h-0 lg:h-[2.0625rem]` (`13.5px` / `33px`) only on desktop viewports.
2. **Preserve Native Mobile OS Picker (`branded-select-styling`)**: Opting into `appearance: base-select` replaces iOS/Android's native wheel/sheet picker with a web dropdown. **Updated**: Use standard `<select>` with `appearance-none` on the trigger button only, preserving native mobile OS pickers while matching the exact white trigger + chevron in `buy-box.png`.
3. **Coarse-Pointer `48px` Touch Targets (`forms` & `accessibility`)**: Initial quantity stepper buttons (`40×40px`) fell shy of the `48px` mobile tap target recommendation. **Updated**: On mobile (`base`), stepper buttons use `min-w-12 min-h-12` (`3rem` / `48px`) and action buttons use `min-h-12` (`48px`), locking to exact desktop reference dimensions at `lg:`.
4. **OS-Level Text Scaling & `rem` Tokens (`respect-os-text-scale` & `responsive-design`)**: Add `<meta name="text-scale" content="scale" />` to [index.html](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/index.html), convert fixed `px` tokens in `tailwind.config.ts` to `rem` with unitless `line-height`, and use `clamp(2rem, 1.5rem + 2vw, 2.625rem)` for the display title (`32px` on `375px` mobile → exact `42px` on `1200px` desktop).
5. **Semantic `<form>`, `<fieldset>` + `<legend>`, & Explicit `htmlFor`/`id` (`forms` & `accessibility`)**: Wrap Part B's purchase controls in `<form>` with `<button type="submit">` for `"Add to cart"`, group purchase radio cards inside `<fieldset><legend className="sr-only">`, explicitly link `<label htmlFor={id}>` to `<input id={id}>` (required by voice recognition software even when nested), and render focus rings with `outline` + `outline-offset` via `:has(:focus-visible)` so Forced Colors / High Contrast Mode preserves visibility.
6. **Restore Safari List Semantics (`accessibility`)**: Tailwind's CSS reset applies `list-style: none`, causing Safari/iOS VoiceOver to strip list semantics from `<ul>`. **Updated**: Explicitly add `role="list"` to Part A's product `<ul>` and Part B's perks and trust-badge `<ul>` elements.
7. **Live-Region & Modal `inert` Coordination (`accessibility`)**: Never announce `"Loading..."` via `aria-live` (use `aria-busy="true"` + `role="progressbar"` instead), and always `close()` the `<dialog>` **before** mounting `role="status"` (skip confirmation) or `role="alert"` (`409` conflict / API error) banners so updates never fire inside an `inert` `<main>` subtree.
8. **Mobile Bottom-Sheet `<dialog>` + Safe-Area Insets (`dialog`, `prevent-page-scroll-under-modal-dialog`, `css-layout`)**: Anchor Part A's native `<dialog>` skip confirmation at the bottom of `375px` mobile screens (`mt-auto mb-0 w-full rounded-t-2xl pb-[max(1.25rem,env(safe-area-inset-bottom))]`) within easy thumb reach, transitioning to a centered modal (`sm:my-auto sm:max-w-md sm:rounded-2xl`) on tablet/desktop, using `dvh` units and pure-CSS `overscroll-behavior: contain` on `dialog:modal` and `dialog::backdrop`.

---

## 3. Tailwind CSS Configuration & Mobile-First Setup

We will install **Tailwind CSS v3.4** (`tailwindcss@^3.4`, `postcss`, `autoprefixer`) so `tailwind.config.ts` acts as the native, typed design-token source of truth on Vite 7.

### Dependencies to Install
```bash
npm install -D tailwindcss@^3.4 postcss autoprefixer
```

### Proposed `tailwind.config.ts` (Mobile-First, `rem` & `clamp()` Tokens)

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Mobile-first min-width breakpoints (unprefixed utilities target <=375px phones first)
    screens: {
      xs: "23.4375rem", // 375px — primary phone baseline
      sm: "40rem",      // 640px — large phones / small tablets (modal transitions from sheet to centered)
      md: "48rem",      // 768px — tablets
      lg: "64rem",      // 1024px — desktop two-column transition
      xl: "75rem",      // 1200px — exact Part B reference viewport width
    },
    extend: {
      colors: {
        brand: {
          cream: "#FBF8F3",         // Page background
          forest: "#17402F",        // Primary brand green (title, active border, CTA, checkmarks)
          "forest-hover": "#123325",
          "forest-active": "#0E281D",
          sage: "#F3F6F2",          // Selected subscription card fill & active summary tint
          ink: "#1C2420",           // Primary UI text & prices
          slate: "#4A5550",         // Secondary body copy & trust labels
          muted: "#6B7A70",         // Eyebrow, review count, strikethrough price, fine print
          border: "#E7E1D6",        // Image frame border & section divider
          "card-border": "#E1DBCF", // Unselected option card border
          "input-border": "#CFD6D0",// Select & quantity stepper border
          radio: "#8A948E",         // Unselected radio ring
          gold: "#D8A23A",          // 5-star rating fill
          badge: {
            bg: "#F6E7C4",          // "BEST VALUE" & paused badge fill
            text: "#7A5A12",        // "BEST VALUE" & paused badge text
          },
        },
        status: {
          active: {
            bg: "#E6F0EB",
            text: "#17402F",
            border: "#B8D4C5",
          },
          paused: {
            bg: "#FEF6E4",
            text: "#7A5A12",
            border: "#ECCF8B",
          },
          cancelled: {
            bg: "#F1F0EC",
            text: "#4A5550",
            border: "#D8D5CD",
          },
          error: {
            bg: "#FDF2F2",
            text: "#991B1B",
            border: "#F5C2C2",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      fontSize: {
        // Fluid mobile-first display heading: 32px (2rem) at 375px -> exact 42px (2.625rem) at desktop
        "display-fluid": [
          "clamp(2rem, 1.5rem + 2vw, 2.625rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "card-title": [
          "clamp(1.375rem, 1.2rem + 0.75vw, 1.625rem)",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "600" },
        ],
      },
      borderRadius: {
        frame: "1rem",        // 16px — Left product image card & mobile bottom sheet top corners
        option: "0.75rem",    // 12px — Purchase option cards & Part A sections
        control: "0.625rem",  // 10px — Quantity stepper & Add to cart CTA
      },
      maxWidth: {
        buybox: "75rem",      // 1200px
      },
      minHeight: {
        tap: "3rem",          // 48px mobile coarse-pointer tap target
      },
      minWidth: {
        tap: "3rem",          // 48px mobile coarse-pointer tap target
      },
      boxShadow: {
        card: "0 1px 3px rgba(28, 36, 32, 0.04), 0 6px 16px rgba(28, 36, 32, 0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Supporting HTML & CSS Files
- **[index.html](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/index.html)**:
  - Add `<meta name="text-scale" content="scale" />` alongside `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />` (enabling `env(safe-area-inset-bottom)` on mobile notched screens and OS-level text scaling).
- **`postcss.config.js`**: `tailwindcss` + `autoprefixer`.
- **`src/index.css`**:
  - `@tailwind base; @tailwind components; @tailwind utilities;`
  - Base `body` rules (`min-h-dvh bg-brand-cream text-brand-ink font-sans leading-normal antialiased`).
  - High-contrast `:focus-visible` `outline` defaults (`outline: 2px solid #17402F; outline-offset: 2px;`).
  - Progressive-enhancement flex balance helper (`flex-wrap: wrap; flex-wrap: balance;`) for compact pill/trust rows.
  - Mandatory `<dialog>` scroll-chaining prevention (no `body` `overflow: hidden` mutation):
    ```css
    dialog:modal {
      overscroll-behavior: contain;
    }
    dialog::backdrop {
      overflow: hidden;
      overscroll-behavior: contain;
      background: rgba(28, 36, 32, 0.45);
      backdrop-filter: blur(2px);
    }
    ```

---

## 4. Shared Formatting Utilities (`src/utils/format.ts`)

- `formatCents(cents: number): string` — Formats integer cents to `$XX.XX` (`$29.95`, `$25.46`, `$101.87`).
- `formatDate(iso: string): string` — Formats ISO timestamps via `Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" })`.
- `addDaysToIso(iso: string, days: number): string` — Computes the post-skip charge timestamp (`Date.parse(iso) + days * 86_400_000`) so the confirmation sheet shows exact before/after dates.
- `formatRelativeDays(iso: string): string` — Returns concise relative context (`"In 6 days"`, `"Tomorrow"`, `"Today"`).

---

## 5. Part A Mobile-First Plan (`src/part-a/SubscriptionCard.tsx`)

### Mobile-First Layout & Semantic Structure (`375px` Primary Target)
- Wrapped in semantic `<main>` (from `App.tsx`) → `<section aria-labelledby="subscription-heading" className="w-full max-w-lg mx-auto px-4 py-5 sm:px-6 sm:py-8">`.
- Card container uses `@container` (`container-type: inline-size`) so internal summary rows stack cleanly on narrow phones (`320px–375px`) and expand horizontally when wider than `26rem` (`416px`).
- All action buttons (`Skip next shipment`, `Keep shipment`, `Yes, skip shipment`, `Refresh subscription`, `Try again`) enforce `min-h-tap` (`3rem` / `48px`) full-width mobile buttons (`w-full sm:w-auto`).

### Mapping All 6 Customer Service Requirements

| Requirement | Concrete Mobile-First Implementation |
| :--- | :--- |
| **1. At-a-glance next shipment** | Active subscriptions display a high-contrast **"Next shipment"** hero block (`bg-brand-sage border border-brand-forest/20 rounded-option p-4`) with **charge date** (`Nov 7, 2026 · In 6 days`) and **total charge** (`$101.87` in `tabular-nums`, noting `"15% subscriber savings · Every 30 days"`), followed by `<ul role="list">` of items showing `48×48px` (`aspect-square block`) thumbnail, item title (`min-w-0` flex guard), quantity pill (`Qty 2`), discounted line price, and strikethrough original subtotal. |
| **2. Self-serve skip** | Full-width mobile button **"Skip next shipment"** (`min-h-tap`) calls `skipNextShipment({ subscriptionId, expectedUpdatedAt })` and updates card state with the new `+30 days` date. Closes modal first, then renders a `role="status"` (`aria-live="polite"`) confirmation banner showing the updated charge date. |
| **3. Prevent accidental skips** | Clicking **"Skip next shipment"** opens a native `<dialog>` via `showModal()` (`aria-labelledby` pointing to `<h2>`). On `375px` mobile it opens as a **thumb-friendly bottom sheet** (`mt-auto mb-0 w-full rounded-t-frame pb-[max(1.25rem,env(safe-area-inset-bottom))]`, centered `sm:my-auto sm:max-w-md sm:rounded-frame` on larger screens). Shows an explicit **Current charge date → New charge date (`+30 days`)** comparison card. Safe action **"Keep shipment"** has `autofocus`; destructive/mutating action **"Yes, skip shipment"** requires deliberate tap. |
| **4. Distinct `paused` & `cancelled` states (no skip)** | Non-color + color cues on every status:<br>• **Active**: Check-circle icon (`aria-hidden="true"`) + green `Active` pill + upcoming shipment hero + Skip CTA.<br>• **Paused**: Pause-bars icon + amber `Paused` pill + amber status banner (*"Paused until [pausedUntil] — No shipments or charges while paused"*) + dimmed item list + **no skip button**.<br>• **Cancelled**: X-circle icon + stone `Cancelled` pill + muted border + neutral callout (*"Cancelled on [cancelledAt] — You won't be billed again"*) + **no skip button** or next-charge hero. |
| **5. `375px` phone ergonomics & missing images** | Tested down to `320px–375px` with zero horizontal scroll (`min-w-0` on flex children, `tabular-nums` prices). Items with `imageUrl: null` (`Multivitamin, 30 tablets`) render a branded sage square tile (`w-12 h-12 rounded-lg bg-brand-sage border border-brand-border`) with a decorative supplement bottle SVG (`aria-hidden="true"`). |
| **6. Slow API & `409` conflict recovery** | • **Initial fetch (`400–2500ms`)**: Skeleton card with `aria-busy="true"` and `<div role="progressbar" aria-label="Loading subscription details" className="sr-only">` (no noisy `"Loading..."` `aria-live` spam).<br>• **Load error (`?fixture=error`)**: `role="alert"` panel explaining we couldn't load the subscription + `48px` **"Try again"** button.<br>• **In-flight skip**: Spinner on **"Skipping shipment..."**, buttons disabled, `cancel` event prevented while network request is pending.<br>• **`409` Conflict (`&conflict=always` or 33% random)**: Closes `<dialog>` so `<main>` is no longer `inert`, then renders an actionable `role="alert"` warning banner: *"Your subscription was updated elsewhere, so this shipment wasn't skipped."* + **"Refresh subscription"** button that re-fetches `getSubscription()` to sync `updatedAt` and latest details.<br>• **Other skip errors**: Closes `<dialog>` and renders `role="alert"` stating *"Couldn't skip this shipment right now. Your billing date hasn't changed."* + **"Try again"**. |

### Skip & `409` Conflict State Machine

```mermaid
flowchart TD
    Mount["Mount SubscriptionCard"] --> Fetch["getSubscription() (400-2500ms)"]
    Fetch -->|Pending| Skeleton["aria-busy Skeleton + sr-only progressbar"]
    Fetch -->|500 / 404| LoadErr["role='alert' Error Card + 48px 'Try again'"]
    LoadErr -->|Tap Try again| Fetch
    Fetch -->|Success| Status{"subscription.status"}

    Status -->|active| Active["Active View: Next Shipment Hero + role='list' Items + 'Skip next shipment'"]
    Status -->|paused| Paused["Paused View: Icon+Amber Pill + pausedUntil Banner + Items (No Skip)"]
    Status -->|cancelled| Cancelled["Cancelled View: Icon+Stone Pill + cancelledAt Banner + Items (No Skip)"]

    Active -->|Tap 'Skip next shipment'| Sheet["Native <dialog> Bottom Sheet (375px) / Modal (sm:)"]
    Sheet -->|'Keep shipment' (autofocus) / Esc| Active
    Sheet -->|Tap 'Yes, skip shipment'| SkipReq["skipNextShipment({ id, expectedUpdatedAt })"]

    SkipReq -->|200 OK| CloseSuccess["dialog.close() -> Update State -> role='status' Banner"]
    SkipReq -->|409 Conflict| CloseConflict["dialog.close() -> role='alert' Conflict Banner + 'Refresh subscription'"]
    SkipReq -->|Other Error| CloseErr["dialog.close() -> role='alert' Unchanged Schedule + 'Try again'"]
    CloseConflict -->|Tap Refresh| Fetch
```

---

## 6. Part B Mobile-First Plan (`src/part-b/BuyBox.tsx`)

### Mobile (`375px` Base) → Desktop (`1200px` Exact Reference) Progression

| Element | Mobile Base (`375px` Default) | Desktop Reference (`lg:` / `xl:` @ `1200px`) |
| :--- | :--- | :--- |
| **Outer Wrapper** | `w-full max-w-buybox mx-auto px-4 py-6 sm:px-8 sm:py-10` | `lg:px-16 lg:pt-14 lg:pb-20` (`64px` X-pad, `56px` top-pad) |
| **Layout Grid** | `grid grid-cols-1 gap-6 sm:gap-8 items-start` | `xl:grid-cols-[33.75rem_29.25rem] lg:grid-cols-[1.15fr_1fr] lg:gap-16` (`540px` + `64px` + `468px`) |
| **Product Image Frame** | `w-full aspect-square bg-white border border-brand-border rounded-frame flex items-center justify-center p-6` (`<img>` `block w-[82%] h-[82%] object-contain`, `fetchPriority="high"`) | `lg:p-10` (`540×540px` square frame) |
| **Eyebrow & Rating** | `VITAMINS` (`text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted`) + `mt-2.5` 5 SVG stars (`aria-hidden="true"`) + `4.8` + underlined `2,316 reviews` link (`min-h-6 inline-flex items-center`) | `lg:mt-3` exact vertical rhythm |
| **Display Title** | `font-serif text-display-fluid text-brand-forest mt-3` (`32px` on `375px`) | Scales via `clamp()` to exact `2.625rem` (`42px`) + `lg:mt-3.5` |
| **Purchase `<form>` & `<fieldset>`** | `<form>` → `<fieldset className="space-y-3">` with `<legend className="sr-only">Purchase option</legend>`. Selected `"subscribe"` by default. Zero-shift border compensation: unselected `border border-brand-card-border bg-white p-4`, selected `border-2 border-brand-forest bg-brand-sage p-[0.9375rem]`. Explicit `<label htmlFor>` + `<input type="radio" id className="sr-only">` + `has-[:focus-visible]:outline` | `lg:p-5` unselected / `lg:p-[1.1875rem]` (`19px`) selected, `min-h-[3.75rem]` (`60px`) on One-time card |
| **Frequency `<select>`** | `<label htmlFor={freqId}>Delivered every</label>` + native `<select id={freqId} name="frequency">` with **`text-base` (`16px`, prevents iOS zoom!)** and **`min-h-11` (`44px` tap target)**, `bg-white border border-brand-input-border rounded-lg pl-3 pr-8 appearance-none` | `lg:text-[0.84375rem] lg:min-h-0 lg:h-[2.0625rem]` (`13.5px`, `33px` tall) matching screenshot |
| **Perks List** | `<ul role="list" className="mt-3.5 space-y-1.5">` indented `pl-7 sm:pl-8`, `14px` `#17402F` check SVG (`aria-hidden="true"`) | `lg:pl-8 text-[0.84375rem]` (`13.5px`) |
| **Stepper + Submit CTA** | `mt-6 flex items-stretch gap-2.5 sm:gap-3 h-14`: Stepper (`w-[8.25rem] bg-white border border-brand-input-border rounded-control`) with **`min-w-tap min-h-tap` (`48×48px`)** `−`/`+` buttons + `<button type="submit">` (`flex-1 min-w-0 h-14 bg-brand-forest text-white rounded-control font-semibold text-[0.9375rem]`) dynamically showing `Add to cart · $XX.XX` | `lg:w-32 lg:gap-3` (`128px` stepper + `12px` gap + `328px` submit button = `468px`) |
| **Trust Row & Fine Print** | `<ul role="list">` with `flex flex-wrap gap-x-5 gap-y-2` (`flex-balance` progressive enhancement) + `mt-4 text-xs leading-relaxed text-brand-muted` | `lg:gap-x-6` single horizontal row matching `buy-box.png` |

---

## 7. App Shell (`src/App.tsx`) & Planned File Changes

- **[src/App.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/App.tsx)**:
  - Render semantic `<header>` with `<nav aria-label="Test parts">` + `<main>` landmark (`accessibility` §1).
  - Mobile-first thumb-friendly pill links (`min-h-11 inline-flex items-center px-3`) with horizontal scroll / `flex-wrap` on `375px` phones, plus a compact fixture switcher row (`active`, `paused`, `cancelled`, `error`, `conflict=always`) shown only when `part === "a"` so Part B remains completely clean at `1200px`.

| File | Action | Purpose |
| :--- | :--- | :--- |
| `package.json` | Modify | Install `tailwindcss@^3.4`, `postcss`, `autoprefixer`. |
| [index.html](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/index.html) | Modify | Add `viewport-fit=cover` and `<meta name="text-scale" content="scale" />`. |
| `tailwind.config.ts` | Create | Mobile-first breakpoints, brand/status palette, `rem`/`clamp()` typography, `48px` tap tokens. |
| `postcss.config.js` | Create | Configure Tailwind CSS + Autoprefixer. |
| `src/index.css` | Create | Tailwind directives, `min-h-dvh` base, `:focus-visible` outlines, `<dialog>` scroll containment. |
| [src/main.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/main.tsx) | Modify | Import `./index.css`. |
| [src/App.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/App.tsx) | Modify | Accessible `<header>`/`<nav>`/`<main>` landmarks and mobile-friendly Part A fixture switcher. |
| `src/utils/format.ts` | Create | Currency (`formatCents`) and date (`formatDate`, `addDaysToIso`, `formatRelativeDays`) utilities. |
| [src/part-a/SubscriptionCard.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/part-a/SubscriptionCard.tsx) | Modify | Mobile-first subscription card, bottom-sheet `<dialog>` skip confirmation, `409` conflict recovery. |
| [src/part-b/BuyBox.tsx](file:///c:/Users/jadil/OneDrive/Documentos/Currículo/desafios/natura-wellness-frontend-test/src/part-b/BuyBox.tsx) | Modify | Mobile-first product buy box scaling to pixel-accurate `1200px` desktop design. |

---

## 8. Verification Plan

1. **Typecheck & Production Build**: Run `npm run typecheck` and `npm run build`.
2. **Mobile-First Audit (`375×812` Viewport — Both Parts)**:
   - Verify **Part A** (`active`, `paused`, `cancelled`, `error`, `active&conflict=always`) and **Part B** at `375px` width: zero horizontal overflow, `>= 48px` primary tap targets, `16px` `<select>` font size on mobile, bottom-sheet `<dialog>` alignment, keyboard `<Tab>`/`<Esc>` focus return, and `role="list"` / `role="alert"` / `role="status"` semantics.
3. **Desktop Reference Comparison (`1200×780` Viewport — Part B)**:
   - Verify `/?part=b` at `1200px` width side-by-side against `public/reference/buy-box.png`, testing radio option toggling, frequency selection, and quantity stepper math (`Add to cart · $XX.XX`).
