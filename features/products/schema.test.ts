import { describe, expect, it } from "vitest";
import { seedProducts } from "./seed";
import { parseProductInput, productSchema } from "./schema";

const validInput = {
  name: "Harbor Payroll",
  description: "India-first payroll, PF, and contractor payouts without chaos.",
  category: "SaaS" as const,
  targetIndustries: ["IT services", "GCCs"],
  idealCustomer: "CHRO at a GCC with a few hundred employees across states.",
  painPoints: "Statutory filings slip and contractor vs FTE logic is messy.",
  keyFeatures: ["Statutory engine", "Contractor rails"],
  pricingNotes: "Per active employee",
  idealCompanySize: "mid-market" as const,
  keywords: ["payroll", "epfo"],
};

describe("productInputSchema", () => {
  it("accepts a complete product", () => {
    const result = parseProductInput(validInput);
    expect(result.success).toBe(true);
  });

  it("rejects a short name and empty tags", () => {
    const result = parseProductInput({
      ...validInput,
      name: "A",
      targetIndustries: [],
      keywords: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      expect(fields.name?.length).toBeGreaterThan(0);
      expect(fields.targetIndustries?.length).toBeGreaterThan(0);
    }
  });

  it("rejects an unknown category", () => {
    const result = parseProductInput({
      ...validInput,
      category: "Consumer",
    });
    expect(result.success).toBe(false);
  });
});

describe("productSchema", () => {
  it("parses seeded products", () => {
    for (const product of seedProducts) {
      expect(productSchema.parse(product).id).toBe(product.id);
    }
    expect(seedProducts).toHaveLength(4);
  });
});
