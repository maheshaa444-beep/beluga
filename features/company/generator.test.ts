import { describe, expect, it } from "vitest";
import { generateCompaniesForRegion } from "./generator";
import { companySchema } from "./schema";

describe("generateCompaniesForRegion", () => {
  it("generates deterministic companies for Bengaluru with 1,840 count", () => {
    const companies1 = generateCompaniesForRegion("bengaluru", 1840);
    const companies2 = generateCompaniesForRegion("bengaluru", 1840);

    expect(companies1).toHaveLength(1840);
    expect(companies1).toEqual(companies2);

    // Validate first company with schema
    const parseResult = companySchema.safeParse(companies1[0]);
    expect(parseResult.success).toBe(true);
  });

  it("generates deterministic companies for Mysuru with 420 count", () => {
    const companies = generateCompaniesForRegion("mysuru", 420);
    expect(companies).toHaveLength(420);
    expect(companySchema.safeParse(companies[0]).success).toBe(true);
  });

  it("assigns valid coordinates within bounded region ranges", () => {
    const companies = generateCompaniesForRegion("bengaluru", 100);
    for (const c of companies) {
      const [lng, lat] = c.coordinates;
      expect(lng).toBeGreaterThanOrEqual(77.45);
      expect(lng).toBeLessThanOrEqual(77.80);
      expect(lat).toBeGreaterThanOrEqual(12.75);
      expect(lat).toBeLessThanOrEqual(13.12);
    }
  });

  it("distributes tiers into High, Mid, and Least", () => {
    const companies = generateCompaniesForRegion("bengaluru", 1000);
    const tiers = companies.reduce((acc, c) => {
      acc[c.tier] = (acc[c.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    expect(tiers["High"]).toBeGreaterThan(0);
    expect(tiers["Mid"]).toBeGreaterThan(0);
    expect(tiers["Least"]).toBeGreaterThan(0);
  });
});
