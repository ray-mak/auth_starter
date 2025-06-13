import { z } from "zod"

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3)
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9_]+$/.test(value),
      {
        message: "Invalid email or username",
      }
    ),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signUpSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
})

export const updatePasswordSchema = z.object({
  userId: z.string(),
  password: z.string().min(6),
  newPassword: z.string().min(6),
})
