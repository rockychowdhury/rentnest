# RentNest — Next.js Project Structure Documentation 🏠

This document details the exact directory layout and architecture of the **RentNest** Next.js App Router codebase (`rentnest`).

---

## Architecture Overview

- **Framework**: Next.js App Router (TypeScript, Tailwind CSS, Shadcn UI).
- **Route Groups**: Organized via `(public)`, `(auth)`, and `(dashboard)` route groups. Route groups isolate layouts without adding URL path prefixes.
- **Role-Based Dashboards**: Explicit, isolated dashboard trees for each user role (`admin-dashboard/`, `landlord-dashboard/`, `tenant-dashboard/`), ensuring zero route collisions and clean separation of concerns.
- **Server Actions & Private Components**: Co-located inside `app/(dashboard)/_actions/` and `app/(dashboard)/_components/`.
- **Middleware Security**: Guarded by `middleware.ts` re-exporting `proxy.ts`, which verifies JWT access/refresh tokens in HTTP-only cookies and enforces strict role-based access control.

---

## Directory Tree Map

```text
rentnest/
├── app/
│   ├── layout.tsx                                # Root HTML/Body layout & Sonner toast provider
│   ├── globals.css                               # Tailwind CSS design system & CSS variables
│   ├── loading.tsx                               # Root loading spinner
│   ├── error.tsx                                 # Root error boundary fallback
│   ├── not-found.tsx                             # Custom 404 page
│   │
│   ├── (auth)/                                   # Authentication Route Group
│   │   ├── layout.tsx                            # Centered authentication shell layout
│   │   ├── login/
│   │   │   └── page.tsx                          # Login page (/login)
│   │   └── register/
│   │       └── page.tsx                          # Register page with role selection (/register)
│   │
│   ├── (public)/                                 # Public Marketing & Property Exploration Group
│   │   ├── layout.tsx                            # Navbar & Footer layout
│   │   ├── page.tsx                              # Landing home page (Hero, Featured, Bento, Stats)
│   │   ├── properties/                           # Property Browse & Search (/properties)
│   │   │   ├── page.tsx                          # Browse grid with filter sidebar & search
│   │   │   └── [id]/
│   │   │       └── page.tsx                      # Detailed property page (/properties/[id])
│   │   ├── about/
│   │   │   └── page.tsx                          # About Us page (/about)
│   │   └── _components/
│   │       └── home/                             # Landing page section components
│   │           ├── HeroSection.tsx
│   │           ├── FeaturedProperties.tsx
│   │           ├── BrowseCategoryBento.tsx
│   │           ├── BuiltForBangladesh.tsx
│   │           ├── HowItWorksTimeline.tsx
│   │           ├── LandlordToolsShowcase.tsx
│   │           ├── StatBand.tsx
│   │           ├── TestimonialsSection.tsx
│   │           └── FinalCtaBand.tsx
│   │
│   ├── (dashboard)/                              # Authenticated Dashboard Group
│   │   ├── layout.tsx                            # Dynamic role-aware dashboard layout shell
│   │   ├── loading.tsx                           # Dashboard loading state
│   │   │
│   │   ├── _actions/                             # Server Actions (Mutations & API Proxies)
│   │   │   ├── accountActions.ts                 # Profile, account update & password change
│   │   │   ├── addressActions.ts                 # Division, district, upazila GEO lookups
│   │   │   ├── adminActions.ts                   # Admin CRUD (Users, Properties, Requests, Leases, Reviews)
│   │   │   ├── leaseActions.ts                   # Landlord & Tenant lease management
│   │   │   ├── paymentActions.ts                 # Stripe/SSLCommerz payment checkout initiation
│   │   │   ├── pricingActions.ts                 # Property unit pricing CRUD
│   │   │   ├── propertiesActions.ts              # Property listing CRUD & status updates
│   │   │   ├── propertyAmenitiesActions.ts       # Property amenity assignments
│   │   │   ├── propertyImagesActions.ts          # Property image upload & deletions
│   │   │   ├── rentRequestActions.ts             # Rental application submission & approval
│   │   │   ├── reviewActions.ts                  # Property review submission & landlord responses
│   │   │   ├── tenantActions.ts                  # Tenant profile & dashboard actions
│   │   │   ├── tenantApplications.ts             # Tenant application tracking & cancellation
│   │   │   ├── tenantFavorites.ts                # Saved property favorites
│   │   │   ├── tenantLease.ts                    # Active lease overview
│   │   │   ├── tenantPayments.ts                 # Payment history queries
│   │   │   ├── tenantProfile.ts                  # Tenant profile updates
│   │   │   ├── tenantReviews.ts                  # Tenant review management
│   │   │   └── unitsActions.ts                   # Property unit management
│   │   │
│   │   ├── _components/                          # Private Dashboard UI Components
│   │   │   ├── account/                          # Account settings client forms
│   │   │   ├── admin/                            # Admin navigation sidebar (AdminSidebar.tsx)
│   │   │   ├── applications/                     # Application timeline cards
│   │   │   ├── landlord/                         # Landlord navigation sidebar (LandlordSidebar.tsx)
│   │   │   ├── properties/                       # Property, Unit, Address & Image management components
│   │   │   │   ├── AddressForm.tsx
│   │   │   │   ├── AmenityToggleGrid.tsx
│   │   │   │   ├── ImageGallery.tsx
│   │   │   │   ├── PricingTable.tsx
│   │   │   │   ├── PropertyFormWizard.tsx
│   │   │   │   ├── PropertyManageCard.tsx
│   │   │   │   ├── UnitCard.tsx
│   │   │   │   ├── UnitForm.tsx
│   │   │   │   └── UnitStatusBadge.tsx
│   │   │   ├── rentals/                          # Active lease overview cards
│   │   │   ├── tenant/                           # Tenant navigation sidebar (TenantSidebar.tsx)
│   │   │   └── MobileDashboardHeader.tsx         # Responsive mobile header drawer
│   │   │
│   │   ├── admin-dashboard/                      # Admin Management Portal (/admin-dashboard)
│   │   │   ├── layout.tsx                        # Admin dashboard shell with AdminSidebar
│   │   │   ├── loading.tsx                       # Admin section loader
│   │   │   ├── page.tsx                          # Overview stats dashboard
│   │   │   ├── account/page.tsx                  # Admin account settings
│   │   │   ├── amenities/page.tsx                # Amenities CRUD manager
│   │   │   ├── categories/page.tsx               # Property Categories CRUD manager
│   │   │   ├── leases/page.tsx                   # Global Leases manager & status controls
│   │   │   ├── payments/page.tsx                 # Global Payment transactions ledger
│   │   │   ├── properties/page.tsx               # Global Properties manager & restore control
│   │   │   ├── requests/page.tsx                 # Global Rental Requests manager
│   │   │   ├── reviews/page.tsx                  # Reviews Moderation manager
│   │   │   └── users/page.tsx                    # User Management (Ban/Unban/Restore)
│   │   │
│   │   ├── landlord-dashboard/                   # Landlord Property Portal (/landlord-dashboard)
│   │   │   ├── layout.tsx                        # Landlord shell with LandlordSidebar
│   │   │   ├── loading.tsx                       # Landlord section loader
│   │   │   ├── page.tsx                          # Landlord overview stats (properties, requests, earnings)
│   │   │   ├── account/page.tsx                  # Landlord profile & account settings
│   │   │   ├── leases/page.tsx                   # Active leases management
│   │   │   ├── payments/page.tsx                 # Landlord payout & earnings history
│   │   │   ├── properties/                       # Listing management
│   │   │   │   ├── page.tsx                      # Property list
│   │   │   │   ├── new/page.tsx                  # Add new property wizard
│   │   │   │   └── [id]/                         # Edit property sub-pages
│   │   │   │       ├── page.tsx                  # Property management overview
│   │   │   │       ├── address/page.tsx          # Address editor
│   │   │   │       ├── amenities/page.tsx        # Amenities selector
│   │   │   │       ├── images/page.tsx           # Image uploader
│   │   │   │       └── units/page.tsx            # Unit & pricing manager
│   │   │   ├── requests/page.tsx                 # Incoming rental requests (Approve/Reject)
│   │   │   └── reviews/page.tsx                  # Tenant reviews & response management
│   │   │
│   │   └── tenant-dashboard/                     # Tenant Rental Portal (/tenant-dashboard)
│   │       ├── layout.tsx                        # Tenant shell with TenantSidebar
│   │       ├── loading.tsx                       # Tenant section loader
│   │       ├── page.tsx                          # Tenant dashboard overview
│   │       ├── account/page.tsx                  # Tenant profile settings
│   │       ├── applications/page.tsx             # My rental applications & Pay Now CTA
│   │       ├── lease/page.tsx                    # Active lease contract details
│   │       ├── payments/page.tsx                 # Payment history ledger
│   │       └── reviews/page.tsx                  # Leave review for properties
│   │
│   ├── maintenance/
│   │   └── page.tsx                              # Maintenance mode fallback (/maintenance)
│   │
│   └── payment/                                  # Stripe/SSLCommerz Checkout Outbound Pages
│       ├── cancel/
│       │   └── page.tsx                          # Payment cancelled notification page (/payment/cancel)
│       └── success/
│           └── page.tsx                          # Payment success receipt page (/payment/success)
│
├── components/                                   # Shared Client UI Components
│   ├── forms/                                    # Form containers (LoginForm.tsx, RegisterForm.tsx)
│   ├── payments/                                 # Payment initiation buttons (CheckoutButton.tsx)
│   ├── properties/                               # Search, filter, and property display components
│   │   ├── DiscoveryMode.tsx
│   │   ├── FavoriteButton.tsx
│   │   ├── PropertiesLoadingSkeleton.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyDetailsGallery.tsx
│   │   ├── PropertyFilterBar.tsx
│   │   ├── PropertyRail.tsx
│   │   ├── RentRequestCard.tsx
│   │   └── SearchResultsMode.tsx
│   ├── shared/                                   # Site-wide reusable components
│   │   ├── navbar.tsx                            # Top navigation header
│   │   ├── footer.tsx                            # Global footer
│   │   ├── logo.tsx                              # RentNest brand logo
│   │   ├── pagination.tsx                        # Shared pagination control
│   │   ├── reusable-modal.tsx                    # Modal dialog wrapper
│   │   └── OptimizedPropertyImage.tsx            # Optimized Next/Image wrapper
│   └── ui/                                       # Shadcn UI Primitives
│       ├── accordion.tsx, alert-dialog.tsx, avatar.tsx, badge.tsx, button.tsx,
│       ├── calendar.tsx, card.tsx, checkbox.tsx, dialog.tsx, dropdown-menu.tsx,
│       ├── input.tsx, label.tsx, popover.tsx, select.tsx, separator.tsx,
│       ├── sheet.tsx, skeleton.tsx, sonner.tsx, switch.tsx, table.tsx, tabs.tsx, textarea.tsx
│
├── service/                                      # Data Services & Direct API Fetchers
│   ├── getAmenities.ts                           # Fetch all property amenities
│   ├── getCategories.ts                          # Fetch all property categories
│   ├── getDiscoveryRails.ts                      # Fetch discovery collections for home
│   ├── getFeaturedProperties.ts                  # Fetch featured property listings
│   ├── getMe.ts                                  # Fetch current authenticated user session
│   ├── getProperties.ts                          # Fetch filtered property listings
│   ├── logout.ts                                 # Clear auth cookies and revoke session
│   └── refreshToken.ts                           # Request new access token from backend
│
├── lib/                                          # Application Core Utilities
│   ├── api.ts                                    # Centralized fetchApi wrapper with error handling
│   ├── utils/                                    # Formatting & helper utilities
│   │   ├── authUtils.ts                          # Session helper utilities
│   │   ├── formatUtils.ts                        # Currency (BDT) and date formatting helpers
│   │   ├── jwt.ts                                # JWT decode/verify helpers
│   │   └── shadcnUtils.ts                        # Classname merging utility (cn)
│   └── validators/                               # Input validation schemas
│       ├── auth.validator.ts                     # Auth form Zod validation schemas
│       └── validateInput.ts                      # Generic validator utility
│
├── hooks/                                        # Custom React Hooks
│   └── use-debounced-value.ts                    # Search input debouncing hook
│
├── types/                                        # TypeScript Type Definitions
│   ├── api.type.ts                               # Standard API response wrappers
│   ├── auth.type.ts                              # Auth payload types
│   ├── dashboard.type.ts                         # Dashboard metrics & layout types
│   ├── property.type.ts                          # Property, Unit, Amenity & Image models
│   ├── user.type.ts                              # User role & profile DTOs
│   └── index.ts                                  # Centralized type exports
│
├── docs/                                         # Project Documentation
│   ├── API_INTEGRATION.md                        # Component-to-Backend API mapping guide
│   ├── api-instructions.md                       # Backend API endpoints documentation
│   ├── client-instructions.md                    # Frontend feature specifications
│   ├── homepage.md                               # Home landing page design spec
│   ├── landlord.md                               # Landlord feature specification
│   ├── project_structure.md                      # This project structure reference
│   ├── properties.md                             # Property module architecture spec
│   ├── propertydata.md                           # Property data modeling & schema spec
│   └── RentNestAPI.postman_collection.json       # Postman API test collection
│
├── public/                                       # Static Assets
│   └── assets/                                   # Images & icons
│
├── middleware.ts                                 # Next.js Route Guard Middleware (re-exports proxy.ts)
├── proxy.ts                                      # JWT auth guard, token refresh, and RBAC redirect rules
├── next.config.ts                                # Next.js compiler & remote image domain configuration
├── postcss.config.mjs                            # PostCSS configuration
├── tsconfig.json                                 # TypeScript compiler configuration
└── package.json                                  # Node dependencies & package scripts
```

---

## Key Design Patterns & Guidelines

1. **Route Group Isolation**: The `(public)`, `(auth)`, and `(dashboard)` directories serve as structural boundary wrappers to isolate layout trees (navigation bars, sidebars, headers) without polluting URL paths.
2. **Explicit Role Dashboards**: Dashboards are cleanly separated into `/admin-dashboard`, `/landlord-dashboard`, and `/tenant-dashboard` to ensure strict RBAC access control via `middleware.ts`.
3. **Server Actions (`_actions/`)**: Asynchronous Next.js Server Actions encapsulate mutation logic, revalidation triggers (`revalidatePath`), and authenticated API calls using `fetchApi` with Bearer headers.
4. **Data Services (`service/`)**: Read-only server-side fetching services provide typed data directly to App Router server components.
5. **Client UI Primitives (`components/ui/`)**: Built using Shadcn UI primitives with Radix UI accessibility standards and Tailwind CSS styling.