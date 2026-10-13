# RentNest Client - Rental Marketplace Frontend

Frontend for RentNest, an end-to-end rental marketplace for tenants and landlords in Bangladesh. Browse by real location hierarchy, request a specific unit, pay on approval, track the lease.

**Live app:** https://rentnest-red.vercel.app/ | **API repo:** [rentnest-api](https://github.com/rockychowdhury/rentnest-api)

## Why this exists

Tenants need relevant results, not endless scrolling. Landlords need a simple way to publish units and clear requests fast. This client keeps both flows in one place with live status at every step.

## What it does (by user)

- Public: hero search, featured listings, filters by Division-District-Area, category, price, and amenities, plus full property view with units and pricing.
- Tenant: request a unit from the listing page, track PENDING to ACTIVE with badges, pay via Stripe on approval, view leases and payment history, leave a review.
- Landlord: property creation wizard with draft saving and image uploads, availability toggle, one-click approve or reject on incoming requests.
- Admin: platform stats, user and listing moderation, lease overrides, review cleanup.

## Tech

Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, React Hook Form, Zod, Server Actions

- App Router with Server Actions for mutations and HTTP-only cookie auth with auto refresh in `proxy.ts`
- Zod validation on client and server for every form
- Optimistic UI on approve/reject and status badge updates without full reloads

## Run locally

```bash
git clone https://github.com/rockychowdhury/rentnest.git
cd rentnest
npm install
cp .env.example .env.local
# set BACKEND_API_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
npm run dev
```

App runs on `http://localhost:3000`. Needs `rentnest-api` running.

## Structure

```
app/
  (public)/        # home, properties, property detail
  (dashboard)/     # tenant, landlord, admin portals
  _actions/        # server actions per domain
  payment/         # success and cancel pages
components/        # properties, forms, shared, ui
service/ lib/ types/  # fetchers, validators, DTOs
```

## Author

Rocky Chowdhury, Backend Developer, Dhaka, Bangladesh
Portfolio: https://rockychowdhury.vercel.app | LinkedIn: https://linkedin.com/in/rockychowdhury1
