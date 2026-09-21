"use client";

import { useEffect } from "react";
import { PackagePlus, Search } from "lucide-react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Kbd } from "@/components/ui/kbd";
import { useProducts } from "./products-context";

export function CommandPalette() {
  const {
    commandOpen,
    setCommandOpen,
    openCreate,
    setPanelOpen,
    setSearch,
  } = useProducts();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(!commandOpen);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  if (!commandOpen) {
    return null;
  }

  const run = (action: () => void) => {
    action();
    setCommandOpen(false);
  };

  return (
    <div
      className="pointer-events-auto absolute inset-0 z-50 flex items-start justify-center bg-background/50 pt-[18vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setCommandOpen(false)}
    >
      <GlassPanel
        className="w-[min(28rem,calc(100vw-2rem))] overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="border-b border-border px-3 py-2 font-mono text-[11px] text-muted-foreground">
          Commands
        </p>
        <ul className="p-1">
          <li>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:ring-2 focus-visible:ring-accent/50"
              onClick={() =>
                run(() => {
                  setPanelOpen(true);
                  openCreate();
                })
              }
            >
              <span className="inline-flex items-center gap-2">
                <PackagePlus className="h-4 w-4 text-accent" />
                Add product
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:ring-2 focus-visible:ring-accent/50"
              onClick={() =>
                run(() => {
                  setPanelOpen(true);
                  setSearch("");
                  window.setTimeout(() => {
                    document.getElementById("product-search")?.focus();
                  }, 30);
                })
              }
            >
              <span className="inline-flex items-center gap-2">
                <Search className="h-4 w-4 text-muted" />
                Search products
              </span>
              <Kbd>/</Kbd>
            </button>
          </li>
        </ul>
      </GlassPanel>
    </div>
  );
}
