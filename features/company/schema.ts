import { z } from "zod";

export const companyTierSchema = z.enum(["High", "Mid", "Least"]);
export type CompanyTier = z.infer<typeof companyTierSchema>;

export const companySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  regionId: z.string().min(1),
  coordinates: z.tuple([z.number(), z.number()]),
  industry: z.string().min(1),
  tier: companyTierSchema,
  employeeCount: z.number().int().nonnegative(),
  address: z.string().min(1),
  hub: z.string().min(1),
  revenueEst: z.string().optional(),
  website: z.string().optional(),
});

export type Company = z.infer<typeof companySchema>;
