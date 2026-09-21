import * as React from "react";
import { cn } from "@/lib/utils";

export type GlassPanelProps = React.ComponentProps<"div">;

export function GlassPanel({ className, ...props }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface-2/55 shadow-[0_0_0_1px_rgba(34,211,238,0.05),0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className,
      )}
      {...props}
    />
  );
}
