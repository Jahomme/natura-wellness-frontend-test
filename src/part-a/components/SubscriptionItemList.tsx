import type { SubscriptionItem, SubscriptionStatus } from "../../api/types";
import { PriceDisplay, ProductThumbnail } from "../../components/ui";
import { formatCents } from "../../utils/format";

export interface SubscriptionItemListProps {
  items: SubscriptionItem[];
  discountPercent: number;
  status: SubscriptionStatus;
}

export function SubscriptionItemList({ items, discountPercent, status }: SubscriptionItemListProps) {
  const isActive = status === "active";
  const isCancelled = status === "cancelled";
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted mb-3">
        {isActive ? `Items in next refill (${totalUnits})` : `Products in subscription (${totalUnits})`}
      </h2>

      <ul
        role="list"
        className={`divide-y divide-brand-border ${isCancelled ? "opacity-75" : ""}`.trim()}
      >
        {items.map((item) => {
          const lineOriginalCents = item.unitPriceCents * item.quantity;
          const lineDiscountedCents = Math.round(
            (lineOriginalCents * (100 - discountPercent)) / 100,
          );
          const unitDiscountedCents = Math.round(
            (item.unitPriceCents * (100 - discountPercent)) / 100,
          );

          return (
            <li key={item.sku} className="py-3.5 first:pt-1 last:pb-1 flex items-center gap-3.5">
              <ProductThumbnail src={item.imageUrl} alt={item.name} size="sm" />

              <div className="flex-1 min-w-0">
                <p className="text-[0.9375rem] font-semibold text-brand-ink truncate">{item.name}</p>
                <p className="mt-1 text-xs text-brand-muted flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center rounded-md bg-brand-cream border border-brand-border px-1.5 py-0.5 text-[0.6875rem] font-semibold text-brand-ink tabular-nums">
                    Qty {item.quantity}
                  </span>
                  <span className="tabular-nums">{formatCents(unitDiscountedCents)} each</span>
                </p>
              </div>

              <PriceDisplay
                size="sm"
                cents={lineDiscountedCents}
                compareCents={isActive ? lineOriginalCents : null}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
