import { describe, expect, it } from "vitest";
import { InMemoryRegionRepository } from "./memory-repository";

describe("InMemoryRegionRepository", () => {
  it("lists all mock regions with company counts", async () => {
    const repo = new InMemoryRegionRepository();
    const list = await repo.list();
    expect(list.length).toBeGreaterThanOrEqual(2);
    expect(list[0]).toMatchObject({
      id: "bengaluru",
      name: "Bengaluru",
      companyCount: 1840,
      isPlaceholderGeometry: true,
    });
  });

  it("retrieves a region by slug", async () => {
    const repo = new InMemoryRegionRepository();
    const region = await repo.getBySlug("mysuru");
    expect(region).not.toBeNull();
    expect(region?.name).toBe("Mysuru");
    expect(region?.companyCount).toBe(420);
    expect(region?.bounds).toBeDefined();
  });

  it("returns null for unknown region slug", async () => {
    const repo = new InMemoryRegionRepository();
    const region = await repo.getBySlug("unknown-place");
    expect(region).toBeNull();
  });
});
