"use client";

import { Marker } from "maplibre-gl";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useMapApi } from "@/components/map/BaseMap";
import { GlassPanel } from "@/components/ui/glass-panel";
import {
  getDataFootprint,
  getFootprintBounds,
  type DataFootprintCluster,
} from "@/lib/geo/footprint";
import { cn } from "@/lib/utils";

export type DataFootprintLayerProps = {
  activeRegionId?: string | null;
  onHoverRegion?: (regionId: string | null) => void;
  onSelectRegion?: (regionId: string) => void;
};

export function DataFootprintLayer({
  activeRegionId,
  onHoverRegion,
  onSelectRegion,
}: DataFootprintLayerProps) {
  const { map, ready } = useMapApi();
  const footprint = useMemo(() => getDataFootprint(), []);
  const [hovered, setHovered] = useState<DataFootprintCluster | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!map || !ready) return;

    const bounds = getFootprintBounds();
    if (bounds) {
      const isDesktop = window.innerWidth >= 1024;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      map.fitBounds(bounds, {
        padding: {
          top: 90,
          bottom: 60,
          left: isDesktop ? 460 : 60,
          right: isDesktop ? 360 : 60,
        },
        maxZoom: 9.5,
        duration: reduced ? 0 : 1200,
        essential: true,
      });
    }
  }, [map, ready]);

  useEffect(() => {
    if (!map || !ready) {
      return;
    }

    const markers: Marker[] = [];
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const toViewport = (lng: number, lat: number) => {
      const projected = map.project([lng, lat]);
      const rect = map.getContainer().getBoundingClientRect();
      return { x: rect.left + projected.x, y: rect.top + projected.y };
    };

    for (const cluster of footprint.clusters) {
      const isActive = activeRegionId === cluster.id;

      // 1. Cluster Dots (Hub + Satellites)
      for (const point of cluster.points) {
        const isHub = point.kind === "hub";
        const el = document.createElement("button");
        el.type = "button";
        el.className = cn(
          "footprint-dot",
          isHub ? "footprint-dot-hub" : "footprint-dot-sat",
          reduced && "footprint-dot-static",
          isActive && "ring-2 ring-cyan-400 ring-offset-2 ring-offset-background scale-110",
        );

        if (isHub) {
          const hubDiameter = Math.min(18, Math.max(11, Math.round(8 + Math.log10(cluster.companyCount) * 2.5)));
          el.style.width = `${hubDiameter}px`;
          el.style.height = `${hubDiameter}px`;
        }

        el.setAttribute(
          "aria-label",
          `${cluster.region}, ${cluster.companyCount} companies`,
        );

        const handleEnter = () => {
          setHovered(cluster);
          setAnchor(toViewport(point.lng, point.lat));
          onHoverRegion?.(cluster.id);
        };
        const handleLeave = () => {
          setHovered(null);
          setAnchor(null);
          onHoverRegion?.(null);
        };

        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("focus", handleEnter);
        el.addEventListener("mouseleave", handleLeave);
        el.addEventListener("blur", handleLeave);
        if (onSelectRegion) {
          el.addEventListener("click", () => {
            setHovered(null);
            setAnchor(null);
            onHoverRegion?.(null);
            onSelectRegion(cluster.id);
          });
        }

        const marker = new Marker({ element: el, anchor: "center" })
          .setLngLat([point.lng, point.lat])
          .addTo(map);
        markers.push(marker);
      }

      // 2. Glowing Region Label DOM Marker next to cluster center
      const labelBtn = document.createElement("button");
      labelBtn.type = "button";
      labelBtn.className = cn(
        "pointer-events-auto flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-surface-1/90 px-2 py-0.5 shadow-[0_0_14px_rgba(34,211,238,0.25)] backdrop-blur-md transition-all hover:scale-105 hover:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400",
        isActive && "border-cyan-400 bg-surface-3/95 shadow-[0_0_20px_rgba(34,211,238,0.45)] scale-105",
      );
      labelBtn.setAttribute(
        "aria-label",
        `${cluster.region} cluster, ${cluster.companyCount} companies`,
      );
      labelBtn.innerHTML = `
        <span className="text-[11px] font-semibold tracking-tight text-foreground">${cluster.region}</span>
        <span className="font-mono text-[10px] font-bold text-cyan-400">${cluster.companyCount.toLocaleString()}</span>
      `;

      const handleLabelEnter = () => {
        setHovered(cluster);
        setAnchor(toViewport(cluster.lng, cluster.lat));
        onHoverRegion?.(cluster.id);
      };
      const handleLabelLeave = () => {
        setHovered(null);
        setAnchor(null);
        onHoverRegion?.(null);
      };

      labelBtn.addEventListener("mouseenter", handleLabelEnter);
      labelBtn.addEventListener("focus", handleLabelEnter);
      labelBtn.addEventListener("mouseleave", handleLabelLeave);
      labelBtn.addEventListener("blur", handleLabelLeave);
      if (onSelectRegion) {
        labelBtn.addEventListener("click", () => {
          setHovered(null);
          setAnchor(null);
          onHoverRegion?.(null);
          onSelectRegion(cluster.id);
        });
      }

      const labelMarker = new Marker({
        element: labelBtn,
        anchor: "left",
        offset: [14, 0],
      })
        .setLngLat([cluster.lng, cluster.lat])
        .addTo(map);
      markers.push(labelMarker);
    }

    const closeTooltip = () => {
      setHovered(null);
      setAnchor(null);
    };

    const syncHover = () => {
      setHovered((current) => {
        if (!current) {
          return current;
        }
        const projected = toViewport(current.lng, current.lat);
        setAnchor(projected);
        return current;
      });
    };

    map.on("move", syncHover);
    map.on("movestart", closeTooltip);
    map.on("zoomstart", closeTooltip);
    map.on("dragstart", closeTooltip);

    return () => {
      map.off("move", syncHover);
      map.off("movestart", closeTooltip);
      map.off("zoomstart", closeTooltip);
      map.off("dragstart", closeTooltip);
      for (const marker of markers) {
        marker.remove();
      }
    };
  }, [activeRegionId, footprint, map, onHoverRegion, onSelectRegion, ready]);

  if (!hovered || !anchor) {
    return null;
  }

  return createPortal(
    <GlassPanel
      role="tooltip"
      className="pointer-events-none fixed z-50 px-3 py-2"
      style={{
        left: anchor.x,
        top: anchor.y,
        transform: "translate(-50%, calc(-100% - 18px))",
      }}
    >
      <p className="text-sm font-medium text-foreground">{hovered.region}</p>
      <p className="font-mono text-[11px] text-muted-foreground">
        {hovered.companyCount.toLocaleString()} companies
      </p>
    </GlassPanel>,
    document.body,
  );
}

