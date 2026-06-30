import { ExecutiveSummary } from "./ExecutiveSummary";
import { RisksGrid } from "./RisksGrid";
import { RecommendationList } from "./RecommendationList";
import { MissingDocs } from "./MissingDocs";
import { FutureTrend } from "./FutureTrend";

export function AIInsightsPage() {
  return (
    <main className="space-y-5" aria-label="AI insights page">
      <ExecutiveSummary />
      <RisksGrid />
      <RecommendationList />
      <MissingDocs />
      <FutureTrend />
    </main>
  );
}
