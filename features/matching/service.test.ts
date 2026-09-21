import { describe, expect, it } from "vitest";
import { generateCompaniesForRegion } from "@/features/company/generator";
import { computeCompanyMatch } from "./service";
import { InMemoryMatchRepository } from "./memory-repository";

describe("DeterministicMatchingService", () => {
  const sampleCompany = generateCompaniesForRegion("bengaluru", 10)[0];

  it("produces deterministic scores and tiers for identical input", () => {
    const match1 = computeCompanyMatch("harbor-payroll", sampleCompany);
    const match2 = computeCompanyMatch("harbor-payroll", sampleCompany);

    expect(match1.score).toBe(match2.score);
    expect(match1.tier).toBe(match2.tier);
    expect(match1.contact).toEqual(match2.contact);
    expect(match1.callBrief).toEqual(match2.callBrief);
  });

  it("enforces tier score threshold boundaries", () => {
    const companies = generateCompaniesForRegion("bengaluru", 100);
    for (const c of companies) {
      const match = computeCompanyMatch("harbor-payroll", c);
      if (match.score >= 75) {
        expect(match.tier).toBe("High");
      } else if (match.score >= 50) {
        expect(match.tier).toBe("Mid");
      } else {
        expect(match.tier).toBe("Least");
      }
    }
  });

  it("produces distinct scores for different products on the same company", () => {
    // IT company
    const itCompany = {
      ...sampleCompany,
      industry: "IT & Software Services",
    };

    const harborMatch = computeCompanyMatch("harbor-payroll", itCompany);
    const lineageMatch = computeCompanyMatch("lineage-mes", itCompany);

    // Harbor Payroll should score higher for IT than Lineage MES
    expect(harborMatch.score).toBeGreaterThan(lineageMatch.score);
  });

  it("returns matches sorted descending by score in InMemoryMatchRepository", async () => {
    const companies = generateCompaniesForRegion("bengaluru", 50);
    const repo = new InMemoryMatchRepository();
    const matches = await repo.getMatchesForProductAndRegion(
      "harbor-payroll",
      "bengaluru",
      companies
    );

    expect(matches).toHaveLength(50);
    for (let i = 0; i < matches.length - 1; i++) {
      expect(matches[i].score).toBeGreaterThanOrEqual(matches[i + 1].score);
    }
  });

  it("supports top-10 pagination slicing", async () => {
    const companies = generateCompaniesForRegion("bengaluru", 50);
    const repo = new InMemoryMatchRepository();
    const matches = await repo.getMatchesForProductAndRegion(
      "harbor-payroll",
      "bengaluru",
      companies
    );

    const highMatches = matches.filter((m) => m.tier === "High");
    const firstPage = highMatches.slice(0, 10);
    const secondPage = highMatches.slice(10, 20);

    expect(firstPage.length).toBeLessThanOrEqual(10);
    if (highMatches.length > 10) {
      expect(secondPage.length).toBeGreaterThan(0);
      expect(firstPage[0].score).toBeGreaterThanOrEqual(secondPage[0].score);
    }
  });
});
