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
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  role: z.enum(["user", "business"]).optional(),
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
  phoneNumber: z.string().min(10, 'Must enter 10 digit phone number'),
  businessEmail: z.string().optional(),
  companyName: z.string().optional(),
  ownerDescription: z.string().optional(),
  companyDescription: z.string().optional(),
});

export const packageFormSchema = () => z.object({
  title: z.string().min(1, 'Must enter package label'),
  capacity: z.string().min(1, 'Must enter max capacity'),
  amount: z.string().min(1, 'Must enter price'),
  per: z.string().min(1, 'Must enter what price is per'),
  what: z.string().min(1, 'Must give a itinerary of the package'),
  time: z.string().min(1, 'Must enter how long this package will take'),
  included: z.string().min(1, 'Must enter what is included with package'),
  bring: z.string().min(1, 'Must enter specifics guests are welcome to bring'),
  total: z.number().min(0.25, 'Total must be at least 15 minutes'),
});

export const userFormSchema = () => z.object({
  uid: z.string().min(1, 'User ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional(),
  telephone: z.string().min(10, 'Must enter a 10-digit phone number').optional(),
  description: z.string().optional(),
  profileImageUrl: z.string().url('Invalid image URL').optional(),
});

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));