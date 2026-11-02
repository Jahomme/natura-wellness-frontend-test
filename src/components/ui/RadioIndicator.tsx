export interface RadioIndicatorProps {
  checked: boolean;
  className?: string;
}

/**
 * 20x20px visual radio ring matched to BuyBox's One-time & Subscribe option cards.
 * Pair alongside a visually hidden `<input type="radio" className="sr-only" />`.
 */
export function RadioIndicator({ checked, className = "" }: RadioIndicatorProps) {
  return (
    <span
      aria-hidden="true"
      className={`w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? "border-2 border-brand-forest" : "border-[1.5px] border-brand-radio"
      } ${className}`.trim()}
    >
      {checked && <span className="w-2.5 h-2.5 rounded-full bg-brand-forest" />}
    </span>
  );
}
