"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Sparkles } from "lucide-react";
import type { Product } from "@/features/products/schema";

type ProductSwitcherProps = {
  activeProduct: Product;
  products: Product[];
  regionSlug: string;
};

export function ProductSwitcher({
  activeProduct,
  products,
  regionSlug,
}: ProductSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSelect = (productId: string) => {
    setOpen(false);
    if (productId === activeProduct.id) return;
    router.push(`/product/${productId}/region/${regionSlug}`);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all hover:bg-cyan-500/20"
        aria-expanded={open}
        aria-label="Switch product"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="truncate max-w-[140px]">{activeProduct.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-xl border border-cyan-500/30 bg-surface-2/95 p-1.5 shadow-2xl backdrop-blur-xl">
          <p className="px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">
            Switch Target Product
          </p>
          <div className="space-y-0.5">
            {products.map((p) => {
              const isSelected = p.id === activeProduct.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                      : "text-muted-foreground hover:bg-surface-1 hover:text-foreground"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {p.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
