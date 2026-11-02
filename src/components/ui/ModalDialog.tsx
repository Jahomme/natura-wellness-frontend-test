import { useEffect, useId, useRef, type ReactNode } from "react";
import { CloseIcon } from "./Icons";

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Blocks Escape, backdrop, and close button dismissal while an async mutation is in flight. */
  preventClose?: boolean;
  children: ReactNode;
}

/**
 * Accessible native `<dialog>` modal using `.showModal()`.
 * Styled mobile-first as a thumb-zone bottom sheet (with safe-area inset padding) on <640px phones,
 * transitioning to a centered BuyBox-framed card (`rounded-frame`, `#E7E1D6` border) on `sm:`+.
 */
export function ModalDialog({
  isOpen,
  onClose,
  title,
  description,
  preventClose = false,
  children,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleCancel(e: React.SyntheticEvent<HTMLDialogElement>) {
    if (preventClose) {
      e.preventDefault();
      return;
    }
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (preventClose) return;
    if (e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onCancel={handleCancel}
      onClose={() => {
        if (isOpen && !preventClose) onClose();
      }}
      onClick={handleBackdropClick}
      className="p-0 bg-transparent text-brand-ink w-full max-w-none sm:max-w-md mx-auto mt-auto mb-0 sm:my-auto rounded-t-frame sm:rounded-frame overflow-visible"
    >
      <div className="bg-white border border-brand-border rounded-t-frame sm:rounded-frame p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-6 shadow-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 id={titleId} className="font-serif text-xl font-semibold text-brand-forest leading-snug">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={preventClose}
            aria-label="Close dialog"
            className="min-w-11 min-h-11 -mr-2 -mt-2 inline-flex items-center justify-center rounded-control text-brand-muted hover:text-brand-ink hover:bg-brand-cream disabled:opacity-40 transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {description && (
          <p id={descId} className="text-sm text-brand-slate leading-relaxed">
            {description}
          </p>
        )}

        {children}
      </div>
    </dialog>
  );
}
