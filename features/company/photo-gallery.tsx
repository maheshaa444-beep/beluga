"use client";

import { useState } from "react";
import { Building2, Camera, X } from "lucide-react";

type PhotoGalleryProps = {
  companyName: string;
  industry: string;
  photoUrls?: string[];
  isLoading?: boolean;
};

export function PhotoGallery({
  companyName,
  industry,
  photoUrls,
  isLoading = false,
}: PhotoGalleryProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Fallback placeholder photos (SVG-based industrial gradients)
  const defaultPlaceholders = [
    {
      title: "Main Campus & Facility",
      gradient: "from-cyan-950 via-slate-900 to-slate-950",
      accent: "text-cyan-400",
      url: photoUrls?.[0],
    },
    {
      title: "Operations & Tech Hub",
      gradient: "from-slate-900 via-indigo-950 to-slate-950",
      accent: "text-indigo-400",
      url: photoUrls?.[1],
    },
    {
      title: "R&D Center",
      gradient: "from-emerald-950 via-slate-900 to-slate-950",
      accent: "text-emerald-400",
      url: photoUrls?.[2],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Facility Photos
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-lg bg-surface-1 border border-border/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Camera className="h-3 w-3 text-cyan-400" />
          Facility Photos
        </p>
        <span className="rounded bg-surface-1 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
          Sample Data
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {defaultPlaceholders.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhotoIndex(index)}
            className={`group relative flex h-20 flex-col items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br ${item.gradient} p-2 transition-all hover:border-cyan-500/50 hover:shadow-lg`}
          >
            <Building2 className={`h-5 w-5 ${item.accent} transition-transform group-hover:scale-110`} />
            <span className="mt-1 font-mono text-[9px] font-medium text-foreground text-center truncate w-full">
              {item.title}
            </span>
            <span className="absolute bottom-1 right-1.5 rounded bg-black/60 px-1 font-mono text-[8px] text-muted-foreground">
              Placeholder
            </span>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-w-lg w-full rounded-2xl border border-cyan-500/30 bg-surface-2 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-surface-1 hover:text-foreground"
              aria-label="Close Lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div className={`flex h-48 w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br ${defaultPlaceholders[selectedPhotoIndex].gradient} border border-border p-4`}>
              <Building2 className={`h-12 w-12 ${defaultPlaceholders[selectedPhotoIndex].accent}`} />
              <p className="mt-2 font-mono text-sm font-bold text-foreground">
                {companyName} - {defaultPlaceholders[selectedPhotoIndex].title}
              </p>
              <span className="mt-1 rounded-full bg-cyan-500/20 px-2.5 py-0.5 font-mono text-[10px] text-cyan-400">
                Sample Photo - Placeholder
              </span>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Placeholder image generated for {industry} facility in Karnataka. Real high-res imagery will be connected in future data integrations.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
