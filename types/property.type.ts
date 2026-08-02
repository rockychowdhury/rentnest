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
  MONTHLY = "MONTHLY",
  DAILY = "DAILY",
}

export interface Division {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  divisionId: string;
}

export interface Upazila {
  id: string;
  name: string;
  districtId: string;
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
  propertyId: string;
  upazilaId: string;
  buildingNumber?: string;
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
  deletedAt?: Date | string | null;
  totalUnits: number;
  
  category?: Category;
  address?: Address;
  amenities?: PropertyAmenity[];
  units?: PropertyUnit[];
  images?: PropertyImage[];
}
