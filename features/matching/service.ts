import type { Company } from "@/features/company/schema";
import type { CompanyMatch, MatchTier } from "./schema";

function createPRNG(seedStr: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  let s = h >>> 0;

  return function random() {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = ["Rajesh", "Priya", "Ananya", "Vikram", "Suresh", "Kavita", "Arjun", "Meera", "Kiran", "Deepak"];
const LAST_NAMES = ["Rao", "Nair", "Kulkarni", "Sharma", "Shetty", "Patel", "Gowda", "Deshmukh", "Iyer", "Hegde"];
const TITLES = ["VP of Engineering", "Head of Operations", "Director of IT", "VP of Supply Chain", "Plant Manager", "Chief Technology Officer", "Director of Procurement"];

export function computeCompanyMatch(
  productId: string,
  company: Company
): CompanyMatch {
  const rand = createPRNG(`match:${productId}:${company.id}`);

  // Base score calculation based on product preferences
  let baseScore = 50;

  if (productId === "harbor-payroll") {
    // Favors IT, Software, Services, Staffing
    if (company.industry.includes("IT") || company.industry.includes("Software")) baseScore += 35;
    else if (company.industry.includes("Logistics")) baseScore += 20;
    else if (company.industry.includes("Textiles")) baseScore += 15;
    else baseScore += 5;

    if (company.employeeCount > 200) baseScore += 10;
  } else if (productId === "lineage-mes") {
    // Favors Manufacturing, Automotive, Aerospace, Industrial
    if (company.industry.includes("Manufacturing") || company.industry.includes("Engineering")) baseScore += 40;
    else if (company.industry.includes("Automotive")) baseScore += 35;
    else if (company.industry.includes("Aerospace")) baseScore += 35;
    else if (company.industry.includes("Electronics")) baseScore += 20;
    else baseScore -= 10;

    if (company.employeeCount > 100) baseScore += 10;
  } else if (productId === "nimbus-shield") {
    // Favors Electronics, Cloud, Security, Aerospace, IT
    if (company.industry.includes("Electronics") || company.industry.includes("Hardware")) baseScore += 35;
    else if (company.industry.includes("Aerospace")) baseScore += 30;
    else if (company.industry.includes("IT")) baseScore += 28;
    else baseScore += 10;
  } else if (productId === "obsidian-cost-cloud") {
    // Favors SaaS, IT, Hardware, High-growth Tech
    if (company.industry.includes("IT") || company.industry.includes("Software")) baseScore += 38;
    else if (company.industry.includes("Electronics")) baseScore += 25;
    else if (company.industry.includes("Logistics")) baseScore += 20;
    else baseScore += 5;
  } else {
    baseScore = 60;
  }

  // PRNG Jitter (-12 to +12)
  const jitter = Math.floor((rand() - 0.5) * 24);
  const rawScore = Math.min(Math.max(baseScore + jitter, 18), 98);
  const score = Math.round(rawScore);

  let tier: MatchTier = "Mid";
  if (score >= 75) tier = "High";
  else if (score < 50) tier = "Least";

  // Contact generation with obviously fake unroutable patterns
  const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
  const contactName = `${firstName} ${lastName}`;
  const contactTitle = TITLES[Math.floor(rand() * TITLES.length)];

  const phoneSuffix = String(Math.floor(rand() * 90) + 10).padStart(2, "0");
  const contactPhone = `+91 80 5550 01${phoneSuffix}`; // Unroutable 555 prefix
  const cleanDomain = company.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const contactEmail = `contact@${cleanDomain}.example.com`; // Reserved .example domain

  // Fit reasoning templates
  const fitReasoning = `${company.name} operates in ${company.industry} with an estimated ${company.employeeCount} headcount in ${company.hub}. Their operational structure aligns closely with target customer criteria for ${productId}.`;
  
  const pitchAngle = `Focus on automated efficiency gains and risk mitigation tailored for ${company.industry} operations in ${company.hub}.`;

  const likelyPainPoint = `Scaling operational compliance, manual oversight costs, and tracking multi-facility workflows across ${company.address}.`;

  const aboutSummary = `${company.name} is a leading ${company.industry} enterprise based in ${company.hub}, ${company.regionId}. Operating from ${company.address}, they maintain a workforce of approximately ${company.employeeCount} employees.`;

  // Call brief templates
  const openingLine = `Hi ${firstName}, I noticed ${company.name}'s impressive growth in ${company.hub}. Given your focus on ${company.industry}, I wanted to share how similar teams are streamlining their operations.`;

  const talkingPoints = [
    `Reduce operational overhead across ${company.employeeCount} employees by automating repetitive workflows.`,
    `Seamless integration with existing enterprise stack without replacing core infrastructure.`,
    `Proven track record with similar ${company.industry} leaders in ${company.regionId}.`,
  ];

  const likelyObjection = `"We already have internal processes handling this."`;
  const objectionReply = `"Understood, ${firstName}. Most of our clients had internal systems too, but found they saved 35% more time by unifying their workflow. Would you be open to a 10-minute preview next Tuesday?"`;

  return {
    companyId: company.id,
    productId,
    score,
    tier,
    fitReasoning,
    pitchAngle,
    likelyPainPoint,
    aboutSummary,
    contact: {
      name: contactName,
      title: contactTitle,
      phone: contactPhone,
      email: contactEmail,
      website: company.website || `https://${cleanDomain}.example.com`,
    },
    callBrief: {
      openingLine,
      talkingPoints,
      likelyObjection,
      objectionReply,
    },
  };
}
