import type { Region } from "./schema";

export interface RegionRepository {
  list(): Promise<Region[]>;
  getBySlug(slug: string): Promise<Region | null>;
  getById(id: string): Promise<Region | null>;
}
