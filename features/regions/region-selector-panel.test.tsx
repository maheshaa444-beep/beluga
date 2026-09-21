import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RegionSelectorPanel } from "./region-selector-panel";

// Mock Next.js useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock useMapApi
vi.mock("@/components/map/BaseMap", () => ({
  useMapApi: () => ({ map: null, ready: false }),
}));

// Mock useProducts
vi.mock("@/features/products/products-context", () => ({
  useProducts: () => ({
    selectedId: "prd_harbor_payroll",
    products: [{ id: "prd_harbor_payroll", name: "Harbor Payroll" }],
    setHoveredRegionId: vi.fn(),
  }),
}));

describe("RegionSelectorPanel Component", () => {
  it("auto-opens and renders Bengaluru and Mysuru rows with company counts and visible styling", async () => {
    render(<RegionSelectorPanel />);

    // Find Bengaluru and Mysuru text elements using findByText (async retry)
    const bengaluruEl = await screen.findByText("Bengaluru");
    const mysuruEl = await screen.findByText("Mysuru");

    expect(bengaluruEl).toBeInTheDocument();
    expect(mysuruEl).toBeInTheDocument();

    const bengaluruRow = bengaluruEl.closest("li");
    const mysuruRow = mysuruEl.closest("li");

    expect(bengaluruRow).not.toBeNull();
    expect(mysuruRow).not.toBeNull();

    // Verify company counts are rendered
    expect(screen.getByText(/1,840/)).toBeInTheDocument();
    expect(screen.getByText(/420/)).toBeInTheDocument();

    // Assert rows are not hidden by opacity 0, display none, or visibility hidden
    const bengaluruStyle = window.getComputedStyle(bengaluruRow!);
    const mysuruStyle = window.getComputedStyle(mysuruRow!);

    expect(bengaluruStyle.display).not.toBe("none");
    expect(bengaluruStyle.visibility).not.toBe("hidden");
    expect(bengaluruStyle.opacity).not.toBe("0");

    expect(mysuruStyle.display).not.toBe("none");
    expect(mysuruStyle.visibility).not.toBe("hidden");
    expect(mysuruStyle.opacity).not.toBe("0");
  });
});
