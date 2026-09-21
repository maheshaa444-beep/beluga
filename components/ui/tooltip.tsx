"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TooltipProps = {
  content: string;
  children: ReactNode;
  className?: string;
};

export function Tooltip({ content, children, className }: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-max max-w-48 -translate-x-1/2 rounded-md border border-border bg-surface-3 px-2 py-1 text-[11px] text-foreground shadow-lg"
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

export function handleTooltipKey(event: KeyboardEvent) {
  if (event.key === "Escape") {
    (event.currentTarget as HTMLElement).blur();
  }
}
