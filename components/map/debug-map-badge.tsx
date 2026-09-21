"use client";

import { useEffect, useState } from "react";
import { useMapApi } from "@/components/map/BaseMap";
import { getDataFootprint } from "@/lib/geo/footprint";
import { useIsMounted } from "@/lib/hooks/use-is-debug";

export function DebugMapBadge({ isDebug }: { isDebug: boolean }) {
  const { map, ready } = useMapApi();
  const mounted = useIsMounted();
  const [collapsed, setCollapsed] = useState(false);
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [layerCount, setLayerCount] = useState(0);
  const [sources, setSources] = useState<string[]>([]);
  const [tileOk, setTileOk] = useState(0);
  const [tileFailed, setTileFailed] = useState(0);
  const [sourcedataCount, setSourcedataCount] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!map) {
      return;
    }

    const stallTimer = window.setTimeout(() => {
      if (!map.isStyleLoaded()) {
        setIsStalled(true);
      }
    }, 8000);

    const updateState = () => {
      try {
        const loaded = Boolean(map.isStyleLoaded());
        setStyleLoaded(loaded);
        if (loaded) {
          setIsStalled(false);
        }
        const style = map.getStyle();
        setLayerCount(style?.layers?.length ?? 0);
        setSources(Object.keys(style?.sources ?? {}));
        const container = map.getContainer();
        if (container) {
          setCanvasSize({
            w: container.clientWidth,
            h: container.clientHeight,
          });
        }
      } catch (err) {
        setLastError(String(err));
      }
    };

    const onLoad = () => {
      console.log("[Prospect Map] Map event: load");
      updateState();
    };

    const onStyleData = () => {
      console.log("[Prospect Map] Map event: styledata");
      updateState();
    };

    const onSourceData = (e: {
      dataType?: string;
      sourceId?: string;
      source?: { id?: string };
      tile?: unknown;
      isSourceLoaded?: boolean;
    }) => {
      const srcId = e.sourceId || e.source?.id || "unknown";
      console.log("[Prospect Map] Map event: sourcedata", srcId);
      setSourcedataCount((c) => c + 1);
      if (e.tile !== undefined || e.isSourceLoaded) {
        setTileOk((c) => c + 1);
      }
      updateState();
    };

    const onError = (e: { error?: Error | { message?: string } }) => {
      const msg = e.error?.message || String(e.error ?? "Map error");
      console.error("[Prospect Map] Map event: error", e.error || e);
      setLastError(msg);
      setTileFailed((c) => c + 1);
    };

    const errorHandler = (e: unknown) =>
      onError(e as { error?: Error | { message?: string } });
    const sourceDataHandler = (e: unknown) =>
      onSourceData(
        e as {
          dataType?: string;
          sourceId?: string;
          source?: { id?: string };
          tile?: unknown;
          isSourceLoaded?: boolean;
        },
      );

    map.on("load", onLoad);
    map.on("styledata", onStyleData);
    map.on("sourcedata", sourceDataHandler);
    map.on("idle", updateState);
    map.on("error", errorHandler);

    updateState();

    return () => {
      window.clearTimeout(stallTimer);
      map.off("load", onLoad);
      map.off("styledata", onStyleData);
      map.off("sourcedata", sourceDataHandler);
      map.off("idle", updateState);
      map.off("error", errorHandler);
    };
  }, [map]);

  const isDev = process.env.NODE_ENV === "development";
  const shouldShow = mounted && (isDev || isDebug);

  if (!shouldShow) {
    return null;
  }

  if (collapsed) {
    return (
      <aside
        className="pointer-events-auto absolute bottom-9 right-3 z-50 flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-surface-2/95 px-2.5 py-1.5 font-mono text-[11px] text-foreground shadow-2xl backdrop-blur-md"
        aria-label="Map debug info summary"
      >
        <span className="font-bold text-accent">MAP DIAGS</span>
        <span className="text-emerald-400">OK: {tileOk}</span>
        {tileFailed > 0 ? (
          <span className="font-bold text-red-400">Failed: {tileFailed}</span>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="ml-1 rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Expand map diagnostics"
        >
          Expand
        </button>
      </aside>
    );
  }

  const footprint = getDataFootprint();
  const totalPoints = footprint.clusters.reduce(
    (acc, c) => acc + c.points.length,
    0,
  );

  return (
    <aside
      className="pointer-events-auto absolute bottom-9 right-3 z-50 rounded-lg border border-cyan-500/40 bg-surface-2/95 p-2.5 font-mono text-[11px] text-foreground shadow-2xl backdrop-blur-md"
      aria-label="Map debug info"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-1 font-bold text-accent">
        <span>MAP DIAGNOSTICS</span>
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-accent/20 px-1 py-0.5 text-[10px] uppercase">
            {isDebug ? "DEBUG MODE" : "DEV"}
          </span>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            className="rounded bg-surface-3 px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Collapse map diagnostics"
          >
            Collapse
          </button>
        </div>
      </div>
      <div className="mt-1.5 space-y-1 text-muted-foreground">
        <p>
          Style Loaded:{" "}
          <span
            className={
              isStalled
                ? "font-bold text-red-500"
                : styleLoaded
                  ? "font-semibold text-emerald-400"
                  : ready
                    ? "text-amber-400"
                    : "text-amber-400"
            }
          >
            {isStalled ? "STALLED (8s)" : styleLoaded ? "YES" : "NO"}
          </span>
        </p>
        <p>
          Layers: <span className="text-foreground">{layerCount}</span>
        </p>
        <p>
          Sources:{" "}
          <span className="text-foreground">
            {sources.length > 0 ? sources.join(", ") : "none"}
          </span>
        </p>
        <p>
          Source Data Events:{" "}
          <span className="text-foreground">{sourcedataCount}</span>
        </p>
        <p>
          Tile Requests:{" "}
          <span className="text-emerald-400">OK: {tileOk}</span> |{" "}
          <span
            className={
              tileFailed > 0 ? "font-semibold text-red-400" : "text-foreground"
            }
          >
            Failed: {tileFailed}
          </span>
        </p>
        <p>
          Footprint Source: <span className="text-emerald-400">YES</span> (
          {totalPoints} points)
        </p>
        <p>
          Canvas Bounds:{" "}
          <span className="text-foreground">
            {canvasSize.w} x {canvasSize.h} px
          </span>
        </p>
        {lastError ? (
          <p className="max-w-[280px] truncate font-semibold text-red-400">
            Last Error: {lastError}
          </p>
        ) : (
          <p className="text-emerald-400/70">Last Error: None</p>
        )}
      </div>
    </aside>
  );
}
