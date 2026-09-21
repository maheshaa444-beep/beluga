import type { Company, CompanyTier } from "./schema";

// Mulberry32 deterministic PRNG
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

// Bounded Box clamp
function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

interface HubConfig {
  name: string;
  center: [number, number]; // [lng, lat]
  weight: number;
}

const BENGALURU_HUBS: HubConfig[] = [
  { name: "Whitefield", center: [77.747, 12.969], weight: 0.25 },
  { name: "Electronic City", center: [77.671, 12.845], weight: 0.22 },
  { name: "Peenya", center: [77.518, 13.030], weight: 0.18 },
  { name: "Manyata Tech Park", center: [77.620, 13.045], weight: 0.15 },
  { name: "Koramangala", center: [77.625, 12.935], weight: 0.12 },
  { name: "Bommasandra", center: [77.685, 12.805], weight: 0.08 },
];

const MYSURU_HUBS: HubConfig[] = [
  { name: "Hebbal Industrial Area", center: [76.602, 12.355], weight: 0.35 },
  { name: "City Center", center: [76.650, 12.305], weight: 0.30 },
  { name: "Belagola", center: [76.570, 12.385], weight: 0.20 },
  { name: "Nanjangud", center: [76.678, 12.115], weight: 0.15 },
];

const INDUSTRIES = [
  "IT & Software Services",
  "Manufacturing & Engineering",
  "Biotech & Pharma",
  "Electronics & Hardware",
  "Logistics & Supply Chain",
  "Automotive Components",
  "Textiles & Apparel",
  "Aerospace & Defense",
];

const NAME_PREFIXES = [
  "Apex", "Vanguard", "Nexus", "Trident", "Aero", "Pulse", "Zenith", "Quantum",
  "Kaveri", "Deccan", "Synergy", "Precision", "Omni", "Veritas", "Nova", "Stellar",
  "Orion", "Helix", "Infini", "Matrix", "Astra", "Crest", "Titan", "Eco",
];

const NAME_SUFFIXES = [
  "Tech", "Solutions", "Dynamics", "Systems", "Labs", "Industries", "Works",
  "Networks", "Innovations", "Logistics", "Pharma", "Precision", "Motors",
  "Enterprise", "Global", "Technologies",
];

export function generateCompaniesForRegion(
  regionId: string,
  targetCount: number
): Company[] {
  const isBengaluru = regionId.toLowerCase().includes("bengaluru");
  const hubs = isBengaluru ? BENGALURU_HUBS : MYSURU_HUBS;
  const rand = createPRNG(`prospect-map-companies-${regionId}`);

  // Geographic bounds to clamp
  const minLng = isBengaluru ? 77.45 : 76.50;
  const maxLng = isBengaluru ? 77.80 : 76.75;
  const minLat = isBengaluru ? 12.75 : 12.05;
  const maxLat = isBengaluru ? 13.12 : 12.42;

  const companies: Company[] = [];

  for (let i = 0; i < targetCount; i++) {
    // Select hub based on weights
    const hubRand = rand();
    let accumulated = 0;
    let selectedHub = hubs[0];
    for (const h of hubs) {
      accumulated += h.weight;
      if (hubRand <= accumulated) {
        selectedHub = h;
        break;
      }
    }

    // Gaussian-like offset using sum of two uniform random variables
    const lngSpread = isBengaluru ? 0.035 : 0.025;
    const latSpread = isBengaluru ? 0.035 : 0.025;
    const offsetLng = ((rand() + rand() - 1) / 2) * lngSpread * 2;
    const offsetLat = ((rand() + rand() - 1) / 2) * latSpread * 2;

    const lng = clamp(selectedHub.center[0] + offsetLng, minLng, maxLng);
    const lat = clamp(selectedHub.center[1] + offsetLat, minLat, maxLat);

    // Tier distribution: High 25%, Mid 55%, Least 20%
    const tierRand = rand();
    let tier: CompanyTier = "Mid";
    if (tierRand < 0.25) {
      tier = "High";
    } else if (tierRand > 0.80) {
      tier = "Least";
    }

    const prefix = NAME_PREFIXES[Math.floor(rand() * NAME_PREFIXES.length)];
    const suffix = NAME_SUFFIXES[Math.floor(rand() * NAME_SUFFIXES.length)];
    const companyName = `${prefix} ${suffix}`;

    const industry = INDUSTRIES[Math.floor(rand() * INDUSTRIES.length)];
    const employeeCount =
      tier === "High"
        ? Math.floor(rand() * 1800) + 200
        : tier === "Mid"
        ? Math.floor(rand() * 180) + 20
        : Math.floor(rand() * 18) + 2;

    const addressNumber = Math.floor(rand() * 450) + 1;
    const address = `#${addressNumber}, ${selectedHub.name}, ${
      isBengaluru ? "Bengaluru" : "Mysuru"
    }`;

    companies.push({
      id: `${regionId}-company-${i + 1}`,
      name: companyName,
      regionId,
      coordinates: [Number(lng.toFixed(5)), Number(lat.toFixed(5))],
      industry,
      tier,
      employeeCount,
      address,
      hub: selectedHub.name,
      revenueEst: tier === "High" ? "$10M-$50M" : tier === "Mid" ? "$2M-$10M" : "<$2M",
      website: `https://${companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.io`,
    });
  }

  return companies;
}
