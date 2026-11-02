import type { ReactNode } from "react";

export type BadgeVariant = "highlight" | "active" | "paused" | "cancelled";

export interface BadgeProps {
  /** Defaults to "highlight", matching BuyBox's "BEST VALUE" pill (#F6E7C4 / #7A5A12). */
  variant?: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  highlight: "bg-brand-badge-bg text-brand-badge-text",
  active: "bg-status-active-bg text-status-active-text border border-status-active-border",
  paused: "bg-brand-badge-bg text-brand-badge-text border border-status-paused-border",
  cancelled: "bg-status-cancelled-bg text-status-cancelled-text border border-status-cancelled-border",
};

/**
 * Pill badge calibrated first to BuyBox's "BEST VALUE" badge (uppercase, 10.5px, 0.06em tracking, rounded-full),
 * with semantic status variants reused by SubscriptionCard.
 */
export function Badge({ variant = "highlight", icon, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.65625rem] leading-[1.4] font-bold uppercase tracking-[0.06em] ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {icon}
      {children}
    </span>
  );
}
