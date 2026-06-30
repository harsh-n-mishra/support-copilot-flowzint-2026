import { GlassCard } from "../../components/cards/GlassCard";
import { ProgressBar } from "../../components/charts/ProgressBar";
import { getAIInsightsModel } from "./selectors";

export function ExecutiveSummary() {
  const { insights } = getAIInsightsModel();
  return (
    <GlassCard className="p-5">
      <div className="grid gap-5 xl:grid-cols-[1fr_280px]">
        <div><p className="text-xs uppercase tracking-[0.25em] text-violet-200">AI-powered recommendations</p><h1 className="mt-2 text-2xl font-semibold">AI Insights</h1><ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">{insights.executiveSummary.map((item)=><li key={item} className="leading-6">• {item}</li>)}</ul></div>
        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4"><p className="text-sm font-semibold">Confidence Summary</p><div className="mt-4 space-y-3"><ProgressBar value={100 - insights.futureGrowth.expectedEscalationReduction} variant="success" /><p className="text-3xl font-semibold text-emerald-300">+{insights.futureGrowth.expectedConfidenceGain}%</p><p className="text-xs text-[var(--color-text-muted)]">expected confidence gain after recommended actions</p></div></div>
      </div>
    </GlassCard>
  );
}
