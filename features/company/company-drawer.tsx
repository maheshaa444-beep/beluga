"use client";

import { useState } from "react";
import { X, MapPin, Users, DollarSign, Globe, PhoneCall } from "lucide-react";
import type { Company } from "./schema";

type CompanyDrawerProps = {
  company: Company | null;
  onClose: () => void;
};

export function CompanyDrawer({ company, onClose }: CompanyDrawerProps) {
  const [showCallTooltip, setShowCallTooltip] = useState(false);

  if (!company) return null;

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-surface-2/95 shadow-2xl backdrop-blur-xl transition-all sm:w-96">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-5">
        <div className="space-y-1 pr-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                company.tier === "High"
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : company.tier === "Mid"
                  ? "border border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border border-slate-500/30 bg-slate-500/10 text-slate-400"
              }`}
            >
              {company.tier} Priority
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {company.name}
          </h2>
          <p className="font-mono text-xs text-cyan-400">{company.industry}</p>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-1 hover:text-foreground"
          aria-label="Close company drawer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <div className="space-y-3 rounded-xl border border-border/70 bg-surface-1/50 p-4">
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">{company.hub}</p>
              <p className="text-[11px] text-muted-foreground">{company.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <Users className="h-4 w-4 shrink-0 text-cyan-400" />
            <span>{company.employeeCount.toLocaleString()} employees</span>
          </div>

          {company.revenueEst ? (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <DollarSign className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>Est. Revenue: {company.revenueEst}</span>
            </div>
          ) : null}

          {company.website ? (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Globe className="h-4 w-4 shrink-0 text-cyan-400" />
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-cyan-400 hover:underline"
              >
                {company.website}
              </a>
            </div>
          ) : null}
        </div>

        {/* Cold Call Research Button (Disabled for Phase 2) */}
        <div className="relative">
          <button
            disabled
            onMouseEnter={() => setShowCallTooltip(true)}
            onMouseLeave={() => setShowCallTooltip(false)}
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 py-3 font-mono text-xs font-semibold text-cyan-400 opacity-60 transition-all"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Research Company (Cold Call)</span>
          </button>

          {showCallTooltip ? (
            <div className="absolute bottom-full left-0 right-0 mb-2 rounded-lg border border-border bg-surface-2/95 p-3 text-center text-xs text-muted-foreground shadow-xl backdrop-blur-md">
              <p className="font-semibold text-foreground">Company Research & Briefings</p>
              <p className="mt-1 text-[11px]">
                AI Company Research & Cold Call Briefing engine coming in Phase 4.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
