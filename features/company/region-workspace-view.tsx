"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";
import type { Product } from "@/features/products/schema";
import type { Region } from "@/features/regions/schema";
import type { Company } from "@/features/company/schema";
import type { CompanyMatch, MatchTier } from "@/features/matching/schema";
import { RegionBoundaryLayer } from "@/components/map/region-boundary-layer";
import { CompanyPinsLayer } from "@/components/map/company-pins-layer";
import { TierFilterChips } from "@/components/map/tier-filter-chips";
import { ProductSwitcher } from "./product-switcher";
import { PrioritiesPanel } from "./priorities-panel";
import { CompanyDetailView } from "./company-detail-view";

type RegionWorkspaceViewProps = {
  product: Product;
  allProducts: Product[];
  region: Region;
  companies: Company[];
  matches: CompanyMatch[];
};

function RegionWorkspaceViewContent({
  product,
  allProducts,
  region,
  companies,
  matches,
}: RegionWorkspaceViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTierFilter, setActiveTierFilter] = useState<"All" | MatchTier>("All");
  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState(true);

  const selectedCompanyId = searchParams.get("company");

  const companiesMap = useMemo(() => {
    const map = new Map<string, Company>();
    for (const c of companies) map.set(c.id, c);
    return map;
  }, [companies]);

  const matchesMap = useMemo(() => {
    const map = new Map<string, CompanyMatch>();
    for (const m of matches) map.set(m.companyId, m);
    return map;
  }, [matches]);

  const selectedCompany = useMemo(() => {
    if (!selectedCompanyId) return null;
    return companiesMap.get(selectedCompanyId) ?? null;
  }, [companiesMap, selectedCompanyId]);

  const selectedMatch = useMemo(() => {
    if (!selectedCompanyId) return null;
    return matchesMap.get(selectedCompanyId) ?? null;
  }, [matchesMap, selectedCompanyId]);

  const counts = useMemo(() => {
    let high = 0;
    let mid = 0;
    let least = 0;
    for (const m of matches) {
      if (m.tier === "High") high++;
      else if (m.tier === "Mid") mid++;
      else if (m.tier === "Least") least++;
    }
    return { all: matches.length, high, mid, least };
  }, [matches]);

  const handleSelectCompany = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set("company", id);
    } else {
      params.delete("company");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleBackToPriorities = () => {
    handleSelectCompany(null);
    setIsPrioritiesOpen(true);
  };

  return (
    <>
      {/* Map Layers mounted into persistent BaseMap */}
      <RegionBoundaryLayer region={region} />
      <CompanyPinsLayer
        companies={companies}
        matchesMap={matchesMap}
        selectedCompanyId={selectedCompanyId}
        activeTierFilter={activeTierFilter}
        onSelectCompany={handleSelectCompany}
      />

      {/* Persistent Controls & Overlays over Map */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 lg:p-6">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Controls */}
          <div className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface-2/90 px-3.5 py-2 shadow-2xl backdrop-blur-xl">
            <Link
              href={`/?product=${encodeURIComponent(product.id)}`}
              className="group flex items-center gap-1 rounded-lg border border-border/60 bg-surface-1/80 px-2 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-cyan-500/40 hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-cyan-400" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            <div className="h-4 w-px bg-border" />

            <ProductSwitcher
              activeProduct={product}
              products={allProducts}
              regionSlug={region.slug}
            />

            <div className="h-4 w-px bg-border" />

            <span className="font-mono text-xs font-bold text-foreground truncate max-w-[100px] sm:max-w-none">
              {region.name}
            </span>
          </div>

          {/* Right Controls */}
          <div className="pointer-events-auto flex items-center gap-2.5">
            <TierFilterChips
              activeTierFilter={activeTierFilter}
              onSelectFilter={setActiveTierFilter}
              counts={counts}
            />

            <button
              onClick={() => setIsPrioritiesOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl transition-all ${
                isPrioritiesOpen && !selectedCompany
                  ? "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "border-border/80 bg-surface-2/90 text-foreground hover:border-cyan-500/40"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Priorities</span>
            </button>
          </div>
        </div>

        {/* Bottom Left Stats Summary Card */}
        <div className="pointer-events-auto max-w-xs sm:max-w-sm rounded-2xl border border-border/80 bg-surface-2/90 p-3.5 shadow-2xl backdrop-blur-xl space-y-2.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                {product.name} Matches
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400">
              {companies.length} Cos
            </span>
          </div>

          {/* Real Product Tier Distribution */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5">
              <p className="text-[9px] text-emerald-400 font-semibold uppercase">High</p>
              <p className="text-xs font-bold text-emerald-400">{counts.high}</p>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-1.5">
              <p className="text-[9px] text-amber-400 font-semibold uppercase">Mid</p>
              <p className="text-xs font-bold text-amber-400">{counts.mid}</p>
            </div>
            <div className="rounded-lg border border-slate-500/30 bg-slate-500/10 p-1.5">
              <p className="text-[9px] text-slate-400 font-semibold uppercase">Least</p>
              <p className="text-xs font-bold text-slate-400">{counts.least}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Sliding Panel: Either Detail View or Priorities Panel */}
      {selectedCompany && selectedMatch ? (
        <CompanyDetailView
          company={selectedCompany}
          match={selectedMatch}
          onBackToPriorities={handleBackToPriorities}
        />
      ) : (
        <PrioritiesPanel
          isOpen={isPrioritiesOpen}
          onClose={() => setIsPrioritiesOpen(false)}
          matches={matches}
          companiesMap={companiesMap}
          onSelectCompany={handleSelectCompany}
        />
      )}
    </>
  );
}

export function RegionWorkspaceView(props: RegionWorkspaceViewProps) {
  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-md">
          <p className="font-mono text-xs text-cyan-400">Loading prospect intelligence...</p>
        </div>
      }
    >
      <RegionWorkspaceViewContent {...props} />
    </Suspense>
  );
}
