import { InsightCard } from "../../components/cards/InsightCard";
import { Card } from "../../components/ui/Card";
import { getAIInsightsModel } from "./selectors";

export function RisksGrid() {
  const { insights } = getAIInsightsModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Top risks and priority matrix">
      {insights.topRisks.map((risk)=><InsightCard key={risk.title} eyebrow="Key risk" title={risk.title} description={risk.description} impact={risk.impact} icon="!" />)}
      <Card title="Priority Matrix" variant="glass" className="xl:col-span-3"><div className="grid gap-3 md:grid-cols-3">{insights.priorityMatrix.map((item)=><div key={item.id} className="rounded-xl bg-white/[0.04] p-3"><p className="text-sm font-semibold">{item.title}</p><p className="mt-2 text-xs text-[var(--color-text-muted)]">Impact {item.impact} · Effort {item.effort} · {item.priority}</p></div>)}</div></Card>
    </section>
  );
}
