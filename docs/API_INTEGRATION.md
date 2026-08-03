# RentNest API Integration & Component Mapping 🏠

This document maps all 14 backend modules and endpoints defined in the RentNest Backend API repository ([rockychowdhury/rentnest-api](https://github.com/rockychowdhury/rentnest-api)) to their corresponding Next.js frontend Server Actions, services, client components, and dashboard pages in `rentnest`.

---

## 1. Overview & Authentication Architecture

- **Backend API Repository**: [https://github.com/rockychowdhury/rentnest-api](https://github.com/rockychowdhury/rentnest-api)
- **Backend Base URL**: Defined in environment variables (`BACKEND_API_URL`, defaults to `https://rentnestapi.vercel.app/api`).
- **HTTP Client**: Centralized wrapper `fetchApi<T>()` defined in `lib/api.ts`.
- **Authentication**: JWT token-based authorization. Tokens are stored in HTTP-Only cookies (`accessToken`, `refreshToken`) and included automatically via `Authorization: Bearer <token>` headers in Server Actions and Next.js middleware proxy (`proxy.ts`).

---

## 2. Complete Module Endpoint Mappings

### 2.1 User Module (`/api/users`) - [`src/modules/user`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/user)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `POST` | `/users/` | Register new user account | Public | Form submission | `app/(auth)/register/page.tsx` |
| `GET` | `/users/` | Get all platform users | Admin | `adminActions.ts` -> `getAllUsers()` | `app/(dashboard)/admin-dashboard/users/page.tsx` |
| `GET` | `/users/me` | Get current user account details | Authenticated | `service/getMe.ts` -> `getMe()`, `accountActions.ts` -> `getMyAccount()` | User Profile & Account Settings Pages |
| `PATCH` | `/users/me` | Update current user account | Authenticated | `accountActions.ts` -> `updateMyAccount()` | Account Profile Form |
| `DELETE` | `/users/me` | Delete current user account | Authenticated | `accountActions.ts` -> `deleteMyAccount()` | Account Deactivation Modal |
| `POST` | `/users/restore` | Restore deactivated/suspended user account | Admin | `adminActions.ts` -> `adminRestoreUser()` | `app/(dashboard)/admin-dashboard/users/page.tsx` |
| `GET` | `/users/:userId` | Get specific user account details | Admin | `adminActions.ts` -> `adminGetUserById()` | Admin User Detail Modal |
| `PATCH` | `/users/:userId/status` | Update user status (ACTIVE, BANNED, SUSPENDED) | Admin | `adminActions.ts` -> `updateUserStatus()` | `app/(dashboard)/admin-dashboard/users/page.tsx` |

### 2.2 Auth Module (`/api/auth`) - [`src/modules/auth`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/auth)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `POST` | `/auth/login` | Authenticate user & issue JWT | Public | Login action | `app/(auth)/login/page.tsx` |
| `POST` | `/auth/refresh` | Refresh access token | Public | `service/refreshToken.ts` -> `refreshToken()` | Next.js Middleware (`proxy.ts`) |
| `POST` | `/auth/logout` | Revoke session & clear cookies | Public | `service/logout.ts` -> `logout()` | Navbar & Sidebar Logout Buttons |
| `PATCH` | `/auth/change-password` | Update current user password | Authenticated | `accountActions.ts` -> `changePassword()` | Security Settings Form |

### 2.3 Profile Module (`/api/profile`) - [`src/modules/profile`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/profile)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/profile/:userId` | Get public profile details | Public | `accountActions.ts` | Landlord & User Public Profile Modal |
| `PATCH` | `/profile/me` | Update my user profile details | Authenticated | `accountActions.ts` -> `updateMyProfile()`, `tenantProfile.ts` | Profile Settings Form |
| `PATCH` | `/profile/:userId` | Update profile of any user | Admin | `adminActions.ts` -> `adminUpdateUserProfile()` | Admin User Profile Management |

### 2.4 Amenity Module (`/api/amenities`) - [`src/modules/amenity`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/amenity)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/amenities/` | Get all property amenities | Public | `service/getAmenities.ts`, `adminActions.ts` -> `getAmenities()` | Browse Filter Sidebar, Property Creator, Amenities Admin |
| `POST` | `/amenities/` | Create new amenity | Admin | `adminActions.ts` -> `createAmenity()` | `app/(dashboard)/admin-dashboard/amenities/page.tsx` |
| `PATCH` | `/amenities/:amenityId` | Update amenity name | Admin | `adminActions.ts` -> `updateAmenity()` | `app/(dashboard)/admin-dashboard/amenities/page.tsx` |
| `DELETE` | `/amenities/:amenityId` | Remove amenity | Admin | `adminActions.ts` -> `deleteAmenity()` | `app/(dashboard)/admin-dashboard/amenities/page.tsx` |

### 2.5 Category Module (`/api/categories`) - [`src/modules/category`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/category)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/categories/` | Get all property categories | Public | `service/getCategories.ts`, `adminActions.ts` -> `getCategories()` | Home Hero Category Filter, Property Forms, Admin Categories |
| `GET` | `/categories/:categoryId` | Get category details | Public | `adminActions.ts` | Category Filter Selection |
| `POST` | `/categories/` | Create property category | Admin | `adminActions.ts` -> `createCategory()` | `app/(dashboard)/admin-dashboard/categories/page.tsx` |
| `PATCH` | `/categories/:categoryId` | Update category name | Admin | `adminActions.ts` -> `updateCategory()` | `app/(dashboard)/admin-dashboard/categories/page.tsx` |
| `DELETE` | `/categories/:categoryId` | Delete category | Admin | `adminActions.ts` -> `deleteCategory()` | `app/(dashboard)/admin-dashboard/categories/page.tsx` |

### 2.6 GEO Location Module (`/api/geo`) - [`src/modules/geo`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/geo)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/divisions` | Get all divisions | Public | `addressActions.ts` -> `getDivisions()` | Address Form & Search Location Selectors |
| `GET` | `/divisions/:divisionId/districts` | Get districts in division | Public | `addressActions.ts` -> `getDistrictsByDivision()` | Dynamic Address Cascading Dropdown |
| `GET` | `/districts/:districtId` | Get district by ID | Public | `addressActions.ts` -> `getDistrictById()` | Address Details Display |
| `GET` | `/districts/:districtId/upazilas` | Get upazilas in district | Public | `addressActions.ts` -> `getUpazilasByDistrict()` | Dynamic Address Cascading Dropdown |
| `GET` | `/upazilas/search` | Search upazilas by query string | Public | `addressActions.ts` -> `searchUpazilas()` | Location Search Autocomplete |
| `GET` | `/upazilas/:upazilaId` | Get upazila details | Public | `addressActions.ts` -> `getUpazilaById()` | Property Address Detail Badge |

### 2.7 Property Module (`/api/properties`) - [`src/modules/property`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/property)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/properties` | Get all listings with filters | Public | `service/getProperties.ts` | `app/(public)/properties/page.tsx` |
| `GET` | `/properties/admin/all` | Get all properties unfiltered | Admin | `adminActions.ts` -> `getAllProperties()` | `app/(dashboard)/admin-dashboard/properties/page.tsx` |
| `GET` | `/properties/featured` | Get featured property listings | Public | `service/getFeaturedProperties.ts` | Home Page Featured Carousel (`app/(public)/page.tsx`) |
| `GET` | `/properties/landlord/:landlordId` | Get public properties of a landlord | Public | `propertiesActions.ts` | Public Landlord Profile Page |
| `GET` | `/properties/my-properties` | Get landlord's owned listings | Landlord | `propertiesActions.ts` -> `getLandlordProperties()` | `app/(dashboard)/landlord-dashboard/properties/page.tsx` |
| `GET` | `/properties/:propertyId` | Get detailed property information | Public | `propertiesActions.ts` -> `getPropertyById()` | `app/(public)/properties/[id]/page.tsx` |
| `POST` | `/properties` | Create new property listing | Landlord | `propertiesActions.ts` -> `createProperty()` | Landlord Property Creation Wizard |
| `PATCH` | `/properties/:propertyId` | Edit property details | Landlord / Admin | `propertiesActions.ts` -> `updateProperty()` | Landlord Property Edit Page |
| `PATCH` | `/properties/:propertyId/status` | Update property status (PUBLISHED, INACTIVE, DRAFT) | Landlord / Admin | `adminActions.ts` -> `adminUpdatePropertyStatus()`, `propertiesActions.ts` | Landlord & Admin Properties Table Status Toggle |
| `PATCH` | `/properties/:propertyId/amenities` | Update amenities assigned to property | Landlord / Admin | `propertyAmenitiesActions.ts` -> `updatePropertyAmenities()` | Property Amenity Manager Component |
| `DELETE` | `/properties/:propertyId` | Soft delete property listing | Landlord / Admin | `adminActions.ts` -> `adminDeleteProperty()`, `propertiesActions.ts` | Admin & Landlord Delete Action |
| `POST` | `/properties/:propertyId/restore` | Restore soft-deleted property | Landlord / Admin | `adminActions.ts` -> `adminRestoreProperty()` | `app/(dashboard)/admin-dashboard/properties/page.tsx` |

### 2.8 Property Unit Module (`/api/property-units`) - [`src/modules/propertyUnit`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/propertyUnit)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/property-units/property/:propertyId` | Get units for a property | Public | `unitsActions.ts` -> `getPropertyUnits()` | Property Details Units Grid |
| `GET` | `/property-units/:propertyUnitId` | Get single unit details | Public | `unitsActions.ts` -> `getUnitById()` | `UnitForm.tsx` & Booking Modal |
| `POST` | `/property-units/property/:propertyId` | Add unit to property | Landlord | `unitsActions.ts` -> `createPropertyUnit()` | `UnitForm.tsx` |
| `PATCH` | `/property-units/:propertyUnitId` | Update unit details | Landlord / Admin | `unitsActions.ts` -> `updatePropertyUnit()` | `UnitForm.tsx` |
| `PATCH` | `/property-units/:propertyUnitId/status` | Update unit status (AVAILABLE, RENTED, MAINTENANCE) | Landlord / Admin | `unitsActions.ts` -> `updateUnitStatus()` | `UnitCard.tsx` Status Dropdown |
| `DELETE` | `/property-units/:propertyUnitId` | Remove unit | Landlord / Admin | `unitsActions.ts` -> `deletePropertyUnit()` | `UnitCard.tsx` Delete Action |
| `GET` | `/property-units/:propertyUnitId/availability` | Check unit availability dates | Public | `unitsActions.ts` -> `checkUnitAvailability()` | Tenant Rental Booking Modal |

### 2.9 Property Image Module (`/api/property-images`) - [`src/modules/propertyImage`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/propertyImage)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/property-images/property/:propertyId` | Get images for property | Public | `propertyImagesActions.ts` -> `getPropertyImages()` | Property Image Carousel & Gallery |
| `POST` | `/property-images/property/:propertyId` | Upload property image | Landlord | `propertyImagesActions.ts` -> `uploadPropertyImage()` | Property Image Upload Dropzone |
| `PATCH` | `/property-images/:imageId` | Update image order / metadata | Landlord | `propertyImagesActions.ts` -> `updatePropertyImage()` | Image Manager Component |
| `DELETE` | `/property-images/:imageId` | Delete image | Landlord / Admin | `propertyImagesActions.ts` -> `deletePropertyImage()` | Image Gallery Remove Button |

### 2.10 Pricing Module (`/api/pricing`) - [`src/modules/pricing`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/pricing)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/pricing/unit/:unitId` | Get pricing rules for unit | Public | `pricingActions.ts` -> `getPricingByUnitId()` | Unit Pricing Card |
| `POST` | `/pricing/unit/:unitId` | Set unit rent rate & security deposit | Landlord | `pricingActions.ts` -> `createPricing()` | Unit Pricing Setup Form |
| `PATCH` | `/pricing/:pricingId` | Update pricing configuration | Landlord / Admin | `pricingActions.ts` -> `updatePricing()` | Pricing Edit Dialog |
| `DELETE` | `/pricing/:pricingId` | Remove pricing rule | Landlord / Admin | `pricingActions.ts` -> `deletePricing()` | Pricing Management Component |

### 2.11 Rental Request Module (`/api/rental-requests`) - [`src/modules/rentalRequest`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/rentalRequest)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `POST` | `/rental-requests` | Submit rental application | Tenant | `rentRequestActions.ts` -> `createRentalRequest()`, `tenantApplications.ts` | Property Details "Apply Now" Modal |
| `GET` | `/rental-requests` | Get all platform rental requests | Admin | `adminActions.ts` -> `getAllRequests()` | `app/(dashboard)/admin-dashboard/requests/page.tsx` |
| `GET` | `/rental-requests/my-requests` | Get tenant's submitted applications | Tenant | `tenantApplications.ts` -> `getTenantApplications()` | `app/(dashboard)/tenant-dashboard/applications/page.tsx` |
| `GET` | `/rental-requests/incoming-requests` | Get requests for landlord's properties | Landlord | `rentRequestActions.ts` -> `getIncomingRequests()` | `app/(dashboard)/landlord-dashboard/requests/page.tsx` |
| `GET` | `/rental-requests/:rentalRequestId` | Get single request details | Authenticated | `rentRequestActions.ts` -> `getRequestDetails()` | Rental Request Detail Modal |
| `PATCH` | `/rental-requests/:rentalRequestId/cancel` | Cancel rental request | Tenant / Admin | `tenantApplications.ts` -> `cancelTenantApplication()`, `adminActions.ts` -> `adminCancelRentalRequest()` | Tenant Applications & Admin Requests Tables |
| `PATCH` | `/rental-requests/:rentalRequestId/respond` | Approve or reject rental request | Landlord | `rentRequestActions.ts` -> `respondToRentalRequest()` | `app/(dashboard)/landlord-dashboard/requests/page.tsx` |

### 2.12 Lease Module (`/api/leases`) - [`src/modules/lease`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/lease)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/leases/` | Get all leases platform-wide | Admin | `adminActions.ts` -> `getAllLeases()` | `app/(dashboard)/admin-dashboard/leases/page.tsx` |
| `GET` | `/leases/my-leases` | Get active/past tenant leases | Tenant | `tenantLease.ts` -> `getTenantLeases()` | `app/(dashboard)/tenant-dashboard/lease/page.tsx` |
| `GET` | `/leases/landlord-leases` | Get landlord property leases | Landlord | `leaseActions.ts` -> `getLandlordLeases()` | `app/(dashboard)/landlord-dashboard/leases/page.tsx` |
| `GET` | `/leases/:leaseId` | Get detailed lease agreement | Authenticated | `leaseActions.ts` -> `getLeaseDetails()`, `tenantLease.ts` | Tenant & Landlord Lease Overview Pages |
| `PATCH` | `/leases/:leaseId/status` | Update lease status (ACTIVE, TERMINATED, COMPLETED) | Landlord / Admin | `leaseActions.ts` -> `updateLeaseStatus()`, `adminActions.ts` -> `adminUpdateLeaseStatus()` | Landlord Leases & Admin Leases Tables |
| `GET` | `/leases/:leaseId/payments` | Get payment ledger for a lease | Authenticated | `leaseActions.ts` -> `getLeasePayments()` | Lease Payment History Component |

### 2.13 Review Module (`/api/reviews`) - [`src/modules/review`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/review)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `GET` | `/reviews/property/:propertyId` | Get property reviews & ratings | Public | `tenantReviews.ts`, `reviewActions.ts` | Property Details Review Tab |
| `GET` | `/reviews/admin/all` | Get all reviews across platform | Admin | `adminActions.ts` -> `getAllReviews()` | `app/(dashboard)/admin-dashboard/reviews/page.tsx` |
| `GET` | `/reviews/landlord-reviews` | Get reviews received by landlord | Landlord | `reviewActions.ts` -> `getLandlordReviews()` | `app/(dashboard)/landlord-dashboard/reviews/page.tsx` |
| `GET` | `/reviews/my-reviews` | Get reviews authored by tenant | Tenant | `tenantReviews.ts` -> `getMyReviews()` | `app/(dashboard)/tenant-dashboard/reviews/page.tsx` |
| `POST` | `/reviews` | Write review for completed rental | Tenant | `tenantReviews.ts` -> `createReview()` | `app/(dashboard)/tenant-dashboard/reviews/page.tsx` |
| `PATCH` | `/reviews/:reviewId` | Edit existing review | Tenant | `tenantReviews.ts` -> `updateReview()` | `app/(dashboard)/tenant-dashboard/reviews/page.tsx` |
| `DELETE` | `/reviews/:reviewId` | Delete review | Tenant / Admin | `tenantReviews.ts` -> `deleteReview()`, `adminActions.ts` -> `adminDeleteReview()` | Tenant Reviews & `app/(dashboard)/admin-dashboard/reviews/page.tsx` |
| `PATCH` | `/reviews/:reviewId/respond` | Add landlord response to review | Landlord | `reviewActions.ts` -> `respondToReview()` | `app/(dashboard)/landlord-dashboard/reviews/page.tsx` |

### 2.14 Payment Module (`/api/payments`) - [`src/modules/payment`](https://github.com/rockychowdhury/rentnest-api/tree/main/src/modules/payment)
| Method | Route | Description | Auth Requirement | Frontend Action / Service | UI Component / Page |
|---|---|---|---|---|---|
| `POST` | `/payments/checkout/lease/:leaseId` | Initialize Stripe / SSLCommerz payment session | Tenant | `paymentActions.ts` -> `initiatePayment()`, `tenantPayments.ts` | Tenant Lease Checkout Button |
| `POST` | `/payments/webhook` | Process payment status callbacks | Webhook Secret | Handled by backend endpoint | Stripe & SSLCommerz Webhook Processors |
| `GET` | `/payments/` | Get all platform payment transactions | Admin | `adminActions.ts` -> `getAllPayments()` | `app/(dashboard)/admin-dashboard/payments/page.tsx` |
| `GET` | `/payments/my-payments` | Get tenant payment history | Tenant | `tenantPayments.ts` -> `getTenantPayments()` | `app/(dashboard)/tenant-dashboard/payments/page.tsx` |
| `GET` | `/payments/landlord-payments` | Get landlord payment payout history | Landlord | `paymentActions.ts` -> `getLandlordPayments()` | `app/(dashboard)/landlord-dashboard/payments/page.tsx` |
| `GET` | `/payments/:paymentId` | Get transaction payment receipt | Authenticated | `paymentActions.ts` -> `getPaymentById()` | Payment Receipt Modal |

---

## 3. Admin Dashboard Full Resource CRUD Matrix

| Resource | Create | Read (List & Detail) | Update | Delete / Restore / Status | Page Location |
|---|---|---|---|---|---|
| **Users** | Register API | `getAllUsers`, `adminGetUserById` | `updateUserStatus`, `adminUpdateUserProfile` | `adminRestoreUser`, Status Toggle | `/admin-dashboard/users` |
| **Properties** | Landlord / Admin | `getAllProperties`, `getPropertyById` | `adminUpdatePropertyStatus`, `updateProperty` | `adminDeleteProperty`, `adminRestoreProperty` | `/admin-dashboard/properties` |
| **Requests** | Tenant / Admin | `getAllRequests`, `getRequestDetails` | `respondToRentalRequest` | `adminCancelRentalRequest` | `/admin-dashboard/requests` |
| **Leases** | Generated on Request Approval | `getAllLeases`, `getLeaseDetails` | `adminUpdateLeaseStatus` | Status updates (Terminate, Active, Complete) | `/admin-dashboard/leases` |
| **Payments** | Tenant Checkout | `getAllPayments`, `getPaymentById` | Status filter | Transaction audit | `/admin-dashboard/payments` |
| **Categories** | `createCategory` | `getCategories`, `getCategoryById` | `updateCategory` | `deleteCategory` | `/admin-dashboard/categories` |
| **Amenities** | `createAmenity` | `getAmenities` | `updateAmenity` | `deleteAmenity` | `/admin-dashboard/amenities` |
| **Reviews** | Tenant creation | Property & Landlord Reviews | Landlord response | `adminDeleteReview` | `/admin-dashboard/reviews` |

---

## 4. Verification & Testing

- **TypeScript Compilation**: `npm run build` passes with zero type or build errors.
- **Role Isolation**: Admin actions use Bearer token headers ensuring proper role validation on the backend API.
