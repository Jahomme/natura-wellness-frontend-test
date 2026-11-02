import { useId, type ReactNode } from "react";
import { Badge, PriceDisplay, RadioIndicator, SurfaceCard } from "../../components/ui";

export interface PurchaseOptionCardProps {
  name: string;
  value: string;
  checked: boolean;
  onSelect: () => void;
  label: string;
  badge?: string;
  priceCents: number;
  comparePriceCents?: number;
  children?: ReactNode;
}

/**
 * Selectable purchase option card calibrated to BuyBox's One-time (60px height) and Subscribe & save cards.
 * Uses 1px/2px border padding compensation so toggling options produces zero layout shift,
 * and exposes keyboard focus via `:has(:focus-visible)` outline.
 */
export function PurchaseOptionCard({
  name,
  value,
  checked,
  onSelect,
  label,
  badge,
  priceCents,
  comparePriceCents,
  children,
}: PurchaseOptionCardProps) {
  const inputId = useId();

  return (
    <SurfaceCard
      tone={checked ? "selected" : "option"}
      onClick={onSelect}
      className={`cursor-pointer transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-forest ${
        checked
          ? "px-[1.1875rem] py-[1.125rem]"
          : "px-5 py-[1.1875rem] hover:border-brand-forest/60"
      }`}
    >
      <label
        htmlFor={inputId}
        className="flex items-start justify-between gap-3 cursor-pointer select-none"
      >
        <span className="flex items-center gap-3 flex-wrap min-w-0">
          <input
            type="radio"
            id={inputId}
            name={name}
            value={value}
            checked={checked}
            onChange={onSelect}
            className="sr-only"
          />
          <RadioIndicator checked={checked} />
          <span className="text-[0.9375rem] leading-5 font-semibold text-brand-ink">{label}</span>
          {badge && <Badge variant="highlight">{badge}</Badge>}
        </span>

        <PriceDisplay cents={priceCents} compareCents={comparePriceCents} />
      </label>

      {children && <div className="pl-8 pt-3 space-y-3">{children}</div>}
    </SurfaceCard>
  );
}
