import type { Product } from "./schema";

export const seedProducts: Product[] = [
  {
    id: "prd_obsidian_cost",
    name: "Obsidian Cost Cloud",
    description:
      "FinOps for multi-cloud estates that still run on tribal knowledge.",
    category: "Infrastructure",
    targetIndustries: ["IT services", "SaaS", "BFSI"],
    idealCustomer:
      "VP Infra or FinOps lead at a 500–5,000 person product or services firm with AWS plus a stubborn on-prem footprint.",
    painPoints:
      "Shared clusters, surprise GPU bills, and no clean mapping from cost to product line. Finance asks for a number; engineering shrugs.",
    keyFeatures: [
      "Unit economics",
      "Anomaly alerts",
      "Showback",
      "Reserved capacity planner",
    ],
    pricingNotes: "Platform fee by cloud spend band; professional services optional.",
    idealCompanySize: "mid-market",
    keywords: ["finops", "aws", "azure", "cost", "gpu"],
    createdAt: "2026-03-12T08:00:00.000Z",
    updatedAt: "2026-08-02T11:20:00.000Z",
  },
  {
    id: "prd_lineage_mes",
    name: "Lineage MES",
    description:
      "Lightweight manufacturing execution for plants that outgrew spreadsheets.",
    category: "Industrial",
    targetIndustries: ["Automotive", "Electronics", "Precision engineering"],
    idealCustomer:
      "Plant head or quality director in Karnataka / Tamil Nadu clusters running 2–8 lines with mixed OEM and contract work.",
    painPoints:
      "Work orders live in Excel, downtime is tribal, and customer audits stall on missing traceability.",
    keyFeatures: [
      "Work-order tracking",
      "Andon",
      "Genealogy",
      "OEE dashboards",
    ],
    pricingNotes: "Per-line subscription; on-prem gateway included.",
    idealCompanySize: "smb",
    keywords: ["mes", "oee", "factory", "traceability", "isa-95"],
    createdAt: "2026-01-20T08:00:00.000Z",
    updatedAt: "2026-07-18T09:10:00.000Z",
  },
  {
    id: "prd_harbor_payroll",
    name: "Harbor Payroll",
    description:
      "India-first payroll, PF, and contractor payouts without the usual chaos.",
    category: "SaaS",
    targetIndustries: ["IT services", "GCCs", "Staffing"],
    idealCustomer:
      "CHRO or finance controller at a GCC or services firm with 200–3,000 employees across multiple states.",
    painPoints:
      "Statutory filings slip, contractor vs FTE logic is messy, and employees ping HR for every payslip.",
    keyFeatures: [
      "Statutory engine",
      "Contractor rails",
      "Self-serve payslips",
      "Audit exports",
    ],
    pricingNotes: "Per active employee; implementation billed separately.",
    idealCompanySize: "mid-market",
    keywords: ["payroll", "epfo", "esi", "gcc", "hris"],
    createdAt: "2025-11-04T08:00:00.000Z",
    updatedAt: "2026-06-22T14:00:00.000Z",
  },
  {
    id: "prd_nimbus_shield",
    name: "Nimbus Shield",
    description:
      "Identity-aware access for banks and NBFCs that cannot rip out core systems.",
    category: "Security",
    targetIndustries: ["Banking", "NBFC", "Insurance"],
    idealCustomer:
      "CISO or head of digital channels at a mid-size bank or NBFC with hybrid core and a growing API surface.",
    painPoints:
      "Partner APIs sit behind shared credentials, privileged access is a spreadsheet, and RBI audits ask for evidence nobody can produce in time.",
    keyFeatures: [
      "Just-in-time access",
      "API threat detection",
      "Privileged session recording",
      "Evidence packs",
    ],
    pricingNotes: "Annual platform + connector packs for core, payments, and cloud.",
    idealCompanySize: "enterprise",
    keywords: ["zero-trust", "pam", "rbi", "api-security", "iam"],
    createdAt: "2026-02-08T08:00:00.000Z",
    updatedAt: "2026-09-01T16:40:00.000Z",
  },
];
