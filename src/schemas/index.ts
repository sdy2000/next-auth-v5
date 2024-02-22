import * as z from "zod";

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum 6 characters required!",
    }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });

export const ResetSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Email is required!",
  }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Email is required!",
  }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
  code: z.optional(z.string().min(1, { message: "Two factor is required" })),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(3, {
      message: "Minimum 3 characters required!",
    }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Email is required!",
    }),
    password: z.string().min(6, {
      message: "Minimum 6 characters required!",
    }),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords does not match",
  });
