import { CheckCircleOutlineIcon } from "../../components/ui";

export interface TrustBadgesProps {
  items: string[];
  className?: string;
}

export function TrustBadges({ items, className = "" }: TrustBadgesProps) {
  return (
    <ul
      role="list"
      className={`flex flex-wrap items-center gap-x-5 lg:gap-x-6 gap-y-2 text-[0.8125rem] text-brand-slate ${className}`.trim()}
    >
      {items.map((item) => (
        <li key={item} className="inline-flex items-center gap-1.5">
          <CheckCircleOutlineIcon className="w-4 h-4 flex-shrink-0 text-brand-forest" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
