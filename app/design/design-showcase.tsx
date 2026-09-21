"use client";

import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Kbd } from "@/components/ui/kbd";
import { SectionHeader } from "@/components/ui/section-header";
import { Skeleton } from "@/components/ui/skeleton";
import { TierBadge } from "@/components/ui/tier-badge";
import { fadeUp, panelSlide, stagger } from "@/lib/motion";

const surfaces = [
  { name: "surface-1", className: "bg-surface-1" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "surface-3", className: "bg-surface-3" },
] as const;

export function DesignShowcase() {
  return (
    <div className="min-h-svh bg-[radial-gradient(80%_50%_at_10%_0%,rgb(34_211_238/0.08),transparent_50%),linear-gradient(180deg,#050506,#0c0c0e)] px-4 py-12 sm:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <SectionHeader
          eyebrow="Design system"
          title="Prospect Map primitives"
          description="Black surfaces, one cyan accent, priority tiers, glass, and spring motion. Development only."
        />

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">Surfaces</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {surfaces.map((surface) => (
              <div
                key={surface.name}
                className={`rounded-lg border border-border p-4 ${surface.className}`}
              >
                <p className="font-mono text-xs text-muted-foreground">
                  {surface.name}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Hierarchy:{" "}
            <span className="text-foreground">primary</span> /{" "}
            <span className="text-muted">muted</span> /{" "}
            <span className="text-muted-foreground">secondary</span>
            <span className="ml-3 font-mono text-accent">score 87</span>
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">GlassPanel</h3>
          <GlassPanel className="p-6">
            <p className="text-sm text-foreground">
              Blurred panel with a hairline border and a faint cyan glow.
            </p>
          </GlassPanel>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">Button</h3>
          <div className="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="subtle">Subtle</Button>
            <Button size="sm">Small</Button>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">TierBadge</h3>
          <div className="flex flex-wrap gap-2">
            <TierBadge tier="high" />
            <TierBadge tier="mid" />
            <TierBadge tier="least" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">Skeleton</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-72" />
            <Skeleton className="h-16 w-full" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">Kbd</h3>
          <p className="text-sm text-muted-foreground">
            Open command palette <Kbd>⌘</Kbd> <Kbd>K</Kbd>
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">EmptyState</h3>
          <GlassPanel>
            <EmptyState
              icon={MapPinned}
              title="No region selected"
              description="Pick a product and a region to load the map."
              action={
                <Button variant="outline" size="sm">
                  Choose region
                </Button>
              }
            />
          </GlassPanel>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-medium text-muted">SectionHeader</h3>
          <SectionHeader
            eyebrow="Priorities"
            title="Companies in this region"
            description="Ranked for the active product."
            action={
              <Button variant="ghost" size="sm">
                Export
              </Button>
            }
          />
        </section>

        <section className="space-y-6">
          <h3 className="text-sm font-medium text-muted">Motion presets</h3>
          <motion.div
            className="grid gap-3 sm:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {["Alpha", "Bravo", "Charlie"].map((label) => (
              <motion.div key={label} variants={fadeUp}>
                <GlassPanel className="p-4">
                  <p className="font-mono text-xs text-accent">fadeUp</p>
                  <p className="mt-1 text-sm">{label}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={panelSlide}>
            <GlassPanel className="ml-auto w-full max-w-sm p-4">
              <p className="font-mono text-xs text-accent">panelSlide</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Right-side panel entrance.
              </p>
            </GlassPanel>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
