import { MetricCard } from "../../components/cards/MetricCard";
import { ProgressBar } from "../../components/charts/ProgressBar";
import { getKnowledgeGapModel } from "./selectors";

export function GapCards() {
  const { summary, coverage } = getKnowledgeGapModel();
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Knowledge gap metrics">
      <MetricCard label="Detected Gaps" value={summary.detectedGaps} change="+12.4% in last 7 days" changeTone="positive" icon="⌕" />
      <MetricCard label="Critical Gaps" value={summary.criticalGapCount} change="Needs review" changeTone="negative" icon="!" />
      <MetricCard label="High Priority" value={summary.criticalGaps.length} change="Ready for docs" changeTone="neutral" icon="↗" />
      <MetricCard label="Knowledge Coverage" value={`${coverage}%`} change="+2.8% this month" changeTone="positive" icon="✓"><ProgressBar value={coverage} variant="success" /></MetricCard>
    </section>
  );
}
