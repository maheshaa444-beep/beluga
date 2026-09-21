import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PrioritiesPanel } from "./priorities-panel";
import type { Company } from "./schema";
import type { CompanyMatch } from "@/features/matching/schema";

const mockCompany: Company = {
  id: "comp-1",
  name: "Apex Infotech",
  regionId: "bengaluru",
  coordinates: [77.5946, 12.9716],
  industry: "IT & Software Services",
  tier: "High",
  employeeCount: 450,
  address: "#12, Whitefield, Bengaluru",
  hub: "Whitefield",
  revenueEst: "$10M-$50M",
  website: "https://apexinfotech.example.com",
};

const mockMatch: CompanyMatch = {
  companyId: "comp-1",
  productId: "harbor-payroll",
  score: 94,
  tier: "High",
  fitReasoning: "Strong IT overlap",
  pitchAngle: "Payroll automation",
  likelyPainPoint: "Manual payroll calculation",
  aboutSummary: "Leading IT company",
  contact: {
    name: "Rajesh Rao",
    title: "VP of HR",
    phone: "+91 80 5550 0142",
    email: "contact@apexinfotech.example.com",
    website: "https://apexinfotech.example.com",
  },
  callBrief: {
    openingLine: "Hi Rajesh",
    talkingPoints: ["Automate payroll"],
    likelyObjection: "We have internal HR",
    objectionReply: "Save 35% time",
  },
};

describe("PrioritiesPanel Component", () => {
  it("renders priority company rows with scores and visible styling", async () => {
    const companiesMap = new Map<string, Company>([["comp-1", mockCompany]]);
    const onSelectCompany = vi.fn();

    render(
      <PrioritiesPanel
        isOpen={true}
        onClose={vi.fn()}
        matches={[mockMatch]}
        companiesMap={companiesMap}
        onSelectCompany={onSelectCompany}
      />
    );

    const titleEl = await screen.findByText(/Priorities Engine/);
    const companyEl = await screen.findByText(/Apex Infotech/);

    expect(titleEl).toBeInTheDocument();
    expect(companyEl).toBeInTheDocument();
    expect(screen.getByText(/94%/)).toBeInTheDocument();

    const row = companyEl.closest("[role='button']");
    expect(row).not.toBeNull();

    const style = window.getComputedStyle(row!);
    expect(style.display).not.toBe("none");
    expect(style.visibility).not.toBe("hidden");
    expect(style.opacity).not.toBe("0");
  });
});
