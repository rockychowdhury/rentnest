# RentNest — Manual Test Data (10 Properties, Full Relations)

For manually entering test data through the UI/forms, in this order: **Categories → Amenities → Property (+ Address) → Units → Pricing per unit → Images (optional)**. Categories and Amenities are master data — create the list once, then just select/toggle from it per property, same as the real app will work.

A couple of notes before the data:
- `RentType` enum values weren't included in the schema you shared — I've used `MONTHLY` throughout, since that's overwhelmingly the standard for BD rentals. If your actual enum has different casing/values (e.g. `MONTHLY_RENT`), swap accordingly.
- Latitude/longitude are approximate real-world coordinates for the named area, close enough for map-pin testing — not surveyed exact addresses.
- Division/District/Upazila names are real; building numbers, street details, and landmark names are illustrative, not real addresses of actual buildings.
- Image entries use placeholder image URLs (`picsum.photos`) since no real photos exist yet — swap `url` for real hosted images later, `deleteUrl` can stay blank for placeholder/manual testing.

---

## Step 1 — Categories (create these first, once)

| # | name | description |
|---|---|---|
| 1 | Family Apartment | Full apartment suited for families, typically 2–4 bedrooms |
| 2 | Bachelor Mess | Shared living arrangement, common for students/young professionals |
| 3 | Sublet | A room or portion of an existing tenancy rented out short-term |
| 4 | Rooftop/Garage | Rooftop room or garage-converted space, budget-friendly |
| 5 | Studio Apartment | Compact single-room living unit with attached bath/kitchenette |
| 6 | Shared Room | Single room shared by 2+ unrelated tenants |
| 7 | Furnished Apartment | Fully furnished unit, ready to move in |
| 8 | Duplex House | Two-story independent house or unit |
| 9 | Office Space | Commercial space suited for small office use |
| 10 | Commercial Shop | Ground-floor retail/shop space |

---

## Step 2 — Amenities (create these first, once)

| # | name | description |
|---|---|---|
| 1 | Generator Backup | Power backup during load-shedding |
| 2 | WASA Water Supply | Connected to municipal WASA water line |
| 3 | Lift/Elevator | Building has a working elevator |
| 4 | CCTV Security | CCTV coverage in common areas |
| 5 | Car Parking | Dedicated car parking space |
| 6 | Bike Parking | Dedicated bike/motorcycle parking |
| 7 | Balcony | Unit has an attached balcony |
| 8 | Gas Line | Piped natural gas connection |
| 9 | Air Conditioning | AC installed in at least one room |
| 10 | Rooftop Access | Shared rooftop access for tenants |
| 11 | Security Guard | On-site security guard |
| 12 | Water Reserve Tank | Building has a reserve water tank |
| 13 | Intercom | Intercom/entry system |
| 14 | Attached Bathroom | Unit has its own attached bathroom |
| 15 | Wifi Available | Building/unit wired for broadband |
| 16 | Furnished | Unit comes with furniture |

---

## Property 1 — Gulshan Family Apartment

**Property**
- title: `Spacious 3-Bed Family Apartment in Gulshan`
- description: `A well-maintained 3-bedroom apartment on a quiet residential road in Gulshan, close to schools and diplomatic zone. Ideal for families looking for a long-term stay.`
- category: `Family Apartment`
- status: `PUBLISHED`
- isFeatured: `true`
- totalUnits: `1`

**Address**
- division: `Dhaka`
- district: `Dhaka`
- upazila: `Gulshan` *(if Gulshan isn't seeded as an Upazila in your geography table, substitute `Dhaka Sadar`)*
- buildingNo: `House 14, Road 92`
- streetAddress: `Gulshan Avenue`
- addressLine2: `Near Gulshan Circle 2`
- landmark: `Opposite Gulshan Society Park`
- postalCode: `1212`
- latitude: `23.7925`
- longitude: `90.4078`

**Amenities:** Generator Backup, WASA Water Supply, Lift/Elevator, CCTV Security, Car Parking, Security Guard, Air Conditioning

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Unit 4B | AVAILABLE | 1650 | 3 | 3 | 4 | Corner unit, extra natural light, two balconies |

**Pricing (Unit 4B)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 45000.00 | 90000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/gulshan-living/800/600` | Living room | true |
| `https://picsum.photos/seed/gulshan-bedroom/800/600` | Master bedroom | false |

---

## Property 2 — Mirpur Bachelor Mess

**Property**
- title: `Affordable Bachelor Mess Near Mirpur 10`
- description: `Shared bachelor mess with 4 individual rooms, common kitchen and living space. Walking distance to Mirpur 10 metro station.`
- category: `Bachelor Mess`
- status: `PUBLISHED`
- isFeatured: `false`
- totalUnits: `4`

**Address**
- division: `Dhaka`
- district: `Dhaka`
- upazila: `Mirpur` *(substitute `Dhaka Sadar` if not seeded)*
- buildingNo: `House 7, Block C`
- streetAddress: `Mirpur 10 Road`
- addressLine2: `2nd Lane`
- landmark: `Near Mirpur 10 Metro Station`
- postalCode: `1216`
- latitude: `23.8069`
- longitude: `90.3687`

**Amenities:** WASA Water Supply, Wifi Available, Gas Line, Bike Parking

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Room 1 | AVAILABLE | 120 | 1 | 1 | 2 | Single occupancy room, window facing street |
| Room 2 | OCCUPIED | 120 | 1 | 1 | 2 | Single occupancy room |
| Room 3 | AVAILABLE | 100 | 1 | 1 | 3 | Compact single room |
| Room 4 | MAINTENANCE | 100 | 1 | 1 | 3 | Under minor repair — plumbing |

**Pricing**

| unitLabel | rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|---|
| Room 1 | MONTHLY | 6000.00 | 6000.00 | BDT | true |
| Room 2 | MONTHLY | 6000.00 | 6000.00 | BDT | true |
| Room 3 | MONTHLY | 5500.00 | 5500.00 | BDT | true |
| Room 4 | MONTHLY | 5500.00 | 5500.00 | BDT | false |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/mirpur-mess-hall/800/600` | Common area | true |
| `https://picsum.photos/seed/mirpur-mess-room/800/600` | Sample room | false |

---

## Property 3 — Chattogram Sublet Room

**Property**
- title: `Furnished Sublet Room in GEC Circle`
- description: `Single furnished room available as a sublet within a 3-bedroom apartment, shared with one other tenant. Good for short-term stays.`
- category: `Sublet`
- status: `PUBLISHED`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Chattogram`
- district: `Chattogram`
- upazila: `Panchlaish`
- buildingNo: `Flat 3A, Building 22`
- streetAddress: `GEC Circle Road`
- addressLine2: `` *(leave blank)*
- landmark: `Near GEC Circle`
- postalCode: `4000`
- latitude: `22.3629`
- longitude: `91.8235`

**Amenities:** WASA Water Supply, Wifi Available, Furnished, Attached Bathroom

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Sublet Room | AVAILABLE | 140 | 1 | 1 | 3 | Furnished room with attached bath, shared kitchen access |

**Pricing (Sublet Room)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 8500.00 | 5000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/gec-sublet/800/600` | Room view | true |

---

## Property 4 — Sylhet Rooftop Room

**Property**
- title: `Budget Rooftop Room in Zindabazar`
- description: `Simple rooftop room, ideal for a single occupant on a tight budget. Shared rooftop space and basic amenities.`
- category: `Rooftop/Garage`
- status: `DRAFT`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Sylhet`
- district: `Sylhet`
- upazila: `Sylhet Sadar`
- buildingNo: `House 9`
- streetAddress: `Zindabazar Main Road`
- addressLine2: `Behind Central Mosque`
- landmark: `Near Zindabazar Point`
- postalCode: `3100`
- latitude: `24.8998`
- longitude: `91.8687`

**Amenities:** Rooftop Access, WASA Water Supply

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Rooftop Room | AVAILABLE | 90 | 1 | 1 | 5 | Tin-shed rooftop room, private entrance |

**Pricing (Rooftop Room)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 3500.00 | 2000.00 | BDT | true |

**Images**
*(none yet — still in DRAFT, no uploads required for this test entry)*

---

## Property 5 — Dhanmondi Studio Apartment

**Property**
- title: `Modern Studio Apartment in Dhanmondi`
- description: `Compact, modern studio unit with attached kitchenette, ideal for a single professional. Recently renovated.`
- category: `Studio Apartment`
- status: `PUBLISHED`
- isFeatured: `true`
- totalUnits: `1`

**Address**
- division: `Dhaka`
- district: `Dhaka`
- upazila: `Dhanmondi`
- buildingNo: `Flat 6C, House 33`
- streetAddress: `Road 8/A, Dhanmondi`
- addressLine2: `` *(leave blank)*
- landmark: `Near Dhanmondi Lake`
- postalCode: `1209`
- latitude: `23.7461`
- longitude: `90.3742`

**Amenities:** Generator Backup, WASA Water Supply, Lift/Elevator, Air Conditioning, Wifi Available, Furnished

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Studio 6C | AVAILABLE | 550 | 1 | 1 | 6 | Open-plan studio with lake-facing window |

**Pricing (Studio 6C)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 22000.00 | 44000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/dhanmondi-studio/800/600` | Studio interior | true |
| `https://picsum.photos/seed/dhanmondi-view/800/600` | Lake view from window | false |

---

## Property 6 — Khulna Shared Room Unit

**Property**
- title: `Shared Room for Students Near Khulna University`
- description: `Two-tenant shared room, walking distance to Khulna University campus. Simple, no-frills setup for students on a budget.`
- category: `Shared Room`
- status: `PUBLISHED`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Khulna`
- district: `Khulna`
- upazila: `Khulna Sadar`
- buildingNo: `House 18`
- streetAddress: `KU Road`
- addressLine2: `Lane 3`
- landmark: `Near Khulna University Main Gate`
- postalCode: `9000`
- latitude: `22.8456`
- longitude: `89.5403`

**Amenities:** WASA Water Supply, Wifi Available, Bike Parking

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Shared Room A | AVAILABLE | 160 | 1 | 1 | 2 | Two-bed shared room, shared bathroom on floor |

**Pricing (Shared Room A)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 3000.00 | 1500.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/khulna-shared/800/600` | Room view | true |

---

## Property 7 — Uttara Furnished Apartment

**Property**
- title: `Fully Furnished 2-Bed Apartment in Uttara`
- description: `Ready-to-move-in furnished apartment with modern interior, ideal for expats or short-term corporate stays.`
- category: `Furnished Apartment`
- status: `PUBLISHED`
- isFeatured: `true`
- totalUnits: `1`

**Address**
- division: `Dhaka`
- district: `Dhaka`
- upazila: `Uttara`
- buildingNo: `House 45, Sector 7`
- streetAddress: `Uttara Sector 7 Road`
- addressLine2: `` *(leave blank)*
- landmark: `Near Uttara Sector 7 Park`
- postalCode: `1230`
- latitude: `23.8759`
- longitude: `90.3795`

**Amenities:** Generator Backup, WASA Water Supply, Lift/Elevator, CCTV Security, Car Parking, Air Conditioning, Furnished, Intercom

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Unit 3A | AVAILABLE | 1200 | 2 | 2 | 3 | Fully furnished, includes kitchen appliances |

**Pricing (Unit 3A)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 35000.00 | 70000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/uttara-furnished/800/600` | Living area | true |
| `https://picsum.photos/seed/uttara-kitchen/800/600` | Kitchen | false |

---

## Property 8 — Rajshahi Duplex House

**Property**
- title: `Independent Duplex House in Rajshahi City`
- description: `Two-story independent duplex with private entrance, small front yard, and 4 bedrooms across both floors. Suited for a large family.`
- category: `Duplex House`
- status: `INACTIVE`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Rajshahi`
- district: `Rajshahi`
- upazila: `Rajshahi Sadar` *(actual Upazila name may be `Paba` depending on your seeded data — adjust if needed)*
- buildingNo: `House 12`
- streetAddress: `Uposhohor Road`
- addressLine2: `Sector 2`
- landmark: `Near Uposhohor Park`
- postalCode: `6000`
- latitude: `24.3745`
- longitude: `88.6042`

**Amenities:** WASA Water Supply, Car Parking, Balcony, Water Reserve Tank

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Full House | AVAILABLE | 2400 | 4 | 3 | 1-2 *(both floors)* | Entire duplex, ground + first floor, private yard |

**Pricing (Full House)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 28000.00 | 56000.00 | BDT | true |

**Images**
*(none yet — status is INACTIVE, listed as a placeholder property without photos for testing an inactive-state card)*

---

## Property 9 — Banani Office Space

**Property**
- title: `Small Office Space in Banani Commercial Area`
- description: `Ground-floor office space suitable for a small team, close to Banani DOHS and main commercial road. Includes a small reception area.`
- category: `Office Space`
- status: `PUBLISHED`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Dhaka`
- district: `Dhaka`
- upazila: `Banani` *(substitute `Dhaka Sadar` if not seeded)*
- buildingNo: `Suite 2, House 88`
- streetAddress: `Banani Road 11`
- addressLine2: `` *(leave blank)*
- landmark: `Near Banani Model Town Gate`
- postalCode: `1213`
- latitude: `23.7937`
- longitude: `90.4066`

**Amenities:** Generator Backup, Lift/Elevator, CCTV Security, Air Conditioning, Car Parking, Intercom

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Suite 2 | AVAILABLE | 800 | 0 | 1 | 2 | Open-plan office layout, one attached washroom |

**Pricing (Suite 2)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 40000.00 | 80000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/banani-office/800/600` | Office floor | true |

---

## Property 10 — Barishal Commercial Shop

**Property**
- title: `Ground Floor Shop Space in Barishal City Center`
- description: `Small retail shop space on a busy commercial road, previously used as a grocery store. Good foot traffic area.`
- category: `Commercial Shop`
- status: `PUBLISHED`
- isFeatured: `false`
- totalUnits: `1`

**Address**
- division: `Barishal`
- district: `Barishal`
- upazila: `Barishal Sadar`
- buildingNo: `Shop 4, Market Complex`
- streetAddress: `Sadar Road`
- addressLine2: `Near Bibir Pukur Par`
- landmark: `Opposite Barishal Central Market`
- postalCode: `8200`
- latitude: `22.7010`
- longitude: `90.3535`

**Amenities:** Generator Backup, Security Guard, CCTV Security

**Units**

| unitLabel | status | sizeSqft | bedrooms | bathrooms | floor | description |
|---|---|---|---|---|---|---|
| Shop 4 | AVAILABLE | 350 | 0 | 1 | Ground | Shutter-front shop unit with small storage area at back |

**Pricing (Shop 4)**

| rentType | rentAmount | securityDeposit | currency | isActive |
|---|---|---|---|---|
| MONTHLY | 15000.00 | 30000.00 | BDT | true |

**Images**
| url | caption | isCover |
|---|---|---|
| `https://picsum.photos/seed/barishal-shop/800/600` | Shop front | true |

---

## Quick reference — spread across statuses/categories for testing coverage

| # | Property | Status | Category | Units | Division |
|---|---|---|---|---|---|
| 1 | Gulshan Family Apartment | PUBLISHED | Family Apartment | 1 | Dhaka |
| 2 | Mirpur Bachelor Mess | PUBLISHED | Bachelor Mess | 4 | Dhaka |
| 3 | Chattogram Sublet Room | PUBLISHED | Sublet | 1 | Chattogram |
| 4 | Sylhet Rooftop Room | DRAFT | Rooftop/Garage | 1 | Sylhet |
| 5 | Dhanmondi Studio Apartment | PUBLISHED | Studio Apartment | 1 | Dhaka |
| 6 | Khulna Shared Room Unit | PUBLISHED | Shared Room | 1 | Khulna |
| 7 | Uttara Furnished Apartment | PUBLISHED | Furnished Apartment | 1 | Dhaka |
| 8 | Rajshahi Duplex House | INACTIVE | Duplex House | 1 | Rajshahi |
| 9 | Banani Office Space | PUBLISHED | Office Space | 1 | Dhaka |
| 10 | Barishal Commercial Shop | PUBLISHED | Commercial Shop | 1 | Barishal |

This mix deliberately covers: all three `PropertyStatus` values (mostly Published, one Draft, one Inactive), all three `PropertyUnitStatus` values (across Property 2's four rooms), a multi-unit property (Property 2) alongside several single-unit ones, `isFeatured = true` on three properties, and geography spread across six different divisions — enough variety to exercise filters, sorting, and status-based UI states without needing a real seed script.