# RentNest 🏠 — Frontend Client Application

> **"Find & List Rental Properties with Ease"**

RentNest is a modern, responsive **Next.js 16 (App Router)** rental property marketplace web application. It connects tenants, landlords, and administrators in a seamless, secure ecosystem with role-specific dashboards, advanced property filtering, dynamic application workflows, Stripe/SSLCommerz payments, and platform moderation.

---

## 🔗 Live Links & Repositories

- 🌐 **Live Web Application**: [https://rentnest.vercel.app](https://rentnest.vercel.app)
- ⚙️ **Backend REST API**: [https://rentnestapi.vercel.app/api](https://rentnestapi.vercel.app/api)
- 💻 **Frontend Repository**: [https://github.com/rockychowdhury/rentnest](https://github.com/rockychowdhury/rentnest)
- 🛠️ **Backend Repository**: [https://github.com/rockychowdhury/rentnest-api](https://github.com/rockychowdhury/rentnest-api)

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose & Usage |
|---|---|
| **Next.js 16** | App Router framework with Server Components, Server Actions, and Next.js 16 request proxy (`proxy.ts`). |
| **React 19** | Modern UI rendering library with `useActionState` and `useTransition`. |
| **TypeScript** | Strict type safety for components, API DTOs, and Server Actions. |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens, dark modes, and dynamic animations. |
| **Shadcn UI** | Accessible UI primitives built on Radix UI (Dialogs, Tables, Badges, Cards, Selects, Avatars). |
| **Zod & React Hook Form** | Complete client-side & server-side schema validation for 100% of input forms. |
| **Authentication** | JWT stored in HTTP-Only cookies with automated access token refreshing via `proxy.ts`. |
| **Lucide React & Sonner** | Crisp vector icon set & responsive toast notifications. |

---

## ✨ Key Features & User Workflows

### 🌍 Public Exploration
- **Hero & Discovery Rails**: Hero search band, featured property carousel, Bento category cards, Bangladesh GEO features, and testimonials.
- **Advanced Search & Filtering**: Real-time filtering by location (Division, District, Upazila), property category, price range, and amenity tags.
- **Detailed Property View**: Image galleries, landlord profile cards, unit availability grids, pricing breakdowns, and an interactive "Request to Rent" CTA modal.

### 👤 Tenant Portal (`/tenant-dashboard`)
- **Authentication**: Role selection during registration (`TENANT` / `LANDLORD`) with password strength checks.
- **Rental Application Tracker**: Live status tracking with visual badges (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`).
- **One-Click Payment Checkout**: Approved applications trigger a "Pay Now" CTA leading directly to Stripe / SSLCommerz checkout, with dedicated outcome pages (`/payment/success`, `/payment/cancel`).
- **Lease Overview & Reviews**: View active lease agreements, payment history ledgers, and post-rental property review submission.

### 🏘️ Landlord Portal (`/landlord-dashboard`)
- **Dashboard Overview**: Summary cards tracking total owned listings, active incoming requests, and revenue payouts.
- **Property & Unit Management**:
  - Step-by-step property creation wizard with automatic draft saving.
  - Dedicated sub-managers for address editing, amenity assignments, multi-image upload dropzone, unit configuration (`UnitForm.tsx`), and pricing options (`PricingFormRow.tsx`).
  - Instant property availability toggle (`PUBLISHED` vs `INACTIVE`).
- **Application Management**: Incoming request table with single-click "Approve" and "Reject" actions triggering real-time status updates and toast feedback.

### 🛡️ Admin Moderation Portal (`/admin-dashboard`)
- **Platform Health Stats**: Global count of total platform users, listed properties, pending applications, active leases, and payment transactions.
- **User Management Table**: Filter and search all users with role badges, account status toggles (`ACTIVE`, `BANNED`, `SUSPENDED`), and account restoration (`POST /users/restore`).
- **Resource & Content Moderation**:
  - Global property listing inspector with soft-delete and restore controls.
  - Global rental application cancellation and lease status overrides (`ACTIVE`, `TERMINATED`, `COMPLETED`).
  - Property Categories and Amenities CRUD managers.
  - **Reviews Moderation Dashboard**: Inspect and delete inappropriate tenant property reviews (`DELETE /reviews/:id`).

---

## 📁 Project Structure Map

```text
rentnest/
├── app/
│   ├── (auth)/                                   # Auth routes (/login, /register)
│   ├── (public)/                                 # Public marketing & browse (/properties, /properties/[id], /about)
│   ├── (dashboard)/                              # Authenticated dashboard portals
│   │   ├── _actions/                             # Server Actions (adminActions, propertiesActions, etc.)
│   │   ├── _components/                          # Private dashboard components (sidebars, forms, cards)
│   │   ├── admin-dashboard/                      # Admin moderation portal (/admin-dashboard/*)
│   │   ├── landlord-dashboard/                   # Landlord portal (/landlord-dashboard/*)
│   │   └── tenant-dashboard/                     # Tenant portal (/tenant-dashboard/*)
│   ├── payment/                                  # Checkout status pages (/payment/success, /payment/cancel)
│   └── layout.tsx, loading.tsx, error.tsx        # App Router root layouts & error boundaries
│
├── components/                                   # Shared UI & Feature Components
│   ├── forms/                                    # Auth form containers (LoginForm, RegisterForm)
│   ├── properties/                               # Property cards, filters, and request modals
│   ├── shared/                                   # Site-wide components (Navbar, Footer, Logo, Pagination)
│   └── ui/                                       # Atomic Shadcn UI primitives
│
├── service/                                      # Data fetching services (getProperties, getMe, etc.)
├── lib/                                          # API wrapper (fetchApi), JWT utils, Zod validators
├── types/                                        # Shared TypeScript interfaces & DTOs
├── proxy.ts                                      # Next.js 16 Request Proxy & RBAC Guard
└── docs/                                         # Project documentation files
```

---

## ⚡ Getting Started Locally

### Prerequisites
- **Node.js**: `v20.0.0` or higher
- **Package Manager**: `npm`

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rockychowdhury/rentnest.git
   cd rentnest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   BACKEND_API_URL=https://rentnestapi.vercel.app/api
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📚 Technical Documentation

For detailed technical documentation, refer to the documents inside the [`docs/`](./) folder:
- 📖 [API Integration & Endpoint Mapping](./API_INTEGRATION.md)
- 🏗️ [Project Structure & Architecture](./project_structure.md)
- 📋 [Client Features Specification](./client-instructions.md)
- 🏠 [Homepage Design Specification](./homepage.md)
- 🏘️ [Landlord Portal Specification](./landlord.md)
- 🏢 [Properties Module Specification](./properties.md)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
