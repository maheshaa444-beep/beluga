"use client";

import { DataFootprintLayer } from "@/components/map/data-footprint-layer";
import { RegionSelectorPanel } from "@/features/regions/region-selector-panel";
import { useIsDebug } from "@/lib/hooks/use-is-debug";
import { CommandPalette } from "./command-palette";
import { ProductsPanel } from "./products-panel";
import { useProducts } from "./products-context";
import { TopBar } from "./top-bar";

export function LandingPageContent() {
  const isDebug = useIsDebug();
  const { hoveredRegionId, setHoveredRegionId } = useProducts();

  return (
    <>
      <DataFootprintLayer
        activeRegionId={hoveredRegionId}
        onHoverRegion={setHoveredRegionId}
      />
      {!isDebug ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgb(5_5_6/0.88)_100%),linear-gradient(to_right,rgb(5_5_6/0.95)_0%,rgb(5_5_6/0.65)_20%,rgb(5_5_6/0.25)_40%,transparent_60%),linear-gradient(to_top,rgb(5_5_6/0.6)_0%,transparent_35%)]"
        />
      ) : null}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <TopBar />
        <ProductsPanel />
        <RegionSelectorPanel />
        <CommandPalette />
      </div>
    </>
  );
}

export function LandingPage() {
  return <LandingPageContent />;
}
