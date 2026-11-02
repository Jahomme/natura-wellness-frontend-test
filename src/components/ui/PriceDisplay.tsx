import { formatCents } from "../../utils/format";

export interface PriceDisplayProps {
  /** Active price in cents (e.g., 2546 -> "$25.46"). */
  cents: number;
  /** Optional pre-discount comparison price in cents rendered with strikethrough below (e.g., 2995 -> "$29.95"). */
  compareCents?: number | null;
  size?: "md" | "sm" | "lg";
  className?: string;
}

const MAIN_PRICE_CLASSES = {
  sm: "text-sm font-semibold text-brand-ink leading-tight tabular-nums",
  md: "text-base font-semibold text-brand-ink leading-tight tabular-nums",
  lg: "text-xl font-bold text-brand-forest leading-tight tabular-nums",
} as const;

/**
 * Price stack designed first for BuyBox's One-time ($29.95) and Subscribe ($25.46 / strikethrough $29.95) cards,
 * reused in SubscriptionCard for line-item and next-shipment totals.
 */
export function PriceDisplay({ cents, compareCents, size = "md", className = "" }: PriceDisplayProps) {
  const showCompare = typeof compareCents === "number" && compareCents > cents;

  return (
    <div className={`text-right flex-shrink-0 ${className}`.trim()}>
      <div className={MAIN_PRICE_CLASSES[size]}>{formatCents(cents)}</div>
      {showCompare && (
        <div className="text-xs text-brand-muted line-through mt-0.5 leading-tight tabular-nums">
          {formatCents(compareCents)}
        </div>
      )}
    </div>
  );
}
