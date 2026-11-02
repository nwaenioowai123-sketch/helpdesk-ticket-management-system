
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .max(72, "Password is too long")
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Password must not exceed 72 bytes"
    ),
});

export const loginSchema = z.object({
  email: z.string()
    .trim()
    .email("Invalid email address")
    .max(254)
    .transform((value) => value.toLowerCase()),

  password: z.string()
    .min(1, "Password is required")
    .max(72)
    .refine(
      (value) => Buffer.byteLength(value, "utf8") <= 72,
      "Invalid password length"
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
