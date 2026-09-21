import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getFootprintBounds } from "./footprint";
import { buildMapStyle, prospectMapFlavor } from "./mapStyle";

describe("prospectMapFlavor", () => {
  it("uses subtle slate land color and #3d3d4a boundaries in normal mode", () => {
    const flavor = prospectMapFlavor();
    expect(flavor.earth).toBe("#101116");
    expect(flavor.background).toBe("#050506");
    expect(flavor.boundaries).toBe("#3d3d4a");
  });

  it("uses high-contrast debug colors when isDebug is true", () => {
    const flavor = prospectMapFlavor(true);
    expect(flavor.earth).toBe("#1b3a5b");
    expect(flavor.water).toBe("#0a1f33");
    expect(flavor.boundaries).toBe("#ff00aa");
  });
});

describe("buildMapStyle", () => {
  const originalTilesUrl = process.env.NEXT_PUBLIC_MAP_TILES_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_MAP_TILES_URL = "https://example.com/tiles/{z}/{x}/{y}.pbf";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_MAP_TILES_URL = originalTilesUrl;
  });

  it("returns a MapLibre v8 style with a black background", () => {
    const style = buildMapStyle();
    expect(style.version).toBe(8);
    expect(style.layers[0]).toMatchObject({
      id: "background",
      type: "background",
    });
  });

  it("restores basemap place, water, and major road symbol layers", () => {
    const style = buildMapStyle();
    const symbolLayerIds = style.layers.filter((l) => l.type === "symbol").map((l) => l.id);
    expect(symbolLayerIds).toContain("places_region");
    expect(symbolLayerIds).toContain("places_locality");
    expect(symbolLayerIds).toContain("places_subplace");
    expect(symbolLayerIds).toContain("places_country");
    expect(symbolLayerIds).toContain("roads_labels_major");
    expect(symbolLayerIds).not.toContain("address_label");
  });

  it("enforces progressive minzoom rules on buildings and minor/link roads", () => {
    const style = buildMapStyle();
    const buildings = style.layers.find((l) => l.id === "buildings");
    const minorRoads = style.layers.find((l) => l.id === "roads_minor");
    const linkRoads = style.layers.find((l) => l.id === "roads_link");

    expect(buildings?.minzoom).toBe(14);
    expect(minorRoads?.minzoom).toBe(12);
    expect(linkRoads?.minzoom).toBe(9);
  });

  it("excludes Bengaluru and Mysuru from places_locality to prevent badge collisions", () => {
    const style = buildMapStyle();
    const localityLayer = style.layers.find((l) => l.id === "places_locality");
    if (localityLayer && "filter" in localityLayer) {
      expect(localityLayer.filter).toEqual([
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
      ]);
    }
  });
});

describe("getFootprintBounds", () => {
  it("calculates correct bounding box covering all clusters", () => {
    const bounds = getFootprintBounds();
    expect(bounds).not.toBeNull();
    if (bounds) {
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      expect(minLng).toBeLessThanOrEqual(76.6394);
      expect(maxLng).toBeGreaterThanOrEqual(77.7499);
      expect(minLat).toBeLessThanOrEqual(12.12);
      expect(maxLat).toBeGreaterThanOrEqual(13.0358);
    }
  });
});

