"use client";

import { Suspense, type ReactNode } from "react";
import { BaseMap } from "@/components/map/BaseMap";
import { MapWorkspaceProvider } from "@/components/map/map-workspace-context";
import { ProductsProvider } from "@/features/products/products-context";
import { KARNATAKA_CENTER, KARNATAKA_ZOOM } from "@/lib/geo/karnataka";

export default function MapLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-svh w-full items-center justify-center bg-background font-mono text-xs text-muted-foreground">
          Loading Prospect Map...
        </div>
      }
    >
      <ProductsProvider>
        <MapWorkspaceProvider>
          <main className="relative h-svh w-full overflow-hidden bg-background">
            <BaseMap
              initialCenter={KARNATAKA_CENTER}
              initialZoom={KARNATAKA_ZOOM}
              enableAmbientDrift
            >
              {children}
            </BaseMap>
          </main>
        </MapWorkspaceProvider>
      </ProductsProvider>
    </Suspense>
  );
}
