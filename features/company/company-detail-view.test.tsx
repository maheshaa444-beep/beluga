import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CompanyDetailView } from "./company-detail-view";
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
  fitReasoning: "Strong IT alignment for Harbor Payroll",
  pitchAngle: "Payroll automation for multi-facility ops",
  likelyPainPoint: "Manual compliance oversight",
  aboutSummary: "Leading IT company in Bengaluru",
  contact: {
    name: "Rajesh Rao",
    title: "VP of HR",
    phone: "+91 80 5550 0142",
    email: "contact@apexinfotech.example.com",
    website: "https://apexinfotech.example.com",
  },
  callBrief: {
    openingLine: "Hi Rajesh, noticed your growth in Whitefield",
    talkingPoints: ["Automate payroll across 450 employees"],
    likelyObjection: "We have internal HR processes",
    objectionReply: "Save 35% time unifying workflows",
  },
};

describe("CompanyDetailView Component", () => {
  it("renders all company detail sections with visible styling", async () => {
    render(
      <CompanyDetailView
        company={mockCompany}
        match={mockMatch}
        onBackToPriorities={vi.fn()}
      />
    );

    // Verify key sections are present
    const companyEl = await screen.findByText(/Apex Infotech/);
    expect(companyEl).toBeInTheDocument();
    expect(screen.getByText(/94% Score/)).toBeInTheDocument();

    // Location
    expect(screen.getByText(/Open in Google Maps/)).toBeInTheDocument();
    expect(screen.getByText(/#12, Whitefield, Bengaluru/)).toBeInTheDocument();

    // Photo Gallery
    expect(screen.getByText(/Facility Photos/)).toBeInTheDocument();

    // Why this fits
    expect(screen.getByText(/Why This Fits/)).toBeInTheDocument();
    expect(screen.getByText(/Strong IT alignment for Harbor Payroll/)).toBeInTheDocument();

    // Contact Card
    expect(screen.getByText(/Prospect Contact Card/)).toBeInTheDocument();
    expect(screen.getByText(/Rajesh Rao/)).toBeInTheDocument();
    expect(screen.getByText(/\+91 80 5550 0142/)).toBeInTheDocument();
    expect(screen.getByText(/contact@apexinfotech.example.com/)).toBeInTheDocument();

    // Call Brief
    expect(screen.getByText(/AI Cold Call Brief/)).toBeInTheDocument();
    expect(screen.getByText(/Copy Brief/)).toBeInTheDocument();

    // Assert container visibility
    const mainAside = companyEl.closest("aside");
    expect(mainAside).not.toBeNull();
    const style = window.getComputedStyle(mainAside!);
    expect(style.display).not.toBe("none");
    expect(style.visibility).not.toBe("hidden");
    expect(style.opacity).not.toBe("0");
  });
});
