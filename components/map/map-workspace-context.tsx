"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Company } from "@/features/company/schema";

type MapWorkspaceContextType = {
  activeRegionId: string | null;
  setActiveRegionId: (id: string | null) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
  hoveredCompany: Company | null;
  setHoveredCompany: (company: Company | null) => void;
};

const MapWorkspaceContext = createContext<MapWorkspaceContextType>({
  activeRegionId: null,
  setActiveRegionId: () => {},
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  hoveredCompany: null,
  setHoveredCompany: () => {},
});

export function MapWorkspaceProvider({ children }: { children: ReactNode }) {
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [hoveredCompany, setHoveredCompany] = useState<Company | null>(null);

  return (
    <MapWorkspaceContext.Provider
      value={{
        activeRegionId,
        setActiveRegionId,
        selectedCompanyId,
        setSelectedCompanyId,
        hoveredCompany,
        setHoveredCompany,
      }}
    >
      {children}
    </MapWorkspaceContext.Provider>
  );
}

export function useMapWorkspace() {
  return useContext(MapWorkspaceContext);
}
