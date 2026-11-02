import type { HTMLAttributes, ReactNode } from "react";

export type SurfaceTone = "frame" | "option" | "selected" | "sage";

export interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Surface treatments derived directly from BuyBox (public/reference/buy-box.png):
   * - "frame": White card with 1px #E7E1D6 border & 16px radius (BuyBox image frame / outer SubscriptionCard)
   * - "option": White card with 1px #E1DBCF border & 12px radius (BuyBox unselected purchase option)
   * - "selected": #F3F6F2 sage card with 2px #17402F border & 12px radius (BuyBox active subscription option)
   * - "sage": #F3F6F2 sage callout with subtle forest border & 12px radius (SubscriptionCard active hero)
   */
  tone?: SurfaceTone;
  children: ReactNode;
}

const TONE_CLASSES: Record<SurfaceTone, string> = {
  frame: "bg-white border border-brand-border rounded-frame",
  option: "bg-white border border-brand-card-border rounded-option",
  selected: "bg-brand-sage border-2 border-brand-forest rounded-option",
  sage: "bg-brand-sage border border-brand-forest/25 rounded-option",
};

export function SurfaceCard({ tone = "frame", className = "", children, ...props }: SurfaceCardProps) {
  return (
    <div className={`${TONE_CLASSES[tone]} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
