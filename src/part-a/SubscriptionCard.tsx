import { useId, useState } from "react";
import { AlertBanner, Button, SurfaceCard } from "../components/ui";
import { SkipConfirmationModal } from "./components/SkipConfirmationModal";
import { SubscriptionHeader } from "./components/SubscriptionHeader";
import { SubscriptionItemList } from "./components/SubscriptionItemList";
import { SubscriptionSkeleton } from "./components/SubscriptionSkeleton";
import { SubscriptionStatusCallout } from "./components/SubscriptionStatusCallout";
import { useSubscription } from "./hooks/useSubscription";

export function SubscriptionCard() {
  const {
    subscription,
    isLoading,
    loadError,
    isSkipping,
    conflictError,
    skipError,
    successMessage,
    reload,
    confirmSkip,
    dismissSuccess,
    clearSkipErrors,
  } = useSubscription();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const headingId = useId();

  if (isLoading) {
    return <SubscriptionSkeleton />;
  }

  if (loadError || !subscription) {
    return (
      <section aria-label="Subscription error" className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-10">
        <SurfaceCard tone="frame" className="p-5 sm:p-6 space-y-4">
          <AlertBanner
            variant="error"
            title="Couldn't load your subscription"
            action={{ label: "Try again", onClick: () => void reload() }}
          >
            {loadError ?? "Something went wrong while loading your subscription details."}
          </AlertBanner>
        </SurfaceCard>
      </section>
    );
  }

  const isActive = subscription.status === "active";

  function handleOpenSkipModal() {
    clearSkipErrors();
    setIsConfirmModalOpen(true);
  }

  return (
    <section
      aria-labelledby={headingId}
      className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-10 [container-type:inline-size]"
    >
      <div className="space-y-4">
        {successMessage && (
          <AlertBanner variant="success" title="Next shipment skipped" onDismiss={dismissSuccess}>
            {successMessage}
          </AlertBanner>
        )}

        {conflictError && (
          <AlertBanner
            variant="warning"
            title="Subscription changed elsewhere"
            action={{ label: "Refresh subscription", onClick: () => void reload() }}
          >
            {conflictError}
          </AlertBanner>
        )}

        {skipError && (
          <AlertBanner
            variant="error"
            title="Couldn't skip shipment"
            action={{ label: "Try again", onClick: handleOpenSkipModal }}
          >
            {skipError}
          </AlertBanner>
        )}

        <SurfaceCard
          tone="frame"
          className={`p-5 sm:p-6 space-y-5 ${
            subscription.status === "cancelled" ? "bg-brand-cream/40" : ""
          }`.trim()}
        >
          <SubscriptionHeader
            id={subscription.id}
            status={subscription.status}
            headingId={headingId}
          />

          <SubscriptionStatusCallout subscription={subscription} />

          <SubscriptionItemList
            items={subscription.items}
            discountPercent={subscription.discountPercent}
            status={subscription.status}
          />

          {isActive && subscription.nextChargeAt && (
            <div className="pt-3 border-t border-brand-border space-y-2">
              <Button variant="secondary" size="lg" fullWidth onClick={handleOpenSkipModal}>
                Skip next shipment
              </Button>
              <p className="text-xs text-brand-muted text-center">
                Moves your next charge forward by {subscription.intervalDays} days. Cancel or pause anytime.
              </p>
            </div>
          )}
        </SurfaceCard>
      </div>

      {isActive && subscription.nextChargeAt && (
        <SkipConfirmationModal
          isOpen={isConfirmModalOpen}
          isSkipping={isSkipping}
          nextChargeAt={subscription.nextChargeAt}
          intervalDays={subscription.intervalDays}
          nextChargeTotalCents={subscription.nextChargeTotalCents}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={() => void confirmSkip(() => setIsConfirmModalOpen(false))}
        />
      )}
    </section>
  );
}
