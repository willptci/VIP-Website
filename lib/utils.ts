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
  if (type == 'sign-up' && verifiedPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ['confirmPassword']
    });
  }
});

export const businessFormSchema = () => z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  preferredContact: z.string().min(1, 'Must enter email or phone number'),
  companyName: z.string().optional(),
  description: z.string().optional(),
  offer: z.string().min(1, 'Please describe what you offer'),
  charges: z.string().min(1, 'Please specify price packages'),
});

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));