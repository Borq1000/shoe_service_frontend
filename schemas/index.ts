import * as z from "zod";

// Определим схему валидации с использованием zod
export const LoginSchema = z.object({
  email: z.string().email().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // Ошибка будет указывать на это поле
  });
