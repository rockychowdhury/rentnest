# RentNest — Next.js Project Folder Structure (no `src/`)

App Router, everything rooted directly at the project root. Route groups `(name)` are used purely for organization — they don't add URL segments.

**One structural call worth flagging up front:** a few paths are genuinely shared between Tenant and Landlord (`/dashboard/applications`, `/dashboard/payments`, `/dashboard/reviews`) — same URL, different meaning depending on who's logged in (tenant's "applications" = submitted requests; landlord's = incoming requests to review). Next.js can't have two folders resolve to the same path, so those are **one route, one `page.tsx`, role-aware** — the page checks the session role and renders the right view (pulling in role-specific components from `features/`). Paths that are role-exclusive (e.g. `properties`, `tenants`, `analytics` for landlord; `favorites`, `rentals` for tenant) get their own dedicated folder, no ambiguity.

```
rentnest-client/
├── app/
│   ├── layout.tsx                        # root layout (html/body, providers)
│   ├── page.tsx                          # /
│   ├── globals.css
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx                     # 404
│   ├── maintenance/
│   │   └── page.tsx                      # /maintenance
│   │
│   ├── (public)/
│   │   ├── layout.tsx                    # public nav + footer
│   │   ├── properties/
│   │   │   ├── page.tsx                  # /properties  (browse & search)
│   │   │   └── [slug]/
│   │   │       └── page.tsx              # /properties/[slug]
│   │   ├── for-landlords/
│   │   │   └── page.tsx
│   │   ├── how-it-works/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── faq/
│   │   │   └── page.tsx
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   └── privacy/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx                    # centered auth shell
│   │   ├── register/
│   │   │   ├── page.tsx                  # /register (role select)
│   │   │   ├── tenant/
│   │   │   │   └── page.tsx
│   │   │   └── landlord/
│   │   │       └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── verify-otp/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── [token]/
│   │   │       └── page.tsx
│   │   └── onboarding/
│   │       └── page.tsx                  # multi-step, tenant/landlord branch inside
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # sidebar/topbar shell, reads session role
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # /dashboard — role-aware overview
│   │   │
│   │   ├── favorites/                    # tenant-only
│   │   │   └── page.tsx
│   │   ├── rentals/                      # tenant-only ("my leases")
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── properties/                   # landlord-only
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       ├── edit/
│   │   │       │   └── page.tsx
│   │   │       └── amenities/
│   │   │           └── page.tsx
│   │   ├── leases/                       # landlord-only ("manage leases")
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── tenants/                      # landlord-only (tenant directory)
│   │   │   └── page.tsx
│   │   ├── analytics/                    # landlord-only
│   │   │   └── page.tsx
│   │   │
│   │   ├── applications/                 # ⚠ role-aware, shared path
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── payments/                     # ⚠ role-aware, shared path
│   │   │   ├── page.tsx
│   │   │   ├── pay/
│   │   │   │   └── [leaseId]/
│   │   │   │       └── page.tsx          # tenant quick-pay flow
│   │   │   └── payouts/
│   │   │       └── page.tsx              # landlord payout flow
│   │   ├── reviews/                      # ⚠ role-aware, shared path
│   │   │   └── page.tsx
│   │   │
│   │   ├── messages/
│   │   │   └── page.tsx                  # shared inbox, both roles
│   │   ├── notifications/
│   │   │   └── page.tsx                  # shared
│   │   ├── profile/
│   │   │   └── page.tsx                  # shared, form fields differ by role
│   │   └── settings/
│   │       └── page.tsx                  # shared
│   │
│   ├── admin/
│   │   ├── layout.tsx                    # admin shell, admin-only guard
│   │   ├── page.tsx                      # /admin overview
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── verifications/
│   │   │   └── page.tsx
│   │   ├── properties/
│   │   │   └── page.tsx
│   │   ├── leases/
│   │   │   └── page.tsx
│   │   ├── payments/
│   │   │   └── page.tsx
│   │   ├── reviews/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── support/
│   │   │   └── page.tsx
│   │   ├── categories/
│   │   │   └── page.tsx
│   │   ├── amenities/
│   │   │   └── page.tsx
│   │   ├── geography/
│   │   │   └── page.tsx
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   ├── cms/
│   │   │   └── page.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── audit-logs/
│   │   │   └── page.tsx
│   │   ├── roles-permissions/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── api/                              # Route Handlers — BFF/proxy only if needed
│       └── webhooks/
│           └── payment/
│               └── route.ts              # payment gateway webhook receiver
│
├── components/
│   ├── ui/                               # button, input, modal, badge, card... (design-system primitives)
│   ├── layout/                           # navbar, footer, dashboard sidebar/topbar, admin shell
│   ├── property/                         # property card, gallery, filter panel, map view
│   ├── forms/                            # multi-step wizard shell, form field wrappers
│   └── charts/                           # analytics chart wrappers
│
├── features/                             # role-specific logic/components, imported into shared pages
│   ├── tenant/
│   │   ├── applications/
│   │   ├── payments/
│   │   └── reviews/
│   ├── landlord/
│   │   ├── applications/
│   │   ├── payments/
│   │   └── reviews/
│   └── admin/
│       └── ...
│
├── lib/
│   ├── api/                              # typed API client, per-domain wrappers
│   ├── auth/                             # session helpers, role checks, getServerSession-style utils
│   ├── validators/                       # zod/yup schemas for forms
│   └── utils/                            # formatting (BDT currency, dates), misc helpers
│
├── hooks/                                # useAuth, useRole, usePagination, etc.
├── types/                                # shared TS types/interfaces (mirrors backend DTOs)
├── constants/                            # BD divisions/districts/upazilas, categories, amenities refs
├── middleware.ts                         # auth + role-based route guarding, redirect rules
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Notes on a few choices

- **`(public)`, `(auth)`, `(dashboard)` are route groups** (parentheses) so each can carry its own `layout.tsx` without changing the URL — `(public)/properties` is still just `/properties`.
- **`admin/` is a real segment, not a group** — admin routes intentionally live under `/admin/...`, separate from `/dashboard/...`, so `middleware.ts` can guard the entire subtree with one rule.
- **`features/`** exists specifically to resolve the role-aware shared-path problem cleanly: `app/(dashboard)/applications/page.tsx` stays thin — it reads the session role and renders `<TenantApplications />` or `<LandlordApplications />` from `features/tenant/applications` or `features/landlord/applications`, instead of stuffing branching logic into the route file itself.
- **`middleware.ts`** is where the route-guard conventions from `06-shared-routes.md` actually get enforced: unauthenticated → `/login?redirect=...`, wrong role → own `/dashboard`, incomplete onboarding → `/onboarding`, non-admin hitting `/admin/*` → redirect out.