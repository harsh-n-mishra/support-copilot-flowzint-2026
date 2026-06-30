import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { MetricProgress } from "../../components/progress/MetricProgress";
import { getAIInsightsModel } from "./selectors";

export function RecommendationList() {
  const { insights } = getAIInsightsModel();
  return (
    <section className="grid gap-4 xl:grid-cols-2" aria-label="Recommendations and insights">
      <Card title="Recommendations" variant="glass"><div className="space-y-3">{insights.recommendations.map((rec)=><div key={rec.id} className="rounded-xl bg-white/[0.04] p-3"><div className="flex justify-between gap-3"><p className="text-sm font-semibold">{rec.title}</p><PriorityBadge priority={rec.priority} /></div><MetricProgress label="Expected impact" value={rec.impact} /></div>)}</div></Card>
      <Card title="Business & Operational Insights" variant="glass"><div className="space-y-4">{insights.businessInsights.map((item)=><div key={item.title} className="rounded-xl border border-white/10 p-3"><p className="text-sm text-[var(--color-text-muted)]">{item.title}</p><p className="mt-1 text-lg font-semibold">{item.value}</p></div>)}{insights.operationalRisks.map((risk)=><div key={risk.area} className="rounded-xl bg-rose-500/10 p-3 text-sm">{risk.area}: {risk.risk} ({risk.severity})</div>)}</div></Card>
    </section>
  );
}
