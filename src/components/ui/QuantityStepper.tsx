export interface QuantityStepperProps {
  value: number;
  onChange: (nextValue: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Quantity stepper designed first for BuyBox's 128x56px (#CFD6D0 border, 10px radius) control,
 * with >=48px coarse-pointer mobile tap targets on the decrement/increment buttons.
 */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className = "",
}: QuantityStepperProps) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <div
      role="group"
      aria-label="Quantity"
      className={`w-[8.25rem] lg:w-32 h-14 bg-white border border-brand-input-border rounded-control flex items-center justify-between px-1 lg:px-2 flex-shrink-0 ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        aria-label="Decrease quantity"
        className="min-w-tap min-h-tap lg:min-w-0 lg:min-h-0 lg:w-10 lg:h-10 flex items-center justify-center text-lg leading-none text-brand-slate hover:text-brand-ink disabled:opacity-35 disabled:cursor-not-allowed rounded transition-colors cursor-pointer select-none"
      >
        −
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="text-[0.9375rem] font-semibold text-brand-ink tabular-nums select-none"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        aria-label="Increase quantity"
        className="min-w-tap min-h-tap lg:min-w-0 lg:min-h-0 lg:w-10 lg:h-10 flex items-center justify-center text-lg leading-none text-brand-slate hover:text-brand-ink disabled:opacity-35 disabled:cursor-not-allowed rounded transition-colors cursor-pointer select-none"
      >
        +
      </button>
    </div>
  );
}
