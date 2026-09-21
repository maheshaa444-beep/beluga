import { Company } from "./schema";

export interface CompanyRepository {
  getCompaniesForRegion(regionId: string): Promise<Company[]>;
  getCompanyById(companyId: string): Promise<Company | null>;
  getCompanyCountForRegion(regionId: string): Promise<number>;
}
