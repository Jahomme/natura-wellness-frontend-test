import { StarRating } from "../../components/ui";

export interface ProductHeaderProps {
  eyebrow: string;
  rating: string;
  reviewCount: string;
  title: string;
  subtitle: string;
}

export function ProductHeader({ eyebrow, rating, reviewCount, title, subtitle }: ProductHeaderProps) {
  return (
    <header>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">{eyebrow}</p>

      <StarRating rating={rating} reviewCount={reviewCount} className="mt-2.5 lg:mt-3" />

      <h1 className="mt-3 lg:mt-3.5 font-serif text-display-fluid text-brand-forest">{title}</h1>

      <p className="mt-3 lg:mt-3.5 text-base leading-[1.55] text-brand-slate">{subtitle}</p>
    </header>
  );
}
