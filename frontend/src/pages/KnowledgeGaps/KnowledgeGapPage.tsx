import { GlassCard } from "../../components/cards/GlassCard";
import { GapCards } from "./GapCards";
import { GapTable } from "./GapTable";
import { MissingTopicsChart } from "./MissingTopicsChart";
import { AIRecommendationCard } from "./AIRecommendationCard";
import { getKnowledgeGapModel } from "./selectors";

export function KnowledgeGapPage() {
  const { recentGaps } = getKnowledgeGapModel();
  return (
    <main className="space-y-5" aria-label="Knowledge gaps page">
      <GlassCard className="p-5"><p className="text-xs uppercase tracking-[0.25em] text-violet-200">Knowledge operations</p><h1 className="mt-2 text-2xl font-semibold">Knowledge Gaps</h1><p className="mt-1 text-sm text-[var(--color-text-muted)]">Identify and prioritize missing content across support workflows.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{recentGaps.slice(0,3).map((gap)=><div key={gap.id} className="rounded-xl bg-white/[0.04] p-3"><p className="text-sm font-medium">{gap.title}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">{gap.frequency} requests · {gap.priority}</p></div>)}</div></GlassCard>
      <GapCards />
      <MissingTopicsChart />
      <AIRecommendationCard />
      <GapTable />
    </main>
  );
}
