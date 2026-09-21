import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const tierBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide uppercase",
  {
    variants: {
      tier: {
        high: "border-tier-high/30 bg-tier-high/10 text-tier-high",
        mid: "border-tier-mid/30 bg-tier-mid/10 text-tier-mid",
        least: "border-tier-least/30 bg-tier-least/10 text-tier-least",
      },
    },
    defaultVariants: {
      tier: "mid",
    },
  },
);

const TIER_LABEL: Record<NonNullable<TierBadgeProps["tier"]>, string> = {
  high: "High",
  mid: "Mid",
  least: "Least",
};

export type TierBadgeProps = ComponentProps<"span"> &
  VariantProps<typeof tierBadgeVariants>;

export function TierBadge({
  className,
  tier = "mid",
  children,
  ...props
}: TierBadgeProps) {
  return (
    <span className={cn(tierBadgeVariants({ tier }), className)} {...props}>
      {children ?? TIER_LABEL[tier ?? "mid"]}
    </span>
  );
}
