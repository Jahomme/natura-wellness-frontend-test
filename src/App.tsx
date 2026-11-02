import { AppHeader, type ActivePart } from "./components/layout/AppHeader";
import { SubscriptionCard } from "./part-a/SubscriptionCard";
import { BuyBox } from "./part-b/BuyBox";

export function App() {
  const params = new URLSearchParams(window.location.search);
  const part: ActivePart = params.get("part") === "b" ? "b" : "a";
  const currentFixture = params.get("fixture") ?? "active";
  const hasConflict = params.get("conflict") === "always";

  return (
    <div className="min-h-dvh flex flex-col bg-brand-cream text-brand-ink">
      <AppHeader
        part={part}
        currentFixture={currentFixture}
        hasConflict={hasConflict}
      />

      <main className="flex-1">
        {part === "a" ? <SubscriptionCard /> : <BuyBox />}
      </main>
    </div>
  );
}
