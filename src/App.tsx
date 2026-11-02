import { SubscriptionCard } from "./part-a/SubscriptionCard";
import { BuyBox } from "./part-b/BuyBox";

const params = new URLSearchParams(window.location.search);
const part = params.get("part") === "b" ? "b" : "a";
const currentFixture = params.get("fixture") ?? "active";
const hasConflict = params.get("conflict") === "always";

export function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-brand-cream text-brand-ink">
      <header className="border-b border-brand-border/80 bg-white/70 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-buybox mx-auto px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
          {/* Main Part Navigation */}
          <nav aria-label="Test parts" className="flex items-center gap-1">
            <a
              href="?part=a&fixture=active"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                part === "a"
                  ? "bg-brand-forest text-white font-semibold"
                  : "text-brand-slate hover:text-brand-ink hover:bg-brand-cream"
              }`}
            >
              Part A: Subscription card
            </a>
            <a
              href="?part=b"
              className={`px-3 py-1.5 rounded-full transition-colors ${
                part === "b"
                  ? "bg-brand-forest text-white font-semibold"
                  : "text-brand-slate hover:text-brand-ink hover:bg-brand-cream"
              }`}
            >
              Part B: Buy box
            </a>
          </nav>

          {/* Quick fixture switcher for Part A */}
          {part === "a" && (
            <div className="flex items-center gap-1 overflow-x-auto py-1 text-[11px]">
              <span className="text-brand-muted mr-1 hidden sm:inline">Fixtures:</span>
              <a
                href="?part=a&fixture=active"
                className={`px-2 py-1 rounded transition-colors ${
                  currentFixture === "active" && !hasConflict
                    ? "bg-brand-sage text-brand-forest font-bold border border-brand-forest/30"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                Active
              </a>
              <a
                href="?part=a&fixture=paused"
                className={`px-2 py-1 rounded transition-colors ${
                  currentFixture === "paused"
                    ? "bg-status-paused-bg text-status-paused-text font-bold border border-status-paused-border"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                Paused
              </a>
              <a
                href="?part=a&fixture=cancelled"
                className={`px-2 py-1 rounded transition-colors ${
                  currentFixture === "cancelled"
                    ? "bg-status-cancelled-bg text-status-cancelled-text font-bold border border-status-cancelled-border"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                Cancelled
              </a>
              <a
                href="?part=a&fixture=error"
                className={`px-2 py-1 rounded transition-colors ${
                  currentFixture === "error"
                    ? "bg-status-error-bg text-status-error-text font-bold border border-status-error-border"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                Error (500)
              </a>
              <a
                href="?part=a&fixture=active&conflict=always"
                className={`px-2 py-1 rounded transition-colors ${
                  hasConflict
                    ? "bg-amber-100 text-amber-900 font-bold border border-amber-300"
                    : "text-brand-slate hover:text-brand-ink"
                }`}
              >
                Conflict (409)
              </a>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center">
        {part === "a" ? <SubscriptionCard /> : <BuyBox />}
      </main>
    </div>
  );
}
