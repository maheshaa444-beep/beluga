import { layers, namedFlavor, type Flavor } from "@protomaps/basemaps";
import type {
  LayerSpecification,
  StyleSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";
import { env } from "@/lib/env";

const PROTOMAPS_SOURCE_ID = "protomaps";

const ATTRIBUTION =
  '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>';

const GLYPHS =
  "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf";

const SPRITE_BLACK =
  "https://protomaps.github.io/basemaps-assets/sprites/v4/black";

/** Near-black land, desaturated water/buildings, muted labels. */
export function prospectMapFlavor(isDebug = false): Flavor {
  const black = namedFlavor("black");

  if (isDebug) {
    return {
      ...black,
      background: "#050506",
      earth: "#1b3a5b",
      water: "#0a1f33",
      boundaries: "#ff00aa",
      major: "#ffaa00",
      highway: "#ffaa00",
      minor_a: "#ffaa00",
      minor_b: "#ffaa00",
      other: "#ffaa00",
      link: "#ffaa00",
      park_a: "#16382b",
      park_b: "#16382b",
      wood_a: "#143327",
      wood_b: "#143327",
      hospital: "#2d2440",
      industrial: "#282a36",
      buildings: "#26354a",
      ocean_label: "#38bdf8",
      city_label: "#ffffff",
      city_label_halo: "#050506",
      state_label: "#cbd5e1",
      state_label_halo: "#050506",
      country_label: "#f1f5f9",
    };
  }

  return {
    ...black,
    background: "#050506",
    earth: "#101116",
    park_a: "#0b1410",
    park_b: "#0b1410",
    wood_a: "#09120e",
    wood_b: "#09120e",
    scrub_a: "#0c1410",
    scrub_b: "#0c1410",
    hospital: "#13131a",
    industrial: "#121318",
    school: "#13131a",
    glacier: "#14171d",
    sand: "#151311",
    beach: "#151311",
    aerodrome: "#101014",
    runway: "#1c1c22",
    water: "#0e1726",
    zoo: "#0c1410",
    military: "#111216",
    pedestrian: "#101014",
    buildings: "#14151c",
    pier: "#14151c",
    railway: "#181a24",
    major: "#2d3142",
    highway: "#2d3142",
    minor_a: "#161722",
    minor_b: "#161722",
    boundaries: "#3d3d4a",
    ocean_label: "#4a5560",
    city_label: "#8a8a96",
    city_label_halo: "#050506",
    state_label: "#a0a0ac",
    state_label_halo: "#050506",
    country_label: "#80808c",
    subplace_label: "#6e6e7a",
    subplace_label_halo: "#050506",
    roads_label_minor: "#3f3f46",
    roads_label_minor_halo: "#050506",
    roads_label_major: "#60606c",
    roads_label_major_halo: "#050506",
  };
}

function isPmtilesUrl(url: string): boolean {
  return url.startsWith("pmtiles://") || url.endsWith(".pmtiles");
}

function normalizePmtilesUrl(url: string): string {
  return url.startsWith("pmtiles://") ? url : `pmtiles://${url}`;
}

export function requiresPmtilesProtocol(): boolean {
  const tilesUrl = env.NEXT_PUBLIC_MAP_TILES_URL;
  return tilesUrl.length > 0 && isPmtilesUrl(tilesUrl);
}

export function hasConfiguredTiles(): boolean {
  return (
    env.NEXT_PUBLIC_MAP_TILES_URL.length > 0 ||
    env.NEXT_PUBLIC_PROTOMAPS_API_KEY.length > 0
  );
}

function maskApiKeyInUrl(url: string): string {
  return url.replace(/key=([a-zA-Z0-9]+)/, (_, key: string) => {
    if (key.length <= 6) return "key=***";
    return `key=${key.slice(0, 4)}***${key.slice(-2)}`;
  });
}

function tileSource(): StyleSpecification["sources"] {
  const tilesUrl = env.NEXT_PUBLIC_MAP_TILES_URL;
  const apiKey = env.NEXT_PUBLIC_PROTOMAPS_API_KEY;

  if (tilesUrl) {
    if (isPmtilesUrl(tilesUrl)) {
      const normalized = normalizePmtilesUrl(tilesUrl);
      if (typeof window !== "undefined") {
        console.log("[Prospect Map] Using PMTiles source:", maskApiKeyInUrl(normalized));
      }
      return {
        [PROTOMAPS_SOURCE_ID]: {
          type: "vector",
          url: normalized,
          attribution: ATTRIBUTION,
        },
      };
    }

    if (tilesUrl.includes("{z}")) {
      if (typeof window !== "undefined") {
        console.log("[Prospect Map] Using ZXY tile source:", maskApiKeyInUrl(tilesUrl));
      }
      return {
        [PROTOMAPS_SOURCE_ID]: {
          type: "vector",
          tiles: [tilesUrl],
          maxzoom: 15,
          attribution: ATTRIBUTION,
        },
      };
    }

    if (typeof window !== "undefined") {
      console.log("[Prospect Map] Using custom TileJSON source:", maskApiKeyInUrl(tilesUrl));
    }
    return {
      [PROTOMAPS_SOURCE_ID]: {
        type: "vector",
        url: tilesUrl,
        attribution: ATTRIBUTION,
      },
    };
  }

  if (apiKey) {
    const tileJsonUrl = `https://api.protomaps.com/tiles/v4.json?key=${apiKey}`;
    if (typeof window !== "undefined") {
      console.log("[Prospect Map] Using Protomaps hosted TileJSON:", maskApiKeyInUrl(tileJsonUrl));
    }
    return {
      [PROTOMAPS_SOURCE_ID]: {
        type: "vector",
        url: tileJsonUrl,
        attribution: ATTRIBUTION,
      },
    };
  }

  return {};
}

function isMinimalLabelLayer(layer: LayerSpecification): boolean {
  const id = layer.id;
  if (layer.type === "symbol") {
    const allowedSymbolLayers = [
      "places_region",
      "places_locality",
      "places_subplace",
      "places_country",
      "water_label_ocean",
      "water_label_lakes",
      "water_waterway_label",
      "roads_labels_major",
    ];
    return allowedSymbolLayers.includes(id);
  }
  return true;
}

export function buildMapStyle(isDebug = false): StyleSpecification {
  const sources = tileSource();
  const flavor = prospectMapFlavor(isDebug);
  const basemapLayers = layers(PROTOMAPS_SOURCE_ID, flavor, { lang: "en" })
    .filter(isMinimalLabelLayer)
    .map((layer) => {
      const id = layer.id;

      // Requirement 2: Progressive zoom rules
      if (id === "buildings") {
        return { ...layer, minzoom: 14 };
      }
      if (id.includes("minor") || id.includes("service")) {
        return { ...layer, minzoom: 12 };
      }
      if (id.includes("link") || id.includes("other")) {
        return { ...layer, minzoom: 9 };
      }

      // Requirement 4: Prevent collision between basemap city label and custom glowing region badge
      if (id === "places_locality" && layer.type === "symbol") {
        return {
          ...layer,
          filter: [
            "all",
            ["==", ["get", "kind"], "locality"],
            [
              "!",
              [
                "in",
                ["coalesce", ["get", "name:en"], ["get", "name"], ""],
                ["literal", ["Bengaluru", "Bangalore", "Mysuru", "Mysore"]],
              ],
            ],
          ] as SymbolLayerSpecification["filter"],
        };
      }

      return layer;
    });

  return {
    version: 8,
    glyphs: GLYPHS,
    sprite: SPRITE_BLACK,
    sources,
    layers: [
      {
        id: "background",
        type: "background",
        paint: { "background-color": "#050506" },
      },
      ...basemapLayers.filter((layer) => layer.type !== "background"),
    ],
  };
}
