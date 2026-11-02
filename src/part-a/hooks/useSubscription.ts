import { useCallback, useEffect, useState } from "react";
import { getSubscription, skipNextShipment } from "../../api/mockApi";
import { ApiError, type Subscription } from "../../api/types";
import { formatDate } from "../../utils/format";

export interface UseSubscriptionResult {
  subscription: Subscription | null;
  isLoading: boolean;
  loadError: string | null;
  isSkipping: boolean;
  conflictError: string | null;
  skipError: string | null;
  successMessage: string | null;
  reload: () => Promise<void>;
  confirmSkip: (onBeforeFeedback?: () => void) => Promise<void>;
  dismissSuccess: () => void;
  clearSkipErrors: () => void;
}

export function useSubscription(): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSkipping, setIsSkipping] = useState(false);
  const [conflictError, setConflictError] = useState<string | null>(null);
  const [skipError, setSkipError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    setConflictError(null);
    setSkipError(null);

    try {
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setLoadError(err.message);
      } else {
        setLoadError("Unable to load subscription details. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialFetch() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const data = await getSubscription();
        if (!cancelled) {
          setSubscription(data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof ApiError
              ? err.message
              : "Unable to load subscription details. Please check your connection.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void initialFetch();
    return () => {
      cancelled = true;
    };
  }, []);

  const clearSkipErrors = useCallback(() => {
    setConflictError(null);
    setSkipError(null);
  }, []);

  const dismissSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  const confirmSkip = useCallback(
    async (onBeforeFeedback?: () => void) => {
      if (!subscription) return;

      setIsSkipping(true);
      setConflictError(null);
      setSkipError(null);
      setSuccessMessage(null);

      try {
        const updated = await skipNextShipment({
          subscriptionId: subscription.id,
          expectedUpdatedAt: subscription.updatedAt,
        });
        // Exit modal inert state before mounting status live-region banner
        onBeforeFeedback?.();
        setSubscription(updated);
        const nextDateText = updated.nextChargeAt ? formatDate(updated.nextChargeAt) : "the next cycle";
        setSuccessMessage(
          `Shipment skipped. Your next refill is now scheduled for ${nextDateText}.`,
        );
      } catch (err) {
        onBeforeFeedback?.();
        if (err instanceof ApiError && err.status === 409) {
          setConflictError(
            "Your subscription was updated elsewhere (for example, in another tab or by support), so we didn't skip this shipment yet. Refresh to review the latest details.",
          );
        } else {
          setSkipError(
            "We couldn't skip this shipment right now. Your billing schedule hasn't changed.",
          );
        }
      } finally {
        setIsSkipping(false);
      }
    },
    [subscription],
  );

  return {
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
  };
}
