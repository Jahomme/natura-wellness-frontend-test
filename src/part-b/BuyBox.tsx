import { useState, useId } from "react";
import { copy } from "./copy";
import { formatCents } from "../utils/format";

type PurchaseType = "one-time" | "subscribe";

export function BuyBox() {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscribe");
  const [frequency, setFrequency] = useState(copy.subscribe.frequencyOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const freqId = useId();
  const oneTimeId = useId();
  const subscribeId = useId();

  const isSubscribe = purchaseType === "subscribe";
  const activeUnitPrice = isSubscribe ? copy.subscribe.priceCents : copy.oneTime.priceCents;
  const totalPriceFormatted = formatCents(activeUnitPrice * quantity);

  function handleDecrement() {
    setQuantity((prev) => Math.max(1, prev - 1));
  }

  function handleIncrement() {
    setQuantity((prev) => prev + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Adding to cart does not need to do anything per instructions.
  }

  return (
    <div className="w-full bg-brand-cream text-brand-ink">
      <div className="max-w-buybox mx-auto px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:pt-14 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[33.75rem_29.25rem] gap-8 lg:gap-16 items-start justify-center">
          {/* LEFT COLUMN: Product Image Card */}
          <div className="w-full aspect-square bg-white border border-brand-border rounded-frame flex items-center justify-center p-6 sm:p-10 shadow-card">
            <img
              src="/product.jpg"
              alt={copy.title}
              fetchPriority="high"
              className="w-[82%] h-[82%] object-contain block drop-shadow-sm"
            />
          </div>

          {/* RIGHT COLUMN: Product Details & Purchase Form */}
          <div className="w-full max-w-[29.25rem] flex flex-col justify-start">
            {/* Eyebrow */}
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-muted">
              {copy.eyebrow}
            </span>

            {/* Rating Row */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-brand-gold" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-[0.9375rem] h-[0.9375rem] fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold text-brand-ink">{copy.rating}</span>
              <a
                href="#reviews"
                className="text-sm text-brand-muted underline underline-offset-[3px] decoration-brand-muted/60 hover:text-brand-ink transition-colors"
              >
                {copy.reviewCount}
              </a>
            </div>

            {/* Product Title */}
            <h1 className="mt-3.5 font-serif text-display-fluid lg:text-[2.625rem] text-brand-forest">
              {copy.title}
            </h1>

            {/* Subtitle / Description */}
            <p className="mt-3.5 text-base leading-[1.55] text-brand-slate">
              {copy.subtitle}
            </p>

            {/* Section Divider */}
            <hr className="my-6 border-t border-brand-border" />

            {/* Purchase Options Form */}
            <form onSubmit={handleSubmit} className="flex flex-col">
              <fieldset className="space-y-3">
                <legend className="sr-only">Choose a purchase option</legend>

                {/* 1. ONE-TIME PURCHASE OPTION */}
                <div
                  onClick={() => setPurchaseType("one-time")}
                  className={`rounded-option cursor-pointer transition-colors ${
                    !isSubscribe
                      ? "border-2 border-brand-forest bg-brand-sage p-[19px]"
                      : "border border-brand-card-border bg-white p-5 hover:border-brand-forest/60"
                  }`}
                >
                  <label
                    htmlFor={oneTimeId}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id={oneTimeId}
                        name="purchaseType"
                        value="one-time"
                        checked={!isSubscribe}
                        onChange={() => setPurchaseType("one-time")}
                        className="sr-only"
                      />
                      {/* Custom Radio Button */}
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          !isSubscribe
                            ? "border-2 border-brand-forest bg-white"
                            : "border-[1.5px] border-brand-radio bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {!isSubscribe && <span className="w-2.5 h-2.5 rounded-full bg-brand-forest" />}
                      </span>
                      <span className="text-[15px] font-semibold text-brand-ink">
                        {copy.oneTime.label}
                      </span>
                    </div>

                    <span className="text-base font-semibold text-brand-ink tabular-nums">
                      {formatCents(copy.oneTime.priceCents)}
                    </span>
                  </label>
                </div>

                {/* 2. SUBSCRIBE & SAVE OPTION */}
                <div
                  onClick={() => setPurchaseType("subscribe")}
                  className={`rounded-option cursor-pointer transition-colors ${
                    isSubscribe
                      ? "border-2 border-brand-forest bg-brand-sage p-[19px]"
                      : "border border-brand-card-border bg-white p-5 hover:border-brand-forest/60"
                  }`}
                >
                  <label
                    htmlFor={subscribeId}
                    className="flex items-start justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <input
                        type="radio"
                        id={subscribeId}
                        name="purchaseType"
                        value="subscribe"
                        checked={isSubscribe}
                        onChange={() => setPurchaseType("subscribe")}
                        className="sr-only"
                      />
                      {/* Custom Radio Button */}
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isSubscribe
                            ? "border-2 border-brand-forest bg-white"
                            : "border-[1.5px] border-brand-radio bg-white"
                        }`}
                        aria-hidden="true"
                      >
                        {isSubscribe && <span className="w-2.5 h-2.5 rounded-full bg-brand-forest" />}
                      </span>
                      <span className="text-[15px] font-semibold text-brand-ink">
                        {copy.subscribe.label}
                      </span>
                      <span className="bg-brand-badge-bg text-brand-badge-text text-[10.5px] font-bold uppercase tracking-[0.06em] px-2.5 py-0.5 rounded-full">
                        {copy.subscribe.badge}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0 pl-2">
                      <div className="text-base font-semibold text-brand-ink leading-tight tabular-nums">
                        {formatCents(copy.subscribe.priceCents)}
                      </div>
                      <div className="text-xs text-brand-muted line-through mt-0.5 tabular-nums">
                        {formatCents(copy.subscribe.comparePriceCents)}
                      </div>
                    </div>
                  </label>

                  {/* Frequency & Perks (always rendered to maintain layout stability, with interactive select) */}
                  <div className="pl-8 pt-3 sm:pt-3.5 space-y-3.5">
                    {/* Frequency selector */}
                    <div
                      className="flex items-center gap-2.5"
                      onClick={(e) => {
                        // Keep focus in select without unselecting subscribe
                        e.stopPropagation();
                        setPurchaseType("subscribe");
                      }}
                    >
                      <label htmlFor={freqId} className="text-[13.5px] text-brand-slate">
                        {copy.subscribe.frequencyLabel}
                      </label>
                      <div className="relative inline-block">
                        <select
                          id={freqId}
                          value={frequency}
                          onChange={(e) => {
                            setFrequency(e.target.value);
                            setPurchaseType("subscribe");
                          }}
                          className="h-11 sm:h-[33px] text-base sm:text-[13.5px] font-medium text-brand-ink bg-white border border-brand-input-border rounded-lg pl-3 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-brand-forest cursor-pointer"
                        >
                          {copy.subscribe.frequencyOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {/* Down Chevron */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-brand-slate">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path
                              fillRule="evenodd"
                              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Subscription Perks */}
                    <ul role="list" className="space-y-1.5">
                      {copy.subscribe.perks.map((perk, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[13.5px] text-brand-ink">
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0 text-brand-forest"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </fieldset>

              {/* Quantity Stepper & Add to Cart Button */}
              <div className="mt-6 flex items-stretch gap-3 h-14">
                {/* Stepper */}
                <div className="w-32 h-14 bg-white border border-brand-input-border rounded-control flex items-center justify-between px-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center text-lg text-brand-slate hover:text-brand-ink active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-transform rounded"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="text-[15px] font-semibold text-brand-ink tabular-nums select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="w-10 h-10 flex items-center justify-center text-lg text-brand-slate hover:text-brand-ink active:scale-95 transition-transform rounded"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  type="submit"
                  className="flex-1 h-14 bg-brand-forest hover:bg-brand-forest-hover active:bg-brand-forest-active text-white rounded-control font-semibold text-[15px] flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer select-none"
                >
                  <span>{copy.addToCart}</span>
                  <span>·</span>
                  <span className="tabular-nums">{totalPriceFormatted}</span>
                </button>
              </div>

              {/* Trust Badges */}
              <ul
                role="list"
                className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-brand-slate"
              >
                {copy.trust.map((badge, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 flex-shrink-0 text-brand-forest"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{badge}</span>
                  </li>
                ))}
              </ul>

              {/* Fine Print */}
              <p className="mt-4 text-xs leading-[1.5] text-brand-muted">
                {copy.finePrint}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
