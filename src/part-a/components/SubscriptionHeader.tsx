import type { SubscriptionStatus } from "../../api/types";
import {
  Badge,
  CheckCircleOutlineIcon,
  PauseCircleOutlineIcon,
  XCircleOutlineIcon,
} from "../../components/ui";

export interface SubscriptionHeaderProps {
  id: string;
  status: SubscriptionStatus;
  headingId: string;
}

const STATUS_META: Record<
  SubscriptionStatus,
  { label: string; Icon: typeof CheckCircleOutlineIcon }
> = {
  active: { label: "Active", Icon: CheckCircleOutlineIcon },
  paused: { label: "Paused", Icon: PauseCircleOutlineIcon },
  cancelled: { label: "Cancelled", Icon: XCircleOutlineIcon },
};

export function SubscriptionHeader({ id, status, headingId }: SubscriptionHeaderProps) {
  const { label, Icon } = STATUS_META[status];

  return (
    <div className="flex items-start justify-between gap-3 pb-4 border-b border-brand-border">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
          Subscription · {id}
        </p>
        <h1
          id={headingId}
          className={`mt-1.5 font-serif text-card-title ${
            status === "cancelled" ? "text-brand-slate" : "text-brand-forest"
          }`}
        >
          Manage my subscription
        </h1>
      </div>

      <Badge
        variant={status}
        icon={<Icon className="w-3.5 h-3.5 flex-shrink-0" />}
        className="flex-shrink-0 mt-0.5"
      >
        {label}
      </Badge>
    </div>
  );
}
