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

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.12 (App Router)
- **Library**: React 19.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Validation**: Zod schema validation & React Hook Form
- **Security & RBAC**: JWT HTTP-only Cookies & Next.js 16 Request Proxy (`proxy.ts`)

---

## 📚 Detailed Documentation

Full standard documentation and specifications are located in the [`docs/`](./docs) directory:

- 📑 [Full README & Feature Guide](./docs/README.md)
- 📖 [API Integration & Endpoint Mapping](./docs/API_INTEGRATION.md)
- 🏗️ [Project Structure & Architecture](./docs/project_structure.md)
- 📋 [Client Features Specification](./docs/client-instructions.md)
- 🏠 [Homepage Design Specification](./docs/homepage.md)
- 🏘️ [Landlord Portal Specification](./docs/landlord.md)
- 🏢 [Properties Module Specification](./docs/properties.md)

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/rockychowdhury/rentnest.git
cd rentnest

# 2. Install dependencies
npm install

# 3. Set environment variables in .env.local
# BACKEND_API_URL=https://rentnestapi.vercel.app/api

# 4. Start the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.
