import { z } from "zod";

export const loginPayloadSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const loginSchema = loginPayloadSchema;

export type LoginPayload = z.infer<typeof loginPayloadSchema>;
export type LoginInput = LoginPayload;

export const registerPayloadSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\s-]{8,15}$/, "Invalid phone number format"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["TENANT", "LANDLORD"], {
    errorMap: () => ({ message: "Role must be either TENANT or LANDLORD" }),
  }),
});

export const registerSchema = registerPayloadSchema;

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type RegisterInput = RegisterPayload;
