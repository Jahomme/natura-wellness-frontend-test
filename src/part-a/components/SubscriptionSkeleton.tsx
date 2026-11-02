import { SurfaceCard } from "../../components/ui";

export function SubscriptionSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading subscription"
      className="w-full max-w-lg mx-auto px-4 py-6 sm:px-6 sm:py-10"
    >
      <div role="progressbar" aria-label="Loading subscription details" className="sr-only" />
      <SurfaceCard tone="frame" className="p-5 sm:p-6 space-y-5 animate-pulse">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-brand-border">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-brand-border rounded" />
            <div className="h-6 w-48 bg-brand-border rounded" />
          </div>
          <div className="h-6 w-20 bg-brand-border rounded-full" />
        </div>

        <div className="h-28 bg-brand-sage rounded-option border border-brand-border/60" />

        <div className="space-y-3 pt-1">
          <div className="h-3 w-36 bg-brand-border rounded" />
          <div className="h-16 bg-brand-cream rounded-option" />
          <div className="h-16 bg-brand-cream rounded-option" />
        </div>

        <div className="h-14 bg-brand-border/60 rounded-control" />
      </SurfaceCard>
    </section>
  );
}
