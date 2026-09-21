import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  NEXT_PUBLIC_PROTOMAPS_API_KEY: z.string().default(""),
  NEXT_PUBLIC_MAP_TILES_URL: z.string().default(""),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_PROTOMAPS_API_KEY: process.env.NEXT_PUBLIC_PROTOMAPS_API_KEY,
  NEXT_PUBLIC_MAP_TILES_URL: process.env.NEXT_PUBLIC_MAP_TILES_URL,
});

export type Env = z.infer<typeof envSchema>;
