export type FootprintPoint = {
  id: string;
  lng: number;
  lat: number;
  kind: "hub" | "satellite";
  clusterId: string;
};

export type DataFootprintCluster = {
  id: string;
  region: string;
  companyCount: number;
  lng: number;
  lat: number;
  points: FootprintPoint[];
};

export type DataFootprint = {
  clusters: DataFootprintCluster[];
  regionCount: number;
  companyCount: number;
};

const MOCK_CLUSTERS: DataFootprintCluster[] = [
  {
    id: "bengaluru",
    region: "Bengaluru",
    companyCount: 1840,
    lng: 77.5946,
    lat: 12.9716,
    points: [
      {
        id: "blr-hub",
        lng: 77.5946,
        lat: 12.9716,
        kind: "hub",
        clusterId: "bengaluru",
      },
      {
        id: "blr-whitefield",
        lng: 77.7499,
        lat: 12.9698,
        kind: "satellite",
        clusterId: "bengaluru",
      },
      {
        id: "blr-ecity",
        lng: 77.6602,
        lat: 12.8452,
        kind: "satellite",
        clusterId: "bengaluru",
      },
      {
        id: "blr-hebbal",
        lng: 77.597,
        lat: 13.0358,
        kind: "satellite",
        clusterId: "bengaluru",
      },
      {
        id: "blr-orion",
        lng: 77.536,
        lat: 12.991,
        kind: "satellite",
        clusterId: "bengaluru",
      },
    ],
  },
  {
    id: "mysuru",
    region: "Mysuru",
    companyCount: 420,
    lng: 76.6394,
    lat: 12.2958,
    points: [
      {
        id: "mys-hub",
        lng: 76.6394,
        lat: 12.2958,
        kind: "hub",
        clusterId: "mysuru",
      },
      {
        id: "mys-infy",
        lng: 76.613,
        lat: 12.337,
        kind: "satellite",
        clusterId: "mysuru",
      },
      {
        id: "mys-nanjangud",
        lng: 76.6828,
        lat: 12.12,
        kind: "satellite",
        clusterId: "mysuru",
      },
    ],
  },
];

export function getDataFootprint(): DataFootprint {
  const clusters = MOCK_CLUSTERS.map((cluster) => ({
    ...cluster,
    points: cluster.points.map((point) => ({ ...point })),
  }));

  return {
    clusters,
    regionCount: clusters.length,
    companyCount: clusters.reduce((sum, cluster) => sum + cluster.companyCount, 0),
  };
}

export function getFootprintBounds(): [[number, number], [number, number]] | null {
  const footprint = getDataFootprint();
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const cluster of footprint.clusters) {
    for (const point of cluster.points) {
      if (point.lng < minLng) minLng = point.lng;
      if (point.lat < minLat) minLat = point.lat;
      if (point.lng > maxLng) maxLng = point.lng;
      if (point.lat > maxLat) maxLat = point.lat;
    }
  }

  if (minLng === Infinity) return null;
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

