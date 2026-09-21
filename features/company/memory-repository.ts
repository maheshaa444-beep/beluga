import type { CompanyRepository } from "./repository";
import type { Company } from "./schema";
import { generateCompaniesForRegion } from "./generator";

export class InMemoryCompanyRepository implements CompanyRepository {
  private cache: Map<string, Company[]> = new Map();

  constructor() {
    // Seed default regions
    this.cache.set("bengaluru", generateCompaniesForRegion("bengaluru", 1840));
    this.cache.set("mysuru", generateCompaniesForRegion("mysuru", 420));
  }

  async getCompaniesForRegion(regionId: string): Promise<Company[]> {
    const key = regionId.toLowerCase();
    if (!this.cache.has(key)) {
      // Default to 100 for unknown region
      this.cache.set(key, generateCompaniesForRegion(key, 100));
    }
    return structuredClone(this.cache.get(key)!);
  }

  async getCompanyById(companyId: string): Promise<Company | null> {
    for (const companies of this.cache.values()) {
      const found = companies.find((c) => c.id === companyId);
      if (found) {
        return structuredClone(found);
      }
    }
    return null;
  }

  async getCompanyCountForRegion(regionId: string): Promise<number> {
    const companies = await this.getCompaniesForRegion(regionId);
    return companies.length;
  }
}

let singletonInstance: InMemoryCompanyRepository | null = null;

export function getCompanyRepository(): CompanyRepository {
  if (!singletonInstance) {
    singletonInstance = new InMemoryCompanyRepository();
  }
  return singletonInstance;
}
