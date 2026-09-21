"use client";

import { useEffect, useState } from "react";
import type { MapMouseEvent, GeoJSONSource } from "maplibre-gl";
import type { Company } from "@/features/company/schema";
import type { CompanyMatch, MatchTier } from "@/features/matching/schema";
import { useMapApi } from "./BaseMap";

type CompanyPinsLayerProps = {
  companies: Company[];
  matchesMap: Map<string, CompanyMatch>;
  selectedCompanyId: string | null;
  activeTierFilter: "All" | MatchTier;
  onSelectCompany: (companyId: string | null) => void;
};

export function CompanyPinsLayer({
  companies,
  matchesMap,
  selectedCompanyId,
  activeTierFilter,
  onSelectCompany,
}: CompanyPinsLayerProps) {
  const { map, ready } = useMapApi();
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);
  const [hoveredMatch, setHoveredMatch] = useState<CompanyMatch | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!map || !ready || companies.length === 0) return;

    const sourceId = "company-pins-source";
    const clusterLayerId = "clusters";
    const clusterCountLayerId = "cluster-count";
    const unclusteredLayerId = "unclustered-point";
    const selectedRingLayerId = "selected-company-ring";

    const cleanup = () => {
      if (!map) return;
      if (map.getLayer(selectedRingLayerId)) map.removeLayer(selectedRingLayerId);
      if (map.getLayer(unclusteredLayerId)) map.removeLayer(unclusteredLayerId);
      if (map.getLayer(clusterCountLayerId)) map.removeLayer(clusterCountLayerId);
      if (map.getLayer(clusterLayerId)) map.removeLayer(clusterLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };

    cleanup();

    // Map companies and match results to GeoJSON Features
    const filteredCompanies = activeTierFilter === "All"
      ? companies
      : companies.filter((c) => {
          const match = matchesMap.get(c.id);
          return match?.tier === activeTierFilter;
        });

    const features = filteredCompanies.map((c) => {
      const match = matchesMap.get(c.id);
      return {
        type: "Feature" as const,
        properties: {
          id: c.id,
          name: c.name,
          industry: c.industry,
          tier: match?.tier || "Mid",
          score: match?.score || 50,
          employeeCount: c.employeeCount,
          address: c.address,
          hub: c.hub,
        },
        geometry: {
          type: "Point" as const,
          coordinates: c.coordinates,
        },
      };
    });

    // 1. Add GeoJSON source with clustering
    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features,
      },
      cluster: true,
      clusterMaxZoom: 13,
      clusterRadius: 50,
    });

    // 2. Cluster circles layer
    map.addLayer({
      id: clusterLayerId,
      type: "circle",
      source: sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#092938",
        "circle-radius": [
          "step",
          ["get", "point_count"],
          16,
          20, 20,
          50, 24,
          100, 28,
        ],
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "#22d3ee",
        "circle-stroke-opacity": 0.9,
      },
    });

    // 3. Cluster count text
    map.addLayer({
      id: clusterCountLayerId,
      type: "symbol",
      source: sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["Metropolis Medium", "Noto Sans Regular"],
        "text-size": 12,
      },
      paint: {
        "text-color": "#22d3ee",
      },
    });

    // 4. Unclustered points layer (Individual company pins colored by match tier)
    map.addLayer({
      id: unclusteredLayerId,
      type: "circle",
      source: sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": [
          "match",
          ["get", "tier"],
          "High", "#10b981",
          "Mid", "#f59e0b",
          "Least", "#64748b",
          "#64748b",
        ],
        "circle-radius": [
          "match",
          ["get", "tier"],
          "High", 7.5,
          "Mid", 5.5,
          "Least", 4,
          5,
        ],
        "circle-stroke-width": 1.5,
        "circle-stroke-color": "#050506",
        "circle-stroke-opacity": 1,
      },
    });

    // 5. Selected company pulsing ring highlight
    map.addLayer({
      id: selectedRingLayerId,
      type: "circle",
      source: sourceId,
      filter: ["==", ["get", "id"], selectedCompanyId || ""],
      paint: {
        "circle-color": "transparent",
        "circle-radius": 13,
        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#22d3ee",
      },
    });

    // Event Listeners: Cluster Click (Zoom in)
    const handleClusterClick = (e: MapMouseEvent) => {
      const bbox = map.queryRenderedFeatures(e.point, { layers: [clusterLayerId] });
      if (!bbox.length) return;
      const clusterId = bbox[0].properties?.cluster_id as number;
      const source = map.getSource(sourceId) as GeoJSONSource;
      source
        .getClusterExpansionZoom(clusterId)
        .then((zoom) => {
          if (zoom === undefined || zoom === null) return;
          const coordinates = (bbox[0].geometry as GeoJSON.Point).coordinates;
          map.easeTo({
            center: [coordinates[0], coordinates[1]],
            zoom,
            duration: 1000,
          });
        })
        .catch(() => {});
    };

    // Event Listeners: Point Click (Select company & ease camera with right panel padding)
    const handlePointClick = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [unclusteredLayerId] });
      if (!features.length) return;
      const clickedCompanyId = features[0].properties?.id as string;
      onSelectCompany(clickedCompanyId);

      const coordinates = (features[0].geometry as GeoJSON.Point).coordinates;
      const isDesktop = window.innerWidth >= 1024;
      map.easeTo({
        center: [coordinates[0], coordinates[1]],
        duration: 800,
        padding: {
          top: 80,
          bottom: 60,
          left: isDesktop ? 380 : 40,
          right: isDesktop ? 440 : 40, // Reserved for right Priorities/Detail panel
        },
      });
    };

    // Event Listeners: Point Hover (Tooltip)
    const handlePointMouseMove = (e: MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [unclusteredLayerId] });
      if (features.length > 0) {
        map.getCanvas().style.cursor = "pointer";
        const props = features[0].properties;
        const comp = companies.find((c) => c.id === props?.id);
        const match = matchesMap.get(props?.id);
        if (comp) {
          setHoveredCompany(comp);
          setHoveredMatch(match || null);
          setTooltipPos({ x: e.point.x, y: e.point.y });
        }
      } else {
        map.getCanvas().style.cursor = "";
        setHoveredCompany(null);
        setHoveredMatch(null);
        setTooltipPos(null);
      }
    };

    const handlePointMouseLeave = () => {
      map.getCanvas().style.cursor = "";
      setHoveredCompany(null);
      setHoveredMatch(null);
      setTooltipPos(null);
    };

    map.on("click", clusterLayerId, handleClusterClick);
    map.on("click", unclusteredLayerId, handlePointClick);
    map.on("mousemove", unclusteredLayerId, handlePointMouseMove);
    map.on("mouseleave", unclusteredLayerId, handlePointMouseLeave);

    return () => {
      if (map) {
        map.off("click", clusterLayerId, handleClusterClick);
        map.off("click", unclusteredLayerId, handlePointClick);
        map.off("mousemove", unclusteredLayerId, handlePointMouseMove);
        map.off("mouseleave", unclusteredLayerId, handlePointMouseLeave);
      }
      cleanup();
    };
  }, [map, ready, companies, matchesMap, selectedCompanyId, activeTierFilter, onSelectCompany]);

  return (
    <>
      {hoveredCompany && tooltipPos ? (
        <div
          style={{
            left: `${tooltipPos.x + 14}px`,
            top: `${tooltipPos.y - 14}px`,
          }}
          className="pointer-events-none absolute z-30 transform rounded-lg border border-border/80 bg-surface-2/95 px-3 py-2 shadow-xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                hoveredMatch?.tier === "High"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  : hoveredMatch?.tier === "Mid"
                  ? "bg-amber-400"
                  : "bg-slate-400"
              }`}
            />
            <p className="text-xs font-semibold text-foreground">
              {hoveredCompany.name}
            </p>
          </div>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            {hoveredCompany.industry} • {hoveredCompany.employeeCount} employees
          </p>
          <div className="mt-1 flex items-center justify-between gap-3 font-mono text-[10px] text-cyan-400">
            <span>Match: {hoveredMatch?.score ?? 50}% ({hoveredMatch?.tier} Tier)</span>
            <span>{hoveredCompany.hub}</span>
          </div>
        </div>
      ) : null}
    </>
  );
}
