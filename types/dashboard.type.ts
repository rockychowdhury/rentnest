import { Property, PropertyUnit, Pricing, User } from "./";

export enum RentalRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED"
}

export enum LeaseStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  TERMINATED = "TERMINATED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  EXPIRED = "EXPIRED"
}

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyUnitId: string;
  pricingId: string;
  moveInDate: string;
  duration: number;
  message?: string;
  status: RentalRequestStatus;
  landlordResponse?: string;
  createdAt: string;
  updatedAt: string;
  tenant?: User;
  propertyUnit?: PropertyUnit & { property?: Property };
  pricing?: Pricing;
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyUnitId: string;
  pricingId: string;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
  createdAt: string;
  updatedAt: string;
  tenant?: User;
  propertyUnit?: PropertyUnit & { property?: Property };
  pricing?: Pricing;
}

export interface Payment {
  id: string;
  leaseId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  lease?: Lease;
}

export interface Review {
  id: string;
  propertyId: string;
  leaseId: string;
  tenantId: string;
  rating: number;
  comment: string;
  landlordResponse?: string;
  createdAt: string;
  updatedAt: string;
  tenant?: User;
  property?: Property;
}
