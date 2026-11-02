import { useId } from "react";
import { ChevronDownIcon } from "../../components/ui";

export interface FrequencySelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (nextFrequency: string) => void;
}

/**
 * Delivery interval `<select>` preserving native iOS/Android pickers and 16px (`1rem`) mobile text
 * to prevent involuntary Safari auto-zoom, scaling to 13.5px / 33px height on desktop.
 */
export function FrequencySelect({ label, options, value, onChange }: FrequencySelectProps) {
  const selectId = useId();

  return (
    <div
      className="flex flex-wrap items-center gap-2.5"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <label htmlFor={selectId} className="text-[0.84375rem] text-brand-muted">
        {label}
      </label>

      <div className="relative inline-flex items-center">
        <select
          id={selectId}
          name="deliveryFrequency"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-11 lg:min-h-0 lg:h-[2.0625rem] text-base lg:text-[0.84375rem] font-medium text-brand-ink bg-white border border-brand-input-border rounded-lg pl-3 pr-8 appearance-none cursor-pointer transition-colors hover:border-brand-forest/60"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-brand-slate">
          <ChevronDownIcon className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
