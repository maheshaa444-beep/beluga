import { describe, expect, it } from "vitest";
import { createMemoryProductRepository } from "./memory-repository";
import { seedProducts } from "./seed";
import type { ProductValues } from "./schema";

const sample: ProductValues = {
  name: "Atlas Routing",
  description: "Last-mile routing for regional 3PLs that still live in WhatsApp.",
  category: "SaaS",
  targetIndustries: ["Logistics"],
  idealCustomer: "Operations head at a 3PL covering South India hubs.",
  painPoints: "Dispatchers rebuild routes every morning from screenshots.",
  keyFeatures: ["Live routing", "Driver app"],
  pricingNotes: "Per vehicle",
  idealCompanySize: "smb",
  keywords: ["routing", "3pl"],
};

describe("MemoryProductRepository", () => {
  it("lists a cloned snapshot of seed data", async () => {
    const repo = createMemoryProductRepository();
    const listed = await repo.list();
    expect(listed).toHaveLength(seedProducts.length);
    listed[0]!.name = "Mutated";
    const again = await repo.list();
    expect(again.find((item) => item.id === listed[0]!.id)?.name).not.toBe(
      "Mutated",
    );
  });

  it("creates, updates, and deletes a product", async () => {
    const repo = createMemoryProductRepository([]);
    const created = await repo.create(sample);
    expect(created.id).toBeTruthy();
    expect(await repo.get(created.id)).toMatchObject({ name: sample.name });

    const updated = await repo.update(created.id, {
      ...sample,
      name: "Atlas Routing Pro",
    });
    expect(updated.name).toBe("Atlas Routing Pro");
    expect(updated.createdAt).toBe(created.createdAt);

    await repo.delete(created.id);
    expect(await repo.get(created.id)).toBeNull();
    await expect(repo.delete(created.id)).rejects.toThrow(/not found/);
  });
});
