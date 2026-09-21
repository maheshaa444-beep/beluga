"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductRepository } from "@/features/products/memory-repository";
import type { Product, ProductValues } from "@/features/products/schema";

type DrawerState =
  | { mode: "closed" }
  | { mode: "create" }
  | { mode: "edit"; productId: string };

type ProductsContextValue = {
  products: Product[];
  loading: boolean;
  selectedId: string | null;
  hoveredRegionId: string | null;
  search: string;
  drawer: DrawerState;
  panelOpen: boolean;
  commandOpen: boolean;
  setSearch: (value: string) => void;
  selectProduct: (id: string | null) => void;
  setHoveredRegionId: (id: string | null) => void;
  openCreate: () => void;
  openEdit: (id: string) => void;
  closeDrawer: () => void;
  setPanelOpen: (open: boolean) => void;
  setCommandOpen: (open: boolean) => void;
  saveProduct: (input: ProductValues, id?: string) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  filtered: Product[];
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlProductId = searchParams?.get("product") ?? null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState<DrawerState>({ mode: "closed" });
  const [panelOpen, setPanelOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const selectedId = urlProductId ?? activeId;

  const selectProduct = useCallback(
    (id: string | null) => {
      setActiveId(id);
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (id) {
        params.set("product", id);
      } else {
        params.delete("product");
      }
      const newQuery = params.toString();
      const newUrl = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const refresh = useCallback(async () => {
    const list = await getProductRepository().list();
    setProducts(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void getProductRepository()
        .list()
        .then((list) => {
          if (cancelled) {
            return;
          }
          setProducts(list);
          setLoading(false);
        });
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return products;
    }
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.description,
        product.category,
        ...product.keywords,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [products, search]);

  const saveProduct = useCallback(
    async (input: ProductValues, id?: string) => {
      const repo = getProductRepository();
      if (id) {
        await repo.update(id, input);
      } else {
        const created = await repo.create(input);
        selectProduct(created.id);
      }
      await refresh();
      setDrawer({ mode: "closed" });
    },
    [refresh, selectProduct],
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      await getProductRepository().delete(id);
      if (selectedId === id) {
        selectProduct(null);
      }
      await refresh();
      setDrawer({ mode: "closed" });
    },
    [refresh, selectProduct, selectedId],
  );

  const value: ProductsContextValue = {
    products,
    loading,
    selectedId,
    hoveredRegionId,
    search,
    drawer,
    panelOpen,
    commandOpen,
    setSearch,
    selectProduct,
    setHoveredRegionId,
    openCreate: () => setDrawer({ mode: "create" }),
    openEdit: (id) => setDrawer({ mode: "edit", productId: id }),
    closeDrawer: () => setDrawer({ mode: "closed" }),
    setPanelOpen,
    setCommandOpen,
    saveProduct,
    deleteProduct,
    filtered,
  };

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts must be used within ProductsProvider");
  }
  return ctx;
}
