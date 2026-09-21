import type { Company } from "@/features/company/schema";
import type { CompanyMatch } from "./schema";

export interface MatchRepository {
  getMatchesForProductAndRegion(
    productId: string,
    regionId: string,
    companies: Company[]
  ): Promise<CompanyMatch[]>;

  getMatchForCompany(
    productId: string,
    company: Company
  ): Promise<CompanyMatch>;
}
