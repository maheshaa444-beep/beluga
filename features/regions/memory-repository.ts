import type { RegionRepository } from "./repository";
import type { Region } from "./schema";

const MOCK_REGIONS: Region[] = [
  {
    id: "bengaluru",
    slug: "bengaluru",
    name: "Bengaluru",
    companyCount: 1840,
    center: [77.5946, 12.9716],
    bounds: [
      [77.536, 12.8452],
      [77.7499, 13.0358],
    ],
    geometry: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [77.536, 12.8452],
            [77.7499, 12.8452],
            [77.7499, 13.0358],
            [77.536, 13.0358],
            [77.536, 12.8452],
          ],
        ],
      ],
    },
    isPlaceholderGeometry: true,
  },
  {
    id: "mysuru",
    slug: "mysuru",
    name: "Mysuru",
    companyCount: 420,
    center: [76.6394, 12.2958],
    bounds: [
      [76.613, 12.12],
      [76.6828, 12.337],
    ],
    geometry: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [76.613, 12.12],
            [76.6828, 12.12],
            [76.6828, 12.337],
            [76.613, 12.337],
            [76.613, 12.12],
          ],
        ],
      ],
    },
    isPlaceholderGeometry: true,
  },
];

export class InMemoryRegionRepository implements RegionRepository {
  private regions: Region[];

  constructor(initialData: Region[] = MOCK_REGIONS) {
    this.regions = initialData.map((r) => structuredClone(r));
  }

  async list(): Promise<Region[]> {
    return structuredClone(this.regions);
  }

  async getBySlug(slug: string): Promise<Region | null> {
    const found = this.regions.find((r) => r.slug.toLowerCase() === slug.toLowerCase());
    return found ? structuredClone(found) : null;
  }

  async getById(id: string): Promise<Region | null> {
    const found = this.regions.find((r) => r.id === id);
    return found ? structuredClone(found) : null;
  }
}

let singletonInstance: InMemoryRegionRepository | null = null;

export function getRegionRepository(): RegionRepository {
  if (!singletonInstance) {
    singletonInstance = new InMemoryRegionRepository();
  }
  return singletonInstance;
}
