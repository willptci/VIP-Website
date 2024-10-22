import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from 'zod'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const authFormSchema = (type: string) => z.object({
  email: z.string().email(),
  password: z.string().min(8),
  verifiedPassword: type === 'sign-in' ? z.string().optional() : z.string().min(8),
}).superRefine(({ verifiedPassword, password }, ctx) => {
  if (verifiedPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});