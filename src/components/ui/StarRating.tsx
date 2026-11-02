import { StarIcon } from "./Icons";

export interface StarRatingProps {
  rating: string;
  reviewCount: string;
  reviewsHref?: string;
  starCount?: number;
  className?: string;
}

/**
 * 5-star rating bar matched to BuyBox ("★★★★★ 4.8  2,316 reviews").
 */
export function StarRating({
  rating,
  reviewCount,
  reviewsHref = "#reviews",
  starCount = 5,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`.trim()}>
      <div
        className="flex items-center gap-0.5 text-brand-gold"
        role="img"
        aria-label={`Rated ${rating} out of ${starCount} stars`}
      >
        {Array.from({ length: starCount }, (_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <span className="text-sm font-semibold text-brand-ink ml-0.5 tabular-nums">{rating}</span>
      <a
        href={reviewsHref}
        className="text-sm text-brand-muted underline underline-offset-[3px] decoration-brand-muted/60 hover:text-brand-ink transition-colors"
      >
        {reviewCount}
      </a>
    </div>
  );
}
