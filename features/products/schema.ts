import { z } from "zod";

export const productCategories = [
  "SaaS",
  "Infrastructure",
  "Industrial",
  "Services",
  "Security",
] as const;

export const companySizes = [
  "startup",
  "smb",
  "mid-market",
  "enterprise",
  "any",
] as const;

const tagList = z
  .array(z.string().trim().min(1, "Tag cannot be empty").max(40))
  .min(1, "Add at least one")
  .max(16, "Too many tags");

export const productInputSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80, "Name is too long"),
  description: z
    .string()
    .trim()
    .min(12, "Give a one-line description")
    .max(220, "Keep it to one line"),
  category: z.enum(productCategories),
  targetIndustries: tagList,
  idealCustomer: z
    .string()
    .trim()
    .min(12, "Describe the ideal customer")
    .max(400, "Too long"),
  painPoints: z
    .string()
    .trim()
    .min(12, "Describe the pain you solve")
    .max(600, "Too long"),
  keyFeatures: tagList,
  pricingNotes: z.string().trim().max(400, "Too long").default(""),
  idealCompanySize: z.enum(companySizes),
  keywords: tagList,
});

export const productSchema = productInputSchema.extend({
  id: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type ProductInput = z.input<typeof productInputSchema>;
export type ProductValues = z.output<typeof productInputSchema>;
export type Product = z.output<typeof productSchema>;
export type ProductCategory = (typeof productCategories)[number];
export type CompanySize = (typeof companySizes)[number];

export function parseProductInput(data: unknown) {
  return productInputSchema.safeParse(data);
}
