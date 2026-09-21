"use client";

import { getDataFootprint } from "@/lib/geo/footprint";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Kbd } from "@/components/ui/kbd";
import { useProducts } from "@/features/products/products-context";
import { useMemo } from "react";

export function TopBar() {
  const { setCommandOpen } = useProducts();
  const footprint = useMemo(() => getDataFootprint(), []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 p-3 sm:p-4">
      <GlassPanel className="pointer-events-auto flex items-center gap-3 px-3 py-2">
        <span
          aria-hidden
          className="flex h-7 w-7 items-center justify-center rounded-md border border-accent/25 bg-accent/10"
        >
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_var(--accent)]" />
        </span>
        <span className="text-sm font-semibold tracking-tight">Prospect Map</span>
      </GlassPanel>

      <div className="pointer-events-auto flex items-center gap-2">
        <GlassPanel className="flex items-center gap-2 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent/80" />
          <p className="font-mono text-[11px] text-muted-foreground">
            {footprint.regionCount} regions · {footprint.companyCount.toLocaleString()}{" "}
            companies
          </p>
        </GlassPanel>
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          className="rounded-xl border border-border bg-surface-2/55 px-3 py-2 text-left text-xs text-muted-foreground backdrop-blur-xl hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent/50"
          aria-label="Open command palette"
        >
          <span className="hidden sm:inline">Commands </span>
          <Kbd>⌘</Kbd> <Kbd>K</Kbd>
        </button>
      </div>
    </header>
  );
}
