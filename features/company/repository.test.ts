import { describe, expect, it } from "vitest";
import { InMemoryCompanyRepository } from "./memory-repository";

describe("InMemoryCompanyRepository", () => {
  it("returns companies for bengaluru region", async () => {
    const repo = new InMemoryCompanyRepository();
    const companies = await repo.getCompaniesForRegion("bengaluru");
    expect(companies).toHaveLength(1840);
  });

  it("returns companies for mysuru region", async () => {
    const repo = new InMemoryCompanyRepository();
    const companies = await repo.getCompaniesForRegion("mysuru");
    expect(companies).toHaveLength(420);
  });

  it("fetches single company by ID", async () => {
    const repo = new InMemoryCompanyRepository();
    const company = await repo.getCompanyById("bengaluru-company-1");
    expect(company).not.toBeNull();
    expect(company?.id).toBe("bengaluru-company-1");
  });

  it("returns null for non-existent company ID", async () => {
    const repo = new InMemoryCompanyRepository();
    const company = await repo.getCompanyById("non-existent-id");
    expect(company).toBeNull();
  });
});
