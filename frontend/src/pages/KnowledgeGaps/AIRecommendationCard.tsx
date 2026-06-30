import { Card } from "../../components/ui/Card";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { ProgressBar } from "../../components/charts/ProgressBar";
import { getKnowledgeGapModel } from "./selectors";

export function AIRecommendationCard() {
  const { summary, highPriorityGaps } = getKnowledgeGapModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Knowledge recommendations">
      <Card title="AI Generated Suggestions" subtitle="Recommended documentation to improve coverage" variant="glass" className="xl:col-span-2">
        <div className="grid gap-3 md:grid-cols-2">
          {summary.aiRecommendations.map((recommendation) => (
            <article key={recommendation.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-violet-400/40">
              <div className="flex items-start justify-between gap-3"><h3 className="text-sm font-semibold">{recommendation.title}</h3><PriorityBadge priority={recommendation.priority} /></div>
              <p className="mt-3 text-xs text-[var(--color-text-muted)]">Estimated resolution benefit</p>
              <ProgressBar value={recommendation.impact} max={40} variant="success" className="mt-2" />
            </article>
          ))}
        </div>
      </Card>
      <Card title="Business Impact" subtitle="Highest-impact topics" variant="glass">
        <div className="space-y-3">
          {highPriorityGaps.slice(0, 4).map((gap) => (
            <div key={gap.id} className="rounded-xl bg-white/[0.04] p-3">
              <div className="flex justify-between gap-3 text-sm"><span>{gap.title}</span><span className="text-emerald-300">+{gap.estimatedResolutionBenefit}%</span></div>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">{gap.affectedUsers} affected users · {gap.recommendedDocumentation}</p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
