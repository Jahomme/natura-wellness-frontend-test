import { Button, ModalDialog, SurfaceCard } from "../../components/ui";
import { addDaysToIso, formatCents, formatDate } from "../../utils/format";

export interface SkipConfirmationModalProps {
  isOpen: boolean;
  isSkipping: boolean;
  nextChargeAt: string;
  intervalDays: number;
  nextChargeTotalCents: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function SkipConfirmationModal({
  isOpen,
  isSkipping,
  nextChargeAt,
  intervalDays,
  nextChargeTotalCents,
  onClose,
  onConfirm,
}: SkipConfirmationModalProps) {
  const currentChargeFormatted = formatDate(nextChargeAt);
  const newChargeFormatted = formatDate(addDaysToIso(nextChargeAt, intervalDays));

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      preventClose={isSkipping}
      title="Skip your next shipment?"
      description={`We'll skip your upcoming refill${
        nextChargeTotalCents !== null ? ` (${formatCents(nextChargeTotalCents)})` : ""
      } and move your next billing date forward by ${intervalDays} days.`}
    >
      <SurfaceCard tone="sage" className="p-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="text-brand-slate">Current charge date</span>
          <span className="font-medium text-brand-muted line-through tabular-nums">
            {currentChargeFormatted}
          </span>
        </div>

        <div className="pt-2.5 border-t border-brand-forest/15 flex items-center justify-between gap-2">
          <span className="font-medium text-brand-forest">New charge date</span>
          <span className="font-bold text-brand-forest tabular-nums">{newChargeFormatted}</span>
        </div>
      </SurfaceCard>

      <div className="pt-1 flex flex-col-reverse sm:flex-row gap-2.5">
        <Button
          variant="secondary"
          size="md"
          autoFocus
          disabled={isSkipping}
          onClick={onClose}
          className="w-full sm:flex-1"
        >
          Keep shipment
        </Button>

        <Button
          variant="primary"
          size="md"
          isLoading={isSkipping}
          loadingLabel="Skipping..."
          onClick={onConfirm}
          className="w-full sm:flex-1"
        >
          Yes, skip shipment
        </Button>
      </div>
    </ModalDialog>
  );
}
