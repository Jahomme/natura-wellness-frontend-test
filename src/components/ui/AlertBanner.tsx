import type { ReactNode } from "react";
import {
  AlertTriangleOutlineIcon,
  CheckCircleOutlineIcon,
  CloseIcon,
  XCircleOutlineIcon,
} from "./Icons";
import { Button } from "./Button";

export type AlertVariant = "success" | "warning" | "error";

export interface AlertBannerProps {
  variant: AlertVariant;
  title?: string;
  children: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_STYLES: Record<
  AlertVariant,
  { container: string; iconColor: string; Icon: typeof CheckCircleOutlineIcon; role: "status" | "alert" }
> = {
  success: {
    container: "bg-brand-sage border-brand-forest/30 text-brand-ink",
    iconColor: "text-brand-forest",
    Icon: CheckCircleOutlineIcon,
    role: "status",
  },
  warning: {
    container: "bg-status-paused-bg border-status-paused-border text-brand-ink",
    iconColor: "text-brand-badge-text",
    Icon: AlertTriangleOutlineIcon,
    role: "alert",
  },
  error: {
    container: "bg-status-error-bg border-status-error-border text-brand-ink",
    iconColor: "text-status-error-text",
    Icon: XCircleOutlineIcon,
    role: "alert",
  },
};

/**
 * Status & error banner built with BuyBox's surface radii (`rounded-option`), outlined 1.5px stroke icons,
 * and shared `<Button>` controls. Coordinates `role="status"` (polite) vs `role="alert"` (assertive).
 */
export function AlertBanner({
  variant,
  title,
  children,
  action,
  onDismiss,
  className = "",
}: AlertBannerProps) {
  const { container, iconColor, Icon, role } = VARIANT_STYLES[variant];

  return (
    <div
      role={role}
      aria-live={role === "status" ? "polite" : undefined}
      className={`border rounded-option p-4 space-y-3 ${container} ${className}`.trim()}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1 min-w-0 text-sm leading-relaxed">
          {title && <p className="font-semibold text-brand-ink mb-0.5">{title}</p>}
          <div className="text-brand-slate">{children}</div>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss message"
            className="min-w-9 min-h-9 -mr-1.5 -mt-1.5 inline-flex items-center justify-center rounded-lg text-brand-muted hover:text-brand-ink transition-colors cursor-pointer"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {action && (
        <div className="pl-8">
          <Button variant="secondary" size="md" onClick={action.onClick} className="w-full sm:w-auto">
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
