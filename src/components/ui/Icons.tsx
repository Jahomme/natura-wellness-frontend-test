import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * Crisp stroke checkmark matched to BuyBox's subscription perks ("Skip, pause, or cancel anytime").
 */
export function CheckIcon({ className = "w-3.5 h-3.5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M3 8.5L6.25 11.75L13 4.5" />
    </svg>
  );
}

/**
 * Outlined circle-check icon matched to BuyBox's trust row ("Third-party tested", "Non-GMO", "Made in the USA").
 * Reused in SubscriptionCard for active status badges and success notifications.
 */
export function CheckCircleOutlineIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M5.25 8.25L7.1 10.1L10.85 6.15" />
    </svg>
  );
}

/**
 * 5-point star matched to BuyBox's 4.8 rating row (#D8A23A).
 */
export function StarIcon({ className = "w-[0.9375rem] h-[0.9375rem]", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
    </svg>
  );
}

/**
 * Compact stroke chevron matched to BuyBox's "Delivered every" <select> control.
 */
export function ChevronDownIcon({ className = "w-3.5 h-3.5", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M4.5 6.25L8 9.75L11.5 6.25" />
    </svg>
  );
}

/**
 * Outlined pause-circle icon sharing the exact 1.5px stroke weight of CheckCircleOutlineIcon.
 */
export function PauseCircleOutlineIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M6.5 5.75V10.25M9.5 5.75V10.25" />
    </svg>
  );
}

/**
 * Outlined X-circle icon sharing the exact 1.5px stroke weight of CheckCircleOutlineIcon.
 */
export function XCircleOutlineIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M6 6L10 10M10 6L6 10" />
    </svg>
  );
}

/**
 * Outlined warning triangle sharing the 1.5px stroke weight for conflict/warning banners.
 */
export function AlertTriangleOutlineIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M8 2.25L14.25 13.25H1.75L8 2.25Z" />
      <path d="M8 6.5V9.25" />
      <circle cx="8" cy="11.35" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Supplement bottle silhouette echoing the Natura Wellness bottle in /product.jpg,
 * rendered when a product item has imageUrl === null.
 */
export function SupplementBottleIcon({ className = "w-6 h-6", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <rect x="8.5" y="3" width="7" height="3" rx="0.75" />
      <path d="M9.5 6V7.5L7 9.5V19A2 2 0 0 0 9 21H15A2 2 0 0 0 17 19V9.5L14.5 7.5V6" />
      <path d="M7 12.5H17M7 17.5H17" />
    </svg>
  );
}

export function CloseIcon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M4 4L12 12M12 4L4 12" />
    </svg>
  );
}

export function SpinnerIcon({ className = "w-4 h-4 animate-spin", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className} {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
      <path
        className="opacity-85"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
