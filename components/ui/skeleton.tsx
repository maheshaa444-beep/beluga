import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-surface-3/80 ring-1 ring-border",
        className,
      )}
      {...props}
    />
  );
}
