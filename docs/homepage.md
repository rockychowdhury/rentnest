# RentNest — Homepage, Navbar & Footer Build Instructions

**For:** Frontend team
**Scope:** `(publicGroup)/page.tsx` (home), the global navbar, and the global footer
**Out of scope:** Colors, fonts, spacing tokens — **use whatever's already defined in `globals.css` / theme config.** Nothing in this doc should introduce a new color or typeface. The goal is that this page looks like it belongs to the same product as `/properties`, `/dashboard`, etc. — not a separate marketing site bolted on.

---

## Ground rules before you start

1. **No two-column image/text repetition.** Every section below has a *different* structural layout — asymmetric grids, staggered/offset cards, banded stat rows, carousels, bento-style tiles. Don't default to "image left, text right" more than once on the page. If a section's spec below reads like it *could* become a plain 2-col split, it shouldn't — follow the described grid instead.
2. **Feature images don't exist yet.** Every section that references a product screenshot uses a **placeholder block** instead. Build a single reusable placeholder component now so swapping in real screenshots later is a one-line change, not a rebuild. Suggested shape:

   ```tsx
   <FeatureImagePlaceholder
     label="Property search results with map view"
     aspect="16/10"           // or "4/3", "1/1", "21/9" — set per section below
   />
   ```

   Rendered as a bordered/dashed container (use existing theme border + muted background tokens — not a new color) with the `label` text centered inside so anyone reviewing the build knows exactly what belongs there. Once a real feature screenshot exists, only the container's children change — the layout grid around it doesn't.
3. **Every section is its own component** under `(publicGroup)/_components/home/` — don't build this as one giant page file. This also means design/content tweaks to one section can't accidentally break another's layout.
4. **Static content lives in the component or a local constants file**, not fetched — except the featured-properties section, which pulls real data via `getFeaturedProperties.ts` (already scoped in the folder structure doc). Build that section to handle an empty/loading state gracefully; a marketing homepage with a broken empty carousel looks worse than no carousel at all.
5. **Accessibility isn't optional on a marketing page just because it's "just the homepage."** Every placeholder and real image needs meaningful `alt` text, every interactive element needs keyboard focus states (should already come from the shared `ui/` components — don't override them), and heading hierarchy (`h1` once, then `h2`s per section, `h3`s inside) needs to be correct for screen readers, not just visually correct.
6. **Use `next/image` for anything that isn't the placeholder component.** Lazy-load below-the-fold sections; the hero section's background/image is the only thing that should be eager/priority-loaded.

---

## Navbar

**Component location:** `components/shared/navbar.tsx` (already exists per current structure — this is a redesign/functionality spec for it, not a new file)

### Structure (left to right)

1. **Logo** → links to `/`
2. **Primary nav links** (visible on desktop, collapse into the mobile drawer below `md`):
   - Browse Properties → `/properties`
   - For Landlords → `/for-landlords`
   - How It Works → `/how-it-works`
   - A "Company" dropdown grouping About / Contact / FAQ, rather than three separate top-level links crowding the bar
3. **Right-side cluster:**
   - Language toggle (Bangla / English) — small, icon or text-based, not a large control
   - **If logged out:** "Log in" (text link) + "List Your Property" (primary button, styled distinctly from Log in — this is the conversion CTA, it should read as the visually "loudest" element in the navbar without needing a new color, just using the existing primary-button treatment already established elsewhere in the app) → `/register/landlord`
   - **If logged in:** avatar/initials dropdown → shows name, role badge (Tenant/Landlord/Admin), links to their `{role}-dashboard`, Settings, and Log out

### Functionality

- **Sticky on scroll**, with a subtle elevation/backdrop change once scrolled past the hero (use existing shadow/border tokens — don't invent a new one) so it stays legible over varying hero backgrounds.
- **Active-link indicator** on the current route.
- **Mobile:** hamburger opens a full-height drawer (not a tiny dropdown) containing all primary links stacked, plus the same logged-in/logged-out CTA cluster at the bottom of the drawer — mobile users shouldn't have to hunt for "List Your Property."
- **Company dropdown** opens on click (not hover-only — hover-only dropdowns are a common mobile/accessibility failure point) and closes on outside click or `Escape`.
- Keep the navbar height consistent across every page in the app — this file only covers content, not whether the navbar itself changes shape on the homepage vs elsewhere. It shouldn't.

---

## Homepage Sections

Build these in order. Each has: a layout instruction, the copy to use, what image placeholder(s) it needs, and functional notes.

### 1. Hero

**Layout:** Full-bleed background (image placeholder, see below), content vertically centered, **not a split layout** — headline, subhead, and search bar stacked centrally, with the search bar as the visually dominant element (it's the primary action of the entire page).

**Image placeholder:** `label="Hero background: wide shot of a Bangladeshi apartment building or rooftop, warm/lived-in feel"`, `aspect="21/9"`, used as a full-bleed background with a scrim/overlay (existing theme's overlay token, not a new one) so text stays legible regardless of the eventual photo.

**Copy:**
- Eyebrow (small label above headline): `Find your next home in Bangladesh`
- Headline (`h1`): `Rent with confidence, list with ease`
- Subhead: `Verified listings across every division, district, and upazila — search by what actually matters to you.`
- Search bar: location cascade (Division → District → Upazila), category select, price range, a prominent "Search" button. On submit, routes to `/properties` with the selections as query params.
- Below the search bar, a single line of quick-filter chips (e.g. "Bachelor Mess," "Family Apartment," "Sublet," "Near me") that also route to `/properties` pre-filtered — these are shortcuts, not a duplicate filter panel.

**Functional notes:** the search bar component here should be the *same* component (or a thin wrapper around it) used in the real `/properties` filter panel — don't fork the logic into a second implementation that'll drift out of sync.

---

### 2. Browse by Category — Bento Grid

**Layout:** An asymmetric bento-style grid — not a uniform row of equal tiles. Mix tile sizes: 2–3 larger tiles for the most common categories (e.g. Family Apartment, Bachelor Mess) and several smaller tiles for the rest, arranged so the grid reads as intentional, not auto-generated. On mobile, this collapses to a horizontal scroll row rather than stacking into a long vertical list.

**Image placeholder:** one per larger tile — `label="[Category name] example photo"`, `aspect="4/3"` for large tiles, `aspect="1/1"` for small tiles. Smaller tiles can use an icon instead of a photo if that reads cleaner at that size — frontend team's call, but be consistent (all small tiles icon-based, or all photo-based, not mixed).

**Copy:** Section heading (`h2`): `Whatever kind of place you're after`. Each tile: category name + a one-line descriptor (e.g. "Bachelor Mess — shared living, simple terms"). Each tile links to `/properties?category=<slug>`.

---

### 3. Built for Bangladesh — Feature Row

**Layout:** A horizontal row of 4 cards (stacks to 2×2 on tablet, single column on mobile) — but styled as an **overlapping/staggered row** (alternate cards slightly offset vertically) rather than a flat aligned grid, to break the "row of identical boxes" pattern already used in section 2.

**Content (icon-led, not image-led — these are trust/localization signals, not features that need a screenshot):**
- Generator backup awareness — "Know before you move in whether backup power is included"
- WASA water supply indicator — "Clear water-source info on every listing"
- Load-shedding context — "Listings note typical outage patterns in the area"
- Four-level location precision — "Search down to the Upazila, not just the city"

**Copy:** Section heading (`h2`): `Details that actually matter here`. This section deliberately has no image placeholders — it's icon + short text, which itself is a layout contrast from the photo-heavy sections around it.

---

### 4. Featured Properties — Carousel

**Layout:** Horizontal scroll-snap carousel with **varied card widths** (not a uniform slider) — a couple of "featured/boosted" cards render wider than standard cards, mimicking a real editorial feed rather than a generic slider.

**Data:** Real data via `getFeaturedProperties.ts`. Handle three states explicitly:
- **Loaded:** cards as described
- **Loading:** skeleton cards matching the varied-width pattern (don't skeleton as uniform boxes if the loaded state isn't uniform)
- **Empty:** don't render an empty carousel — swap the whole section for a lighter-weight "New listings added every day — be the first to see yours" prompt, or simply omit the section

**Image placeholder (only relevant until real data/listings exist):** `label="Property card photo — cover image from listing"`, `aspect="4/3"`.

**Copy:** Section heading (`h2`): `Fresh on RentNest`. Each card: photo, price, category badge, short location line, save/heart icon. "View all" link at the section's end → `/properties?sort=newest`.

---

### 5. How It Works — Offset Vertical Timeline (Tenant + Landlord)

**Layout:** This is the section most tempting to build as "two columns side by side" — don't. Instead: a **single vertical stepped timeline** where steps alternate which side of a center line they sit on (left/right/left/right), with a toggle at the top of the section to switch the entire timeline's content between "I'm looking for a place" (Tenant) and "I want to list a property" (Landlord) rather than showing both simultaneously in two columns.

**Tenant steps:** Search & filter → Apply → Message the landlord → Sign lease → Move in → Pay rent (with Quick Pay) → Leave a review
**Landlord steps:** Create your listing → Get verified → Review applications → Approve & sign lease → Collect rent → Track your portfolio

**Image placeholder:** one per timeline, placed as a single supporting image alongside the *entire* timeline (not per-step) — `label="Tenant dashboard: active lease + quick pay card"` / `label="Landlord dashboard: property list + application queue"`, `aspect="3/4"` (portrait, since it sits alongside a vertical timeline).

**Copy:** Section heading (`h2`): `How RentNest works`. Toggle labels: `For Tenants` / `For Landlords`.

---

### 6. Landlord Tools Showcase — Layered/Overlapping Panel

**Layout:** Not a mirrored feature-list-plus-screenshot split. Instead: one large screenshot placeholder as an anchor, with **2–3 smaller feature callout cards overlapping its edges** (positioned absolutely over the corners/edges of the main image, like a product-demo "pinned annotation" style), each callout naming one specific capability. This is intentionally denser and more "product marketing" feeling than the earlier sections.

**Image placeholders:**
- Anchor: `label="Landlord dashboard overview: occupancy rate, expiring leases, pending applications"`, `aspect="16/10"`
- (No separate placeholders for the callout cards — they're text + icon only, floating over the anchor image)

**Callout content:**
- "See exactly which leases are expiring — 30, 60, 90 days out"
- "Approve or decline applications with one click"
- "Track rent collected vs expected, every month"

**Copy:** Section heading (`h2`): `Run your rental business, not a spreadsheet`. Below the visual: a single CTA — "List your first property" → `/register/landlord`.

---

### 7. Trust & Numbers — Stat Band

**Layout:** A full-width band, visually distinct from the sections above/below (use an existing "muted"/"subtle" background token from the theme, not a new color) — a horizontal row of 3–4 large stat numbers with short labels underneath. On mobile, 2×2 grid rather than stacking to a single column, so it still reads as a "band" rather than a list.

**Content (placeholder numbers — flag clearly that these need real figures before launch):**
- `[X]+ verified listings`
- `[X]+ divisions covered`
- `[X]+ verified landlords`
- `[X]+ happy tenants`

**No image placeholders** — this section is typography/numbers only, another deliberate contrast.

---

### 8. What Tenants & Landlords Say — Staggered Testimonial Cards

**Layout:** Masonry/staggered card layout (varying card heights based on quote length) rather than a uniform testimonial slider — reinforces the "not everything is a carousel" variety across the page.

**Content:** 4–6 short testimonial cards, each: quote, name, role badge (Tenant/Landlord), and a location (division-level, e.g. "Chattogram"). **Since real testimonials don't exist yet either**, use clearly-marked placeholder copy (e.g. `"[Placeholder testimonial — replace with real tenant quote]"`) rather than inventing quotes attributed to fake specific people, so nothing gets mistaken for real content later.

**No image placeholders needed** — small avatar initials/icon per card is enough, consistent with the navbar's logged-in avatar treatment.

---

### 9. Final CTA Band

**Layout:** Full-width band, two large side-by-side CTA panels (this is the one place a side-by-side split is appropriate, since it's genuinely two parallel choices, not an image/text pairing) — "Looking for a place?" panel and "Have a property to list?" panel, each with its own short line and button.

**Copy:**
- Panel 1: `Ready to find your next home?` → button "Browse Properties" → `/properties`
- Panel 2: `Have a place to rent out?` → button "List Your Property" → `/register/landlord`

**No image placeholders** — keep this band clean/typographic as the page's closing beat.

---

## Footer

**Component location:** new `components/shared/footer.tsx`

### Structure

**Top area — 4–5 columns (stacks to accordion-style collapsible groups on mobile, not a flat long scroll):**

1. **Brand column:** Logo, one-line mission statement, social icons (link out, `target="_blank"` with `rel="noopener noreferrer"`)
2. **For Tenants:** Browse Properties, How It Works, Saved Properties (links to `/dashboard/favorites` if logged in, otherwise to `/auth/login?redirect=/dashboard/favorites`), FAQ
3. **For Landlords:** List Your Property, For Landlords (overview page), Landlord FAQ (can anchor into the shared `/faq` page), Pricing/Commission info (if that page exists — otherwise omit rather than link to nothing)
4. **Company:** About, Contact, Blog (only if in scope — don't include if not planned)
5. **Legal:** Terms of Service, Privacy Policy

**Bottom bar (full-width, below the columns, visually separated by a divider):**
- Copyright line: `© [year] RentNest. All rights reserved.` (year should be dynamic, not hardcoded)
- Language toggle (mirrors the navbar's, for users who scroll straight to the footer)
- Payment method trust badges — small logos/icons for the mobile wallets and gateways RentNest supports (bKash, Nagad, Rocket, card networks) — placeholder icons until real assets/agreements are in place, but the row should exist now since it's a real trust signal for a Bangladeshi audience
- (Optional, only if actually planned) app store badges

### Functional notes

- All footer links should be real routes from the route documentation already produced — don't invent footer-only pages.
- The mobile accordion behavior (columns collapse to tap-to-expand groups) should use the same disclosure/accordion component already in `ui/`, not a custom one-off.
- Footer should render identically across every page in the app (public, dashboard, admin) — this spec is footer content/structure, it isn't a homepage-only footer.

---

## Definition of done for this page

- [ ] Every section is its own component under `_components/home/`
- [ ] No section repeats another section's grid/layout pattern
- [ ] Every placeholder image uses the shared `FeatureImagePlaceholder` component with an accurate `label`
- [ ] Zero new color or font values introduced — everything pulled from existing `globals.css`/theme tokens
- [ ] Hero search bar reuses the real `/properties` filter component, not a duplicate
- [ ] Featured Properties section has real loading/empty/loaded states, not just a happy-path build
- [ ] Navbar logged-in vs logged-out states both implemented and tested
- [ ] Footer renders consistently on a non-homepage route to confirm it isn't accidentally homepage-scoped
- [ ] Heading hierarchy passes a quick accessibility check (one `h1`, sensible `h2`/`h3` nesting)
- [ ] All placeholder testimonial/stat content is clearly marked as placeholder, not left looking like shipped real content