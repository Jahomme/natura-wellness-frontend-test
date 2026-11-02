import type { ButtonHTMLAttributes, ReactNode } from "react";
import { SpinnerIcon } from "./Icons";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "lg" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Defaults to "primary", matching BuyBox's "Add to cart" forest CTA (#17402F, rounded-control). */
  variant?: ButtonVariant;
  /** Defaults to "lg" (56px / 3.5rem height from BuyBox); "md" enforces 48px mobile tap height. */
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-forest hover:bg-brand-forest-hover active:bg-brand-forest-active text-white border border-transparent",
  secondary:
    "bg-white hover:bg-brand-sage active:bg-brand-sage/80 text-brand-ink hover:text-brand-forest border border-brand-input-border hover:border-brand-forest",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  lg: "h-14 px-5 text-[0.9375rem]",
  md: "min-h-tap px-4 py-2.5 text-sm",
};

/**
 * Shared CTA button designed first for BuyBox's 56px forest-green "Add to cart" button,
 * with a secondary variant derived from BuyBox's control border/sage surface tokens for SubscriptionCard.
 */
export function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  isLoading = false,
  loadingLabel,
  disabled,
  className = "",
  type = "button",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors select-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim()}
      {...props}
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="w-4 h-4 animate-spin" />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
