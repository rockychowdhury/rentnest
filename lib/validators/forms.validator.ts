import { z } from "zod";

// Property Creation Step 1 Schema
export const propertyWizardSchema = z.object({
  title: z
    .string()
    .min(1, "Property title is required")
    .min(2, "Property title must be at least 2 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
});

export type PropertyWizardInput = z.infer<typeof propertyWizardSchema>;

// Rental Request Submission Schema
export const rentalRequestSchema = z.object({
  propertyUnitId: z.string().min(1, "Please select a property unit"),
  pricingId: z.string().min(1, "Please select a rent type/pricing"),
  moveInDate: z.string().min(1, "Move-in date is required"),
  duration: z.coerce.number().min(1, "Duration must be at least 1"),
  message: z.string().optional(),
});

export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;

// Review Submission & Editing Schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .min(2, "Comment must be at least 2 characters"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// Admin Category Creation Schema
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Category name must be at least 2 characters"),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Admin Amenity Creation Schema
export const amenitySchema = z.object({
  name: z
    .string()
    .min(1, "Amenity name is required")
    .min(2, "Amenity name must be at least 2 characters"),
});

export type AmenityInput = z.infer<typeof amenitySchema>;

// Account Profile Update Schema
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  gender: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().optional(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Account Phone Update Schema
export const accountUpdateSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\s-]{8,15}$/, "Invalid phone number format"),
});

export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>;

// Change Password Schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(1, "New password is required")
    .min(6, "New password must be at least 6 characters"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
