"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, MapPin, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useMapApi } from "@/components/map/BaseMap";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { useProducts } from "@/features/products/products-context";
import { getRegionRepository } from "@/features/regions/memory-repository";
import type { Region } from "@/features/regions/schema";
import { panelSlide, springPanel } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function RegionSelectorPanel() {
  const router = useRouter();
  const { map } = useMapApi();
  const { selectedId, products, setHoveredRegionId } = useProducts();

  const [userToggledOpen, setUserToggledOpen] = useState<boolean | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const listboxId = useId();

  const selectedProduct = useMemoProduct(products, selectedId);
  const open = userToggledOpen ?? Boolean(selectedProduct);

  useEffect(() => {
    let cancelled = false;
    void getRegionRepository()
      .list()
      .then((list) => {
        if (!cancelled) {
          setRegions(list);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const closeDropdown = useCallback(() => {
    setUserToggledOpen(false);
    setFocusedIndex(-1);
    setHoveredRegionId(null);
  }, [setHoveredRegionId]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        closeDropdown();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDropdown, open]);

  const maxCount = useMemo(() => {
    if (regions.length === 0) return 1;
    return Math.max(...regions.map((r) => r.companyCount));
  }, [regions]);

  const handleSelectRegion = useCallback(
    (region: Region) => {
      closeDropdown();
      if (!selectedProduct) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (map) {
        const isDesktop = window.innerWidth >= 1024;
        map.fitBounds(region.bounds, {
          padding: {
            top: 90,
            bottom: 60,
            left: isDesktop ? 460 : 60,
            right: isDesktop ? 360 : 60,
          },
          maxZoom: 11,
          duration: reduced ? 0 : 1200,
          essential: true,
        });
      }

      const targetUrl = `/product/${selectedProduct.id}/region/${region.slug}`;
      const delay = reduced || !map ? 0 : 1200;

      window.setTimeout(() => {
        router.push(targetUrl);
      }, delay);
    },
    [closeDropdown, map, router, selectedProduct],
  );

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (!open || regions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = (focusedIndex + 1) % regions.length;
      setFocusedIndex(next);
      setHoveredRegionId(regions[next].id);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (focusedIndex - 1 + regions.length) % regions.length;
      setFocusedIndex(prev);
      setHoveredRegionId(regions[prev].id);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < regions.length) {
        handleSelectRegion(regions[focusedIndex]);
      }
    }
  };

  return (
    <motion.aside
      ref={containerRef}
      className="pointer-events-auto absolute top-20 right-4 z-30 w-[min(22rem,calc(100vw-2rem))] focus-within:z-40"
      initial="hidden"
      animate="visible"
      variants={panelSlide}
    >
      <GlassPanel className="p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" /> Region Selector
            </span>
            {selectedProduct ? (
              <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-cyan-400">
                ACTIVE
              </span>
            ) : null}
          </div>

          {!selectedProduct ? (
            <div className="space-y-1 rounded-lg border border-dashed border-border/80 bg-surface-1/40 p-2.5 text-center">
              <p className="text-xs text-muted-foreground">
                Select a product first
              </p>
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="w-full justify-between opacity-50 cursor-not-allowed"
                aria-disabled="true"
              >
                <span>Select region</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Button
                type="button"
                variant="default"
                size="default"
                className="w-full justify-between shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                aria-expanded={open}
                aria-haspopup="listbox"
                aria-controls={listboxId}
                aria-label="Select target region for current product"
                onClick={() => {
                  setUserToggledOpen(!open);
                  if (!open) {
                    setFocusedIndex(0);
                    if (regions.length > 0) {
                      setHoveredRegionId(regions[0].id);
                    }
                  }
                }}
              >
                <span className="flex items-center gap-2 truncate">
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span>Select region</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    open && "rotate-180",
                  )}
                />
              </Button>

              <AnimatePresence>
                {open ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 4, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={springPanel}
                    className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl border border-cyan-500/40 bg-surface-2/95 p-3 shadow-2xl backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between px-1 pb-2 border-b border-border/60">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                        Select region ({regions.length})
                      </p>
                    </div>

                    <ul
                      id={listboxId}
                      ref={listRef}
                      role="listbox"
                      tabIndex={0}
                      aria-label="Available regions"
                      className={cn(
                        "mt-2 space-y-2 outline-none focus-visible:ring-1 focus-visible:ring-cyan-400",
                        regions.length > 6 && "max-h-64 overflow-y-auto pr-1",
                      )}
                      onKeyDown={handleListKeyDown}
                    >
                      {loading ? (
                        <li className="px-3 py-3 font-mono text-xs text-muted-foreground text-center">
                          Loading regions...
                        </li>
                      ) : regions.length === 0 ? (
                        <li className="px-3 py-3 font-mono text-xs text-muted-foreground text-center">
                          No regions available
                        </li>
                      ) : (
                        regions.map((region, idx) => {
                          const isFocused = focusedIndex === idx;
                          const pct = Math.round(
                            (region.companyCount / maxCount) * 100,
                          );

                          return (
                            <li
                              key={region.id}
                              role="option"
                              aria-selected={isFocused}
                              className={cn(
                                "group relative cursor-pointer rounded-xl border p-3 transition-all outline-none",
                                isFocused
                                  ? "border-cyan-400 bg-surface-3/95 shadow-[0_0_18px_rgba(34,211,238,0.22)]"
                                  : "border-border/70 bg-surface-1/70 hover:border-cyan-500/40 hover:bg-surface-2",
                              )}
                              onMouseEnter={() => {
                                setFocusedIndex(idx);
                                setHoveredRegionId(region.id);
                              }}
                              onMouseLeave={() => setHoveredRegionId(null)}
                              onClick={() => handleSelectRegion(region)}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-foreground group-hover:text-cyan-300">
                                  {region.name}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-xs font-bold text-cyan-400">
                                    {region.companyCount.toLocaleString()}{" "}
                                    <span className="text-[10px] text-muted-foreground font-normal">
                                      companies
                                    </span>
                                  </span>
                                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                              </div>

                              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-cyan-500/20">
                                <div
                                  className="h-full rounded-full bg-cyan-400 transition-all duration-300 group-hover:bg-cyan-300"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          )}
        </div>
      </GlassPanel>
    </motion.aside>
  );
}

function useMemoProduct(
  products: { id: string; name: string }[],
  selectedId: string | null,
) {
  return products.find((p) => p.id === selectedId) ?? null;
}
