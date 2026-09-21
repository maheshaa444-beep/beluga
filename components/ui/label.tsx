import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = ComponentProps<"label">;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-medium tracking-wide text-muted uppercase",
        className,
      )}
      {...props}
    />
  );
}
