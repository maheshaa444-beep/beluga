"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PackagePlus, Search } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp, panelSlideLeft, springPanel, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProductForm } from "./product-form";
import { useProducts } from "./products-context";
import type { Product } from "./schema";

export function ProductsPanel() {
  const {
    loading,
    filtered,
    products,
    selectedId,
    search,
    setSearch,
    selectProduct,
    openCreate,
    openEdit,
    drawer,
    closeDrawer,
    saveProduct,
    deleteProduct,
    panelOpen,
    setPanelOpen,
  } = useProducts();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && drawer.mode !== "closed") {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer, drawer.mode]);

  const editing =
    drawer.mode === "edit"
      ? products.find((item) => item.id === drawer.productId)
      : undefined;

  return (
    <>
      <div className="pointer-events-auto absolute top-20 left-3 z-20 flex lg:hidden">
        <GlassPanel className="flex flex-col gap-1 p-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label={panelOpen ? "Hide products" : "Show products"}
            aria-expanded={panelOpen}
            onClick={() => setPanelOpen(!panelOpen)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Add product"
            onClick={() => {
              setPanelOpen(true);
              openCreate();
            }}
          >
            <PackagePlus className="h-4 w-4" />
          </Button>
        </GlassPanel>
      </div>

      <AnimatePresence>
        {panelOpen ? (
          <motion.button
            type="button"
            aria-label="Dismiss products panel"
            className="absolute inset-0 z-20 bg-background/40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "pointer-events-auto absolute top-20 bottom-4 left-3 z-30 w-[min(22rem,calc(100vw-1.5rem))] lg:block",
          panelOpen ? "block" : "hidden lg:block",
        )}
        initial="hidden"
        animate="visible"
        variants={panelSlideLeft}
      >
        <GlassPanel className="relative flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div>
              <h1 className="text-sm font-semibold tracking-tight">Products</h1>
              <p className="font-mono text-[11px] text-muted-foreground">
                {loading ? "—" : products.length} in workspace
              </p>
            </div>
            <Button size="sm" onClick={openCreate} aria-label="Add product">
              + Add product
            </Button>
          </div>
          <div className="px-4 pb-3">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <Input
              id="product-search"
              placeholder="Search products"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title={search ? "No matches" : "No products yet"}
                description={
                  search
                    ? "Try a different name, category, or keyword."
                    : "Add a product to start mapping regions."
                }
                action={
                  <Button size="sm" onClick={openCreate}>
                    Add product
                  </Button>
                }
              />
            ) : (
              <motion.ul
                className="space-y-2"
                initial="hidden"
                animate="visible"
                variants={stagger}
              >
                {filtered.map((product) => (
                  <motion.li key={product.id} variants={fadeUp}>
                    <ProductCard
                      product={product}
                      selected={product.id === selectedId}
                      onSelect={() =>
                        selectProduct(
                          product.id === selectedId ? null : product.id,
                        )
                      }
                      onEdit={() => openEdit(product.id)}
                    />
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </div>

          <AnimatePresence>
            {drawer.mode !== "closed" ? (
              <motion.div
                className="absolute inset-0 z-10 bg-surface-2/95 backdrop-blur-xl"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={springPanel}
                role="dialog"
                aria-modal="true"
                aria-label={drawer.mode === "create" ? "Add product" : "Edit product"}
              >
                <ProductForm
                  key={drawer.mode === "edit" ? drawer.productId : "create"}
                  product={editing}
                  onCancel={closeDrawer}
                  onSave={(values) =>
                    saveProduct(
                      values,
                      drawer.mode === "edit" ? drawer.productId : undefined,
                    )
                  }
                  onDelete={
                    drawer.mode === "edit"
                      ? () => deleteProduct(drawer.productId)
                      : undefined
                  }
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </GlassPanel>
      </motion.aside>
    </>
  );
}

function ProductCard({
  product,
  selected,
  onSelect,
  onEdit,
}: {
  product: Product;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-1/70 p-3 transition-shadow hover:shadow-[0_0_28px_rgba(34,211,238,0.12)]",
        selected && "border-accent/35 bg-surface-3/80 shadow-[0_0_28px_rgba(34,211,238,0.12)]",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="w-full rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{product.name}</p>
          <Badge>{product.category}</Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {product.description}
        </p>
      </button>
      {selected ? (
        <div className="mt-3 space-y-2 border-t border-border pt-3">
          <p className="text-[11px] text-muted">
            Industries{" "}
            <span className="text-foreground">
              {product.targetIndustries.join(", ")}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            {product.idealCustomer}
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={onEdit}>
              Edit
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
