"use client";

import { useEffect } from "react";
import type { Region } from "@/features/regions/schema";
import { useMapApi } from "./BaseMap";

type RegionBoundaryLayerProps = {
  region: Region;
};

export function RegionBoundaryLayer({ region }: RegionBoundaryLayerProps) {
  const { map, ready } = useMapApi();

  useEffect(() => {
    if (!map || !ready || !region) return;

    const sourceId = "region-boundary-source";
    const maskSourceId = "region-mask-source";
    const fillLayerId = "region-boundary-fill";
    const strokeLayerId = "region-boundary-stroke";
    const maskLayerId = "region-mask-fill";

    // Clean up existing if any
    const cleanup = () => {
      if (!map) return;
      if (map.getLayer(strokeLayerId)) map.removeLayer(strokeLayerId);
      if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
      if (map.getLayer(maskLayerId)) map.removeLayer(maskLayerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
      if (map.getSource(maskSourceId)) map.removeSource(maskSourceId);
    };

    cleanup();

    // 1. Fit camera to region bounds
    const isDesktop = window.innerWidth >= 1024;
    map.fitBounds(region.bounds, {
      padding: {
        top: 90,
        bottom: 70,
        left: isDesktop ? 400 : 40,
        right: isDesktop ? 80 : 40,
      },
      maxZoom: 12,
      duration: 1800,
      essential: true,
    });

    // 2. Add Inverted Dim Mask GeoJSON Source
    // World ring (outer) + region polygon rings (holes)
    const worldRing: [number, number][] = [
      [-180, -85],
      [180, -85],
      [180, 85],
      [-180, 85],
      [-180, -85],
    ];

    const regionRings = region.geometry.coordinates.flatMap((poly) => poly);
    const maskCoordinates = [worldRing, ...regionRings];

    map.addSource(maskSourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: maskCoordinates,
        },
      },
    });

    // Mask layer: dim areas outside region
    map.addLayer({
      id: maskLayerId,
      type: "fill",
      source: maskSourceId,
      paint: {
        "fill-color": "#050506",
        "fill-opacity": 0.65,
      },
    });

    // 3. Add Region GeoJSON Source & Outline Layers
    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: { name: region.name },
        geometry: region.geometry,
      },
    });

    // Subtle cyan tint inside region
    map.addLayer({
      id: fillLayerId,
      type: "fill",
      source: sourceId,
      paint: {
        "fill-color": "#06b6d4",
        "fill-opacity": 0.04,
      },
    });

    // Electric cyan glowing border
    map.addLayer({
      id: strokeLayerId,
      type: "line",
      source: sourceId,
      paint: {
        "line-color": "#22d3ee",
        "line-width": 2,
        "line-opacity": 0.85,
        "line-blur": 0.5,
      },
    });

    return () => {
      cleanup();
    };
  }, [map, ready, region]);

  return null;
}
