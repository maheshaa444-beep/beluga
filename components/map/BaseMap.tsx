"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { addProtocol, setWorkerUrl, Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { DebugMapBadge } from "@/components/map/debug-map-badge";
import {
  buildMapStyle,
  hasConfiguredTiles,
  requiresPmtilesProtocol,
} from "@/lib/geo/mapStyle";
import { cn } from "@/lib/utils";

let pmtilesProtocolRegistered = false;

function ensurePmtilesProtocol() {
  if (pmtilesProtocolRegistered || !requiresPmtilesProtocol()) {
    return;
  }
  const protocol = new Protocol();
  addProtocol("pmtiles", protocol.tile);
  pmtilesProtocolRegistered = true;
}

import { getFootprintBounds } from "@/lib/geo/footprint";
import { useIsDebug } from "@/lib/hooks/use-is-debug";

type MapApi = {
  map: MapLibreMap | null;
  ready: boolean;
};

const MapApiContext = createContext<MapApi>({ map: null, ready: false });

export function useMapApi() {
  return useContext(MapApiContext);
}

export type BaseMapProps = {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  enableAmbientDrift?: boolean;
  children?: ReactNode;
};

export function BaseMap({
  className,
  initialCenter = [0, 20],
  initialZoom = 1.6,
  enableAmbientDrift = false,
  children,
}: BaseMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const [ready, setReady] = useState(false);
  const isDebug = useIsDebug();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    ensurePmtilesProtocol();
    setWorkerUrl("/maplibre-gl-worker.mjs");

    const debugMode = isDebug;
    const instance = new MapLibreMap({
      container: containerRef.current,
      style: buildMapStyle(debugMode),
      center: initialCenter,
      zoom: initialZoom,
      fadeDuration: 0,
      pitch: 12,
      attributionControl: { compact: true },
    });

    mapRef.current = instance;
    setMap(instance);
    instance.once("load", () => {
      instance.resize();
      const bounds = getFootprintBounds();
      if (bounds) {
        const container = containerRef.current;
        const width = container ? container.clientWidth : window.innerWidth;
        const isDesktop = width >= 1024;
        instance.fitBounds(bounds, {
          padding: {
            top: 90,
            bottom: 60,
            left: isDesktop ? 460 : 60,
            right: isDesktop ? 360 : 60,
          },
          maxZoom: 9.5,
          animate: false,
        });
      }
      setReady(true);
    });

    const observer = new ResizeObserver(() => {
      instance.resize();
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      instance.remove();
      mapRef.current = null;
      setMap(null);
      setReady(false);
    };
  }, [initialCenter, initialZoom, isDebug]);

  useEffect(() => {
    if (!map || !enableAmbientDrift || !ready) {
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      return;
    }

    const currentCenter = map.getCenter();
    const origin: [number, number] = [currentCenter.lng, currentCenter.lat];
    let cancelled = false;
    let interacting = false;
    let timer: number | undefined;
    let step = 0;

    const onInteractStart = () => {
      interacting = true;
      map.stop();
    };
    const onInteractEnd = () => {
      window.setTimeout(() => {
        interacting = false;
      }, 2400);
    };

    map.on("mousedown", onInteractStart);
    map.on("touchstart", onInteractStart);
    map.on("wheel", onInteractStart);
    map.on("dragend", onInteractEnd);
    map.on("zoomend", onInteractEnd);

    const drift = () => {
      if (cancelled) {
        return;
      }
      if (interacting || map.isMoving()) {
        timer = window.setTimeout(drift, 3200);
        return;
      }
      step += 1;
      const lng = origin[0] + Math.sin(step * 0.55) * 0.12;
      const lat = origin[1] + Math.cos(step * 0.4) * 0.07;
      map.easeTo({
        center: [lng, lat],
        duration: 16000,
        easing: (t) => t * (2 - t),
        essential: false,
      });
      map.once("moveend", () => {
        if (!cancelled) {
          timer = window.setTimeout(drift, 900);
        }
      });
    };

    timer = window.setTimeout(drift, 1400);

    return () => {
      cancelled = true;
      if (timer) {
        window.clearTimeout(timer);
      }
      map.off("mousedown", onInteractStart);
      map.off("touchstart", onInteractStart);
      map.off("wheel", onInteractStart);
      map.off("dragend", onInteractEnd);
      map.off("zoomend", onInteractEnd);
      map.stop();
    };
  }, [enableAmbientDrift, initialCenter, map, ready]);

  const value = useMemo(() => ({ map, ready }), [map, ready]);

  return (
    <MapApiContext.Provider value={value}>
      <div className={cn("relative h-full w-full bg-background", className)}>
        <div ref={containerRef} className="h-full w-full" />
        {children}
        <DebugMapBadge isDebug={isDebug} />
        {!hasConfiguredTiles() ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center px-4">
            <p className="rounded-md border border-border bg-surface-2/80 px-3 py-1.5 text-center font-mono text-[11px] text-muted-foreground backdrop-blur-md">
              Set NEXT_PUBLIC_PROTOMAPS_API_KEY or NEXT_PUBLIC_MAP_TILES_URL
            </p>
          </div>
        ) : null}
      </div>
    </MapApiContext.Provider>
  );
}
