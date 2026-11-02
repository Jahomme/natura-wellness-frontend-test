import { SupplementBottleIcon } from "./Icons";

export interface ProductThumbnailProps {
  src: string | null;
  alt: string;
  /** "hero" matches BuyBox's 540x540px square card (p-5 -> 500x500px bottle); "sm" renders a 56x56px line-item tile. */
  size?: "hero" | "sm";
  priority?: boolean;
  className?: string;
}

const CONTAINER_CLASSES = {
  hero: "w-full aspect-square rounded-frame p-4 sm:p-5",
  sm: "w-14 h-14 flex-shrink-0 rounded-option p-1.5",
} as const;

/**
 * Product image frame designed first to match BuyBox's flat 1px #E7E1D6 white square card and exact bottle scale,
 * with a clean SVG bottle fallback when `src` is null in SubscriptionCard's refill items.
 */
export function ProductThumbnail({
  src,
  alt,
  size = "hero",
  priority = false,
  className = "",
}: ProductThumbnailProps) {
  return (
    <div
      className={`bg-white border border-brand-border overflow-hidden flex items-center justify-center ${CONTAINER_CLASSES[size]} ${className}`.trim()}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          fetchPriority={priority ? "high" : "auto"}
          className="w-full h-full object-contain block"
        />
      ) : (
        <SupplementBottleIcon
          className={size === "hero" ? "w-20 h-20 text-brand-muted/70" : "w-6 h-6 text-brand-muted"}
        />
      )}
    </div>
  );
}
