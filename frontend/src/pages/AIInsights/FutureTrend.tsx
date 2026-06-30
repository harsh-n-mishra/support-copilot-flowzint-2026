import { ChartCard } from "../../components/cards/ChartCard";
import { MetricCard } from "../../components/cards/MetricCard";
import { LineChart } from "../../components/charts";
import { getAIInsightsModel } from "./selectors";

export function FutureTrend() {
  const { insights } = getAIInsightsModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Future trend">
      <ChartCard title="Predicted Trends" className="xl:col-span-2" variant="glass"><LineChart data={insights.predictedTrends} series={[{ key: "value", label: "Predicted confidence", color: "#22c55e" }]} /></ChartCard>
      <div className="grid gap-4"><MetricCard label="Future Growth" value={`+${insights.futureGrowth.expectedConversationGrowth}%`} change="expected conversation growth" icon="↗" /><MetricCard label="Escalation Reduction" value={`-${insights.futureGrowth.expectedEscalationReduction}%`} change="expected improvement" changeTone="positive" icon="✓" /></div>
      <div className="grid gap-4 xl:col-span-3 md:grid-cols-3">{insights.expectedImprovements.map((item)=><MetricCard key={item.metric} label={item.metric} value={`${item.delta > 0 ? "+" : ""}${item.delta}`} change="Expected improvement" changeTone={item.delta > 0 ? "positive" : "neutral"} />)}</div>
    </section>
  );
}
