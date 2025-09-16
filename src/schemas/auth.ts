import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(1, "Fullname is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignUpForm = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginForm = z.infer<typeof loginSchema>;
