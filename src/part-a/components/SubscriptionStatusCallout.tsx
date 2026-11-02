import type { Subscription } from "../../api/types";
import {
  CheckIcon,
  PauseCircleOutlineIcon,
  PriceDisplay,
  SurfaceCard,
  XCircleOutlineIcon,
} from "../../components/ui";
import { formatDate, formatRelativeDays } from "../../utils/format";

export interface SubscriptionStatusCalloutProps {
  subscription: Subscription;
}

export function SubscriptionStatusCallout({ subscription }: SubscriptionStatusCalloutProps) {
  const { status, nextChargeAt, nextChargeTotalCents, discountPercent, intervalDays, pausedUntil, cancelledAt } =
    subscription;

  if (status === "active" && nextChargeAt && nextChargeTotalCents !== null) {
    const formattedDate = formatDate(nextChargeAt);
    const relativeLabel = formatRelativeDays(nextChargeAt);

    return (
      <SurfaceCard tone="sage" className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-forest">
              Next shipment
            </p>
            <p className="mt-1 text-lg font-semibold text-brand-ink leading-snug">
              {formattedDate}
            </p>
            {relativeLabel && (
              <p className="mt-0.5 text-xs font-medium text-brand-forest">{relativeLabel}</p>
            )}
          </div>

          <div className="text-right">
            <p className="text-xs text-brand-muted mb-0.5">Next charge</p>
            <PriceDisplay cents={nextChargeTotalCents} size="lg" />
          </div>
        </div>

        <div className="pt-2.5 border-t border-brand-forest/15 flex items-center gap-2 text-xs text-brand-slate">
          <CheckIcon className="w-3.5 h-3.5 flex-shrink-0 text-brand-forest" />
          <span>
            Includes {discountPercent}% subscriber savings · Refills every {intervalDays} days
          </span>
        </div>
      </SurfaceCard>
    );
  }

  if (status === "paused") {
    return (
      <div className="bg-status-paused-bg border border-status-paused-border rounded-option p-4 flex items-start gap-3">
        <PauseCircleOutlineIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-badge-text" />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-brand-ink">
            Paused until {pausedUntil ? formatDate(pausedUntil) : "further notice"}
          </p>
          <p className="text-xs text-brand-slate leading-relaxed">
            No shipments will go out and you won't be charged while your subscription is paused.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-status-cancelled-bg border border-status-cancelled-border rounded-option p-4 flex items-start gap-3">
      <XCircleOutlineIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-slate" />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-semibold text-brand-ink">
          Cancelled{cancelledAt ? ` on ${formatDate(cancelledAt)}` : ""}
        </p>
        <p className="text-xs text-brand-slate leading-relaxed">
          This subscription is no longer active. No future shipments or charges are scheduled.
        </p>
      </div>
    </div>
  );
}
