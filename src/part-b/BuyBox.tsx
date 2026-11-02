import { useState } from "react";
import {
  Button,
  CheckIcon,
  ProductThumbnail,
  QuantityStepper,
} from "../components/ui";
import { formatCents } from "../utils/format";
import { copy } from "./copy";
import { FrequencySelect } from "./components/FrequencySelect";
import { ProductHeader } from "./components/ProductHeader";
import { PurchaseOptionCard } from "./components/PurchaseOptionCard";
import { TrustBadges } from "./components/TrustBadges";

type PurchaseType = "one-time" | "subscribe";

export function BuyBox() {
  const [purchaseType, setPurchaseType] = useState<PurchaseType>("subscribe");
  const [frequency, setFrequency] = useState(
    copy.subscribe.frequencyOptions[0],
  );
  const [quantity, setQuantity] = useState(1);

  const isSubscribe = purchaseType === "subscribe";
  const activeUnitPriceCents = isSubscribe
    ? copy.subscribe.priceCents
    : copy.oneTime.priceCents;
  const totalFormatted = formatCents(activeUnitPriceCents * quantity);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section
      aria-label={`${copy.title} purchase options`}
      className="w-full max-w-buybox mx-auto px-4 py-6 sm:px-8 sm:py-10 lg:px-16 lg:pt-14 lg:pb-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[33.75rem_29.25rem] gap-6 sm:gap-10 lg:gap-16 items-start">
        {/* Left Column: 540x540px Product Image Frame */}
        <ProductThumbnail
          src="/product.jpg"
          alt={copy.title}
          size="hero"
          priority
        />

        {/* Right Column: 468px Product Details & Purchase Form */}
        <div className="w-full lg:max-w-[29.25rem]">
          <ProductHeader
            eyebrow={copy.eyebrow}
            rating={copy.rating}
            reviewCount={copy.reviewCount}
            title={copy.title}
            subtitle={copy.subtitle}
          />

          <hr className="my-6 border-t border-brand-border" />

          <form onSubmit={handleSubmit}>
            <fieldset className="space-y-3">
              <legend className="sr-only">Purchase option</legend>

              <PurchaseOptionCard
                name="purchaseOption"
                value="one-time"
                checked={!isSubscribe}
                onSelect={() => setPurchaseType("one-time")}
                label={copy.oneTime.label}
                priceCents={copy.oneTime.priceCents}
              />

              <PurchaseOptionCard
                name="purchaseOption"
                value="subscribe"
                checked={isSubscribe}
                onSelect={() => setPurchaseType("subscribe")}
                label={copy.subscribe.label}
                badge={copy.subscribe.badge}
                priceCents={copy.subscribe.priceCents}
                comparePriceCents={copy.subscribe.comparePriceCents}
              >
                <FrequencySelect
                  label={copy.subscribe.frequencyLabel}
                  options={copy.subscribe.frequencyOptions}
                  value={frequency}
                  onChange={(nextFreq) => {
                    setFrequency(nextFreq);
                    setPurchaseType("subscribe");
                  }}
                />

                <ul role="list" className="space-y-1.5">
                  {copy.subscribe.perks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-2 text-[0.84375rem] text-brand-ink"
                    >
                      <CheckIcon className="w-3.5 h-3.5 flex-shrink-0 text-brand-forest" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </PurchaseOptionCard>
            </fieldset>

            <div className="mt-6 flex items-stretch gap-2.5 sm:gap-3">
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                min={1}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 min-w-0"
              >
                <span>{copy.addToCart}</span>
                <span aria-hidden="true" className="opacity-75">
                  ·
                </span>
                <span className="tabular-nums">{totalFormatted}</span>
              </Button>
            </div>

            <TrustBadges items={copy.trust} className="mt-5" />

            <p className="mt-4 text-xs leading-[1.5] text-brand-muted">
              {copy.finePrint}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
