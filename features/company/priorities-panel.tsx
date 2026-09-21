"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, X, Sparkles } from "lucide-react";
import type { Company } from "./schema";
import type { CompanyMatch, MatchTier } from "@/features/matching/schema";

type PrioritiesPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  matches: CompanyMatch[];
  companiesMap: Map<string, Company>;
  onSelectCompany: (companyId: string) => void;
  isLoading?: boolean;
};

export function PrioritiesPanel({
  isOpen,
  onClose,
  matches,
  companiesMap,
  onSelectCompany,
  isLoading = false,
}: PrioritiesPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<MatchTier, boolean>>({
    High: true,
    Mid: true,
    Least: false,
  });

  const [pageLimits, setPageLimits] = useState<Record<MatchTier, number>>({
    High: 10,
    Mid: 10,
    Least: 10,
  });

  if (!isOpen) return null;

  const toggleSection = (tier: MatchTier) => {
    setExpandedSections((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  const loadMore = (tier: MatchTier) => {
    setPageLimits((prev) => ({ ...prev, [tier]: prev[tier] + 10 }));
  };

  const highMatches = matches.filter((m) => m.tier === "High");
  const midMatches = matches.filter((m) => m.tier === "Mid");
  const leastMatches = matches.filter((m) => m.tier === "Least");

  const sections: { tier: MatchTier; label: string; matches: CompanyMatch[]; colorClass: string; dotClass: string }[] = [
    { tier: "High", label: "High Priority", matches: highMatches, colorClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" },
    { tier: "Mid", label: "Mid Priority", matches: midMatches, colorClass: "text-amber-400 border-amber-500/30 bg-amber-500/10", dotClass: "bg-amber-400" },
    { tier: "Least", label: "Least Priority", matches: leastMatches, colorClass: "text-slate-400 border-slate-500/30 bg-slate-500/10", dotClass: "bg-slate-400" },
  ];

  return (
    <aside className="fixed bottom-0 right-0 top-0 z-40 flex w-full max-w-md flex-col border-l border-border bg-surface-2/95 shadow-2xl backdrop-blur-xl transition-all sm:w-96 max-sm:h-[80vh] max-sm:top-auto max-sm:rounded-t-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" />
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Priorities Engine
          </h2>
          <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-400">
            {matches.length} Total
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-1 hover:text-foreground"
          aria-label="Close priorities panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-surface-1 border border-border/50"
              />
            ))}
          </div>
        ) : (
          sections.map((section) => {
            const isExpanded = expandedSections[section.tier];
            const limit = pageLimits[section.tier];
            const visibleMatches = section.matches.slice(0, limit);
            const hasMore = section.matches.length > limit;

            return (
              <div
                key={section.tier}
                className="rounded-xl border border-border/80 bg-surface-1/50 overflow-hidden"
              >
                {/* Section Accordion Header */}
                <button
                  onClick={() => toggleSection(section.tier)}
                  className="flex w-full items-center justify-between p-3 transition-colors hover:bg-surface-1/80"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${section.dotClass}`} />
                    <span className="text-xs font-semibold text-foreground">
                      {section.label}
                    </span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${section.colorClass}`}
                    >
                      {section.matches.length}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {/* Section Companies List */}
                {isExpanded ? (
                  <div className="border-t border-border/50 divide-y divide-border/40">
                    {section.matches.length === 0 ? (
                      <p className="p-3 font-mono text-xs text-muted-foreground text-center">
                        No companies in this tier
                      </p>
                    ) : (
                      visibleMatches.map((match, idx) => {
                        const company = companiesMap.get(match.companyId);
                        if (!company) return null;

                        return (
                          <div
                            key={match.companyId}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectCompany(match.companyId)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onSelectCompany(match.companyId);
                              }
                            }}
                            className="flex items-center justify-between p-3 transition-colors hover:bg-surface-2/80 cursor-pointer group outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <span className="font-mono text-xs text-muted-foreground w-5 text-right shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-foreground truncate group-hover:text-cyan-400 transition-colors">
                                  {company.name}
                                </p>
                                <p className="font-mono text-[10px] text-muted-foreground truncate">
                                  {company.industry} • {company.hub}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 font-mono text-xs font-bold text-cyan-400">
                                {match.score}%
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}

                    {hasMore ? (
                      <button
                        onClick={() => loadMore(section.tier)}
                        className="w-full py-2.5 text-center font-mono text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                      >
                        Show more (+10)
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
