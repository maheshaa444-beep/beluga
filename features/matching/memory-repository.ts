import type { Company } from "@/features/company/schema";
import type { MatchRepository } from "./repository";
import type { CompanyMatch } from "./schema";
import { computeCompanyMatch } from "./service";

export class InMemoryMatchRepository implements MatchRepository {
  private cache: Map<string, CompanyMatch[]> = new Map();

  async getMatchesForProductAndRegion(
    productId: string,
    regionId: string,
    companies: Company[]
  ): Promise<CompanyMatch[]> {
    const key = `${productId}:${regionId.toLowerCase()}`;
    if (!this.cache.has(key)) {
      const matches = companies.map((c) => computeCompanyMatch(productId, c));
      // Sort descending by score
      matches.sort((a, b) => b.score - a.score);
      this.cache.set(key, matches);
    }
    return structuredClone(this.cache.get(key)!);
  }

  async getMatchForCompany(
    productId: string,
    company: Company
  ): Promise<CompanyMatch> {
    return computeCompanyMatch(productId, company);
  }
}

let singletonInstance: InMemoryMatchRepository | null = null;

export function getMatchRepository(): MatchRepository {
  if (!singletonInstance) {
    singletonInstance = new InMemoryMatchRepository();
  }
  return singletonInstance;
}
