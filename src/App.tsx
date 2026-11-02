import { SubscriptionCard } from "./part-a/SubscriptionCard";
import { BuyBox } from "./part-b/BuyBox";

const params = new URLSearchParams(window.location.search);
const part = params.get("part") === "b" ? "b" : "a";
const currentFixture = params.get("fixture") ?? "active";
const hasConflict = params.get("conflict") === "always";

const PART_A_FIXTURES = [
  { label: "Active", href: "?part=a&fixture=active", isCurrent: currentFixture === "active" && !hasConflict },
  { label: "Paused", href: "?part=a&fixture=paused", isCurrent: currentFixture === "paused" },
  { label: "Cancelled", href: "?part=a&fixture=cancelled", isCurrent: currentFixture === "cancelled" },
  { label: "Error (500)", href: "?part=a&fixture=error", isCurrent: currentFixture === "error" },
  { label: "Conflict (409)", href: "?part=a&fixture=active&conflict=always", isCurrent: hasConflict },
];

export function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-brand-cream text-brand-ink">
      <header className="border-b border-brand-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-buybox mx-auto px-4 py-2 sm:px-6 lg:px-16 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
          <nav aria-label="Test parts" className="flex items-center gap-1.5">
            <a
              href="?part=a&fixture=active"
              aria-current={part === "a" ? "page" : undefined}
              className={`min-h-9 inline-flex items-center px-3.5 py-1.5 rounded-full transition-colors ${
                part === "a"
                  ? "bg-brand-forest text-white font-semibold"
                  : "text-brand-slate hover:text-brand-ink hover:bg-brand-cream"
              }`}
            >
              Part A: Subscription card
            </a>
            <a
              href="?part=b"
              aria-current={part === "b" ? "page" : undefined}
              className={`min-h-9 inline-flex items-center px-3.5 py-1.5 rounded-full transition-colors ${
                part === "b"
                  ? "bg-brand-forest text-white font-semibold"
                  : "text-brand-slate hover:text-brand-ink hover:bg-brand-cream"
              }`}
            >
              Part B: Buy box
            </a>
          </nav>

          {part === "a" && (
            <nav aria-label="Subscription test fixtures" className="flex flex-wrap items-center gap-1 py-0.5">
              <span className="text-brand-muted mr-1 hidden sm:inline">Fixture:</span>
              {PART_A_FIXTURES.map((fixture) => (
                <a
                  key={fixture.label}
                  href={fixture.href}
                  aria-current={fixture.isCurrent ? "page" : undefined}
                  className={`min-h-8 inline-flex items-center px-2.5 py-1 rounded-lg transition-colors ${
                    fixture.isCurrent
                      ? "bg-brand-sage text-brand-forest font-semibold border border-brand-forest/30"
                      : "text-brand-slate hover:text-brand-ink hover:bg-brand-cream"
                  }`}
                >
                  {fixture.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{part === "a" ? <SubscriptionCard /> : <BuyBox />}</main>
    </div>
  );
}
