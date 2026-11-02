import { useEffect, useState, useRef } from "react";
import { getSubscription, skipNextShipment } from "../api/mockApi";
import { ApiError, type Subscription } from "../api/types";
import { formatCents, formatDate, addDaysToIso, formatRelativeDays } from "../utils/format";

export function SubscriptionCard() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Skip shipment state
  const [isSkipping, setIsSkipping] = useState(false);
  const [skipConflictError, setSkipConflictError] = useState<string | null>(null);
  const [skipGeneralError, setSkipGeneralError] = useState<string | null>(null);
  const [skipSuccessMessage, setSkipSuccessMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDialogElement>(null);

  async function loadData() {
    setIsLoading(true);
    setLoadError(null);
    setSkipConflictError(null);
    setSkipGeneralError(null);
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
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenSkipModal() {
    setSkipConflictError(null);
    setSkipGeneralError(null);
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }

  function handleCloseSkipModal() {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }

  async function handleConfirmSkip() {
    if (!subscription) return;
    setIsSkipping(true);
    setSkipConflictError(null);
    setSkipGeneralError(null);
    setSkipSuccessMessage(null);

    try {
      const updated = await skipNextShipment({
        subscriptionId: subscription.id,
        expectedUpdatedAt: subscription.updatedAt,
      });
      // Close dialog before updating UI states so announcements don't fire inside inert DOM
      handleCloseSkipModal();
      setSubscription(updated);
      const newChargeFormatted = updated.nextChargeAt ? formatDate(updated.nextChargeAt) : "the following cycle";
      setSkipSuccessMessage(`Your next shipment has been skipped. You will not be charged until ${newChargeFormatted}.`);
    } catch (err) {
      // Close modal first so alerts can be focused and announced outside of inert tree
      handleCloseSkipModal();
      if (err instanceof ApiError && err.status === 409) {
        setSkipConflictError(
          "Your subscription was updated elsewhere while this page was open. We did not skip this shipment to avoid unintended changes."
        );
      } else if (err instanceof ApiError) {
        setSkipGeneralError(err.message);
      } else {
        setSkipGeneralError("We could not skip your shipment right now. Your billing schedule has not been changed.");
      }
    } finally {
      setIsSkipping(false);
    }
  }

  // SKELETON LOADING STATE
  if (isLoading) {
    return (
      <section
        aria-busy="true"
        aria-label="Loading subscription card"
        className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-8"
      >
        <div role="progressbar" aria-label="Loading subscription details" className="sr-only" />
        <div className="bg-white border border-brand-border rounded-option p-5 sm:p-6 shadow-card space-y-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-6 w-44 bg-brand-border/60 rounded" />
            <div className="h-6 w-20 bg-brand-border/60 rounded-full" />
          </div>
          <div className="h-28 bg-brand-sage/60 rounded-option" />
          <div className="space-y-3 pt-2">
            <div className="h-16 bg-brand-cream rounded-lg" />
            <div className="h-16 bg-brand-cream rounded-lg" />
          </div>
          <div className="h-12 bg-brand-border/40 rounded-control" />
        </div>
      </section>
    );
  }

  // INITIAL LOAD ERROR STATE
  if (loadError || !subscription) {
    return (
      <section
        role="alert"
        aria-labelledby="error-heading"
        className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="bg-status-error-bg border border-status-error-border rounded-option p-6 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-700">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.01" />
            </svg>
          </div>
          <div>
            <h2 id="error-heading" className="text-lg font-semibold text-status-error-text">
              Failed to load subscription
            </h2>
            <p className="mt-1 text-sm text-brand-slate">
              {loadError ?? "An unexpected error occurred while retrieving your subscription."}
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 min-h-tap bg-brand-forest hover:bg-brand-forest-hover active:bg-brand-forest-active text-white text-sm font-semibold rounded-control transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  const { status, items, discountPercent, intervalDays, nextChargeAt, nextChargeTotalCents, pausedUntil, cancelledAt } =
    subscription;
  const isActive = status === "active";
  const isPaused = status === "paused";
  const isCancelled = status === "cancelled";

  const nextChargeFormatted = nextChargeAt ? formatDate(nextChargeAt) : null;
  const relativeChargeDay = nextChargeAt ? formatRelativeDays(nextChargeAt) : null;
  const postSkipChargeDate = nextChargeAt ? addDaysToIso(nextChargeAt, intervalDays) : null;
  const postSkipFormatted = postSkipChargeDate ? formatDate(postSkipChargeDate) : null;

  return (
    <section aria-labelledby="subscription-heading" className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-8">
      {/* SUCCESS NOTIFICATION */}
      {skipSuccessMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 bg-status-active-bg border border-status-active-border text-status-active-text rounded-option p-4 flex items-start gap-3"
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-forest" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 text-sm leading-relaxed">{skipSuccessMessage}</div>
          <button
            type="button"
            onClick={() => setSkipSuccessMessage(null)}
            className="text-brand-forest hover:text-brand-ink text-xs font-semibold p-1"
            aria-label="Dismiss success message"
          >
            ✕
          </button>
        </div>
      )}

      {/* CONFLICT 409 NOTIFICATION */}
      {skipConflictError && (
        <div
          role="alert"
          className="mb-4 bg-status-paused-bg border border-status-paused-border text-status-paused-text rounded-option p-4 space-y-3"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-brand-badge-text" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-sm leading-relaxed">{skipConflictError}</div>
          </div>
          <div className="pl-8">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center justify-center px-4 py-2 bg-brand-badge-text text-white hover:bg-yellow-900 text-xs font-semibold rounded-control transition-colors cursor-pointer"
            >
              Refresh subscription details
            </button>
          </div>
        </div>
      )}

      {/* GENERAL SKIP ERROR */}
      {skipGeneralError && (
        <div
          role="alert"
          className="mb-4 bg-status-error-bg border border-status-error-border text-status-error-text rounded-option p-4 flex items-start gap-3"
        >
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1 text-sm leading-relaxed">{skipGeneralError}</div>
          <button
            type="button"
            onClick={handleOpenSkipModal}
            className="text-red-900 underline text-xs font-semibold whitespace-nowrap self-center"
          >
            Try again
          </button>
        </div>
      )}

      {/* MAIN SUBSCRIPTION CARD */}
      <div className="bg-white border border-brand-border rounded-option p-5 sm:p-6 shadow-card space-y-6">
        {/* HEADER: Title & Status Badge */}
        <div className="flex items-center justify-between gap-3 border-b border-brand-border/60 pb-4">
          <div>
            <h1 id="subscription-heading" className="text-xl font-semibold text-brand-ink">
              Subscription
            </h1>
            <p className="text-xs text-brand-muted mt-0.5 font-mono">ID: {subscription.id}</p>
          </div>

          {/* Status Badge */}
          {isActive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-active-bg text-status-active-text border border-status-active-border">
              <span className="w-2 h-2 rounded-full bg-brand-forest" aria-hidden="true" />
              Active
            </span>
          )}

          {isPaused && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-paused-bg text-status-paused-text border border-status-paused-border">
              <svg className="w-3 h-3 text-status-paused-text" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 7.25 3h-1.5ZM12.75 3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-1.5Z" />
              </svg>
              Paused
            </span>
          )}

          {isCancelled && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-status-cancelled-bg text-status-cancelled-text border border-status-cancelled-border">
              <svg className="w-3 h-3 text-status-cancelled-text" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                  clipRule="evenodd"
                />
              </svg>
              Cancelled
            </span>
          )}
        </div>

        {/* STATUS SPECIFIC HERO CALLOUT */}
        {isActive && nextChargeAt && nextChargeTotalCents !== null && (
          <div className="bg-brand-sage border border-brand-forest/20 rounded-option p-4 sm:p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-forest">Next shipment</span>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div className="text-lg font-bold text-brand-ink">
                {nextChargeFormatted}
                {relativeChargeDay && <span className="ml-2 text-xs font-medium text-brand-forest">({relativeChargeDay})</span>}
              </div>
              <div className="text-xl font-bold text-brand-forest tabular-nums">{formatCents(nextChargeTotalCents)}</div>
            </div>
            <p className="text-xs text-brand-slate leading-relaxed">
              Includes {discountPercent}% subscriber savings. Refills every {intervalDays} days.
            </p>
          </div>
        )}

        {isPaused && (
          <div className="bg-status-paused-bg border border-status-paused-border text-status-paused-text rounded-option p-4 space-y-1">
            <div className="font-semibold text-sm">Subscription Paused</div>
            <p className="text-xs leading-relaxed">
              Your subscription is paused until {pausedUntil ? formatDate(pausedUntil) : "further notice"}. You will not
              receive shipments or be charged while your subscription is paused.
            </p>
          </div>
        )}

        {isCancelled && (
          <div className="bg-status-cancelled-bg border border-status-cancelled-border text-status-cancelled-text rounded-option p-4 space-y-1">
            <div className="font-semibold text-sm">Subscription Cancelled</div>
            <p className="text-xs leading-relaxed">
              This subscription was cancelled on {cancelledAt ? formatDate(cancelledAt) : "a prior date"}. You will not
              be billed again.
            </p>
          </div>
        )}

        {/* ITEMS LIST */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-muted mb-3">
            Products in this refill ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h2>
          <ul role="list" className="divide-y divide-brand-border/60">
            {items.map((item) => {
              const discountedUnit = Math.round((item.unitPriceCents * (100 - discountPercent)) / 100);
              const totalDiscounted = discountedUnit * item.quantity;
              const totalOriginal = item.unitPriceCents * item.quantity;

              return (
                <li key={item.sku} className="py-3 flex items-center gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-12 h-12 flex-shrink-0 bg-brand-cream border border-brand-border rounded-lg overflow-hidden flex items-center justify-center p-1">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
                    ) : (
                      <svg className="w-6 h-6 text-brand-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                      </svg>
                    )}
                  </div>

                  {/* Item Description */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-brand-ink truncate">{item.name}</div>
                    <div className="text-xs text-brand-slate mt-0.5">
                      <span className="inline-block bg-brand-cream px-1.5 py-0.5 rounded text-[11px] font-semibold text-brand-ink mr-2">
                        Qty {item.quantity}
                      </span>
                      <span>{formatCents(discountedUnit)} each</span>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-brand-ink tabular-nums">
                      {formatCents(totalDiscounted)}
                    </div>
                    {isActive && (
                      <div className="text-xs text-brand-muted line-through tabular-nums">
                        {formatCents(totalOriginal)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ACTIONS SECTION */}
        {isActive && (
          <div className="pt-2 border-t border-brand-border/60">
            <button
              type="button"
              onClick={handleOpenSkipModal}
              className="w-full min-h-tap inline-flex items-center justify-center px-4 py-3 border border-brand-input-border hover:border-brand-forest bg-white hover:bg-brand-sage text-brand-forest text-sm font-semibold rounded-control transition-colors cursor-pointer"
            >
              Skip next shipment
            </button>
            <p className="text-[11px] text-brand-muted text-center mt-2">
              Skipping moves your next charge date back by {intervalDays} days.
            </p>
          </div>
        )}
      </div>

      {/* ACCIDENTAL SKIP CONFIRMATION MODAL (<dialog>) */}
      <dialog
        ref={dialogRef}
        aria-labelledby="skip-dialog-title"
        aria-describedby="skip-dialog-desc"
        className="backdrop:bg-brand-ink/45 backdrop:backdrop-blur-sm p-0 bg-transparent w-full sm:max-w-md mx-auto mt-auto sm:my-auto mb-0 rounded-t-frame sm:rounded-frame overflow-hidden focus:outline-none"
      >
        <div className="bg-white border border-brand-border rounded-t-frame sm:rounded-frame p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 id="skip-dialog-title" className="text-lg font-bold text-brand-ink">
              Skip your next shipment?
            </h2>
            <button
              type="button"
              onClick={handleCloseSkipModal}
              disabled={isSkipping}
              className="text-brand-muted hover:text-brand-ink p-1 rounded transition-colors"
              aria-label="Close skip shipment modal"
            >
              ✕
            </button>
          </div>

          <p id="skip-dialog-desc" className="text-sm text-brand-slate leading-relaxed">
            You won't receive this order, and you won't be charged for it. Your subscription will resume automatically on
            the next cycle.
          </p>

          {/* Before & After comparison */}
          <div className="bg-brand-cream border border-brand-border rounded-option p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center text-brand-slate">
              <span>Current scheduled charge:</span>
              <span className="font-semibold text-brand-ink line-through">{nextChargeFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-brand-forest font-medium pt-1 border-t border-brand-border/40">
              <span>New scheduled charge:</span>
              <span className="font-bold text-sm text-brand-forest">{postSkipFormatted}</span>
            </div>
          </div>

          {/* Action buttons (Autofocus on safe option to avoid accidental clicks) */}
          <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              autoFocus
              onClick={handleCloseSkipModal}
              disabled={isSkipping}
              className="w-full sm:flex-1 min-h-tap inline-flex items-center justify-center px-4 py-2.5 border border-brand-input-border text-brand-ink text-sm font-semibold rounded-control hover:bg-brand-cream transition-colors cursor-pointer"
            >
              Keep shipment
            </button>
            <button
              type="button"
              onClick={handleConfirmSkip}
              disabled={isSkipping}
              className="w-full sm:flex-1 min-h-tap inline-flex items-center justify-center px-4 py-2.5 bg-brand-forest hover:bg-brand-forest-hover active:bg-brand-forest-active text-white text-sm font-semibold rounded-control transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSkipping ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Skipping...
                </span>
              ) : (
                "Yes, skip shipment"
              )}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
