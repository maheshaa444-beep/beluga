import { z } from "zod";

export const RegionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  companyCount: z.number().int().nonnegative(),
  center: z.tuple([z.number(), z.number()]),
  bounds: z.tuple([
    z.tuple([z.number(), z.number()]),
    z.tuple([z.number(), z.number()]),
  ]),
  geometry: z.object({
    type: z.literal("MultiPolygon"),
    coordinates: z.array(z.array(z.array(z.tuple([z.number(), z.number()])))),
  }),
  isPlaceholderGeometry: z.boolean().optional(),
});

export type Region = z.infer<typeof RegionSchema>;
