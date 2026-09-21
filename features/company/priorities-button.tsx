"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export function PrioritiesButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        disabled
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border/60 bg-surface-2/60 px-3.5 py-1.5 font-mono text-xs font-medium text-muted-foreground opacity-70 transition-all"
        aria-label="Priorities feature"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-400/70" />
        <span>Priorities</span>
        <span className="rounded-full bg-surface-1 px-1.5 py-0.5 text-[10px] text-muted-foreground">
          Soon
        </span>
      </button>

      {showTooltip ? (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border bg-surface-2/95 p-2.5 text-center text-xs text-muted-foreground shadow-xl backdrop-blur-md">
          <p className="font-semibold text-foreground">AI Prioritization Tiers</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Automated tier scoring coming in Phase 3.
          </p>
        </div>
      ) : null}
    </div>
  );
}
