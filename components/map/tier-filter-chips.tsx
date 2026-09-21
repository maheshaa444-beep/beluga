"use client";

import type { MatchTier } from "@/features/matching/schema";

type TierFilterChipsProps = {
  activeTierFilter: "All" | MatchTier;
  onSelectFilter: (tier: "All" | MatchTier) => void;
  counts: {
    all: number;
    high: number;
    mid: number;
    least: number;
  };
};

export function TierFilterChips({
  activeTierFilter,
  onSelectFilter,
  counts,
}: TierFilterChipsProps) {
  const filters: { id: "All" | MatchTier; label: string; count: number; colorClass?: string }[] = [
    { id: "All", label: "All Tiers", count: counts.all },
    { id: "High", label: "High", count: counts.high, colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { id: "Mid", label: "Mid", count: counts.mid, colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { id: "Least", label: "Least", count: counts.least, colorClass: "text-slate-400 bg-slate-500/10 border-slate-500/30" },
  ];

  return (
    <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-surface-2/90 p-1.5 shadow-2xl backdrop-blur-xl">
      {filters.map((f) => {
        const isActive = activeTierFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelectFilter(f.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs transition-all ${
              isActive
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.25)] font-semibold"
                : "text-muted-foreground hover:bg-surface-1 hover:text-foreground border border-transparent"
            }`}
          >
            <span>{f.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] ${
                f.colorClass || "bg-surface-1 text-muted-foreground"
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
