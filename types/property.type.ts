export enum PropertyStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  INACTIVE = "INACTIVE",
}

export enum UnitStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
}

export enum RentType {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum Currency {
  BDT = "BDT",
  USD = "USD",
}

export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  divisionId: string;
  division?: Division;
}

export interface Upazila {
  id: string;
  name: string;
  districtId: string;
  district?: District;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export interface PropertyAmenity {
  id: string;
  propertyId: string;
  amenityId: string;
  amenity: Amenity;
}

export interface Address {
  id: string;
  propertyId?: string;
  upazilaId: string;
  buildingNo?: string;
  streetAddress: string;
  addressLine2?: string;
  landmark?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  upazila?: Upazila;
}

export interface Pricing {
  id: string;
  propertyUnitId: string;
  rentType: RentType;
  rentAmount: number;
  securityDeposit?: number;
  currency: string;
  isActive: boolean;
}

export interface PropertyUnit {
  id: string;
  propertyId: string;
  unitLabel: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqft?: number;
  floor?: number;
  description?: string;
  status: UnitStatus;
  deletedAt?: Date | string | null;
  pricing?: Pricing[];
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  deleteUrl?: string;
  isCover: boolean;
  caption?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  landlordId: string;
  status: PropertyStatus;
  isFeatured?: boolean;
  createdAt?: string;
  deletedAt?: Date | string | null;
  totalUnits: number;
  
  landlord?: {
    id: string;
    phone?: string;
    email?: string;
    profile?: { fullName?: string };
  };
  category?: Category;
  address?: Address;
  amenities?: PropertyAmenity[];
  units?: PropertyUnit[];
  images?: PropertyImage[];
}
