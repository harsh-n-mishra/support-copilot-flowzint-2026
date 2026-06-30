import { GlassCard } from "../../components/cards/GlassCard";
import { HealthGauge } from "./HealthGauge";
import { HealthMetrics } from "./HealthMetrics";
import { HealthTrend } from "./HealthTrend";
import { HealthBreakdown } from "./HealthBreakdown";
import { getSupportHealthModel } from "./selectors";

export function SupportHealthPage() {
  const { health } = getSupportHealthModel();
  return (
    <main className="space-y-5" aria-label="Support health page">
      <GlassCard className="p-5"><p className="text-xs uppercase tracking-[0.25em] text-violet-200">Real-time health</p><h1 className="mt-2 text-2xl font-semibold">Support Health</h1><p className="mt-1 text-sm text-[var(--color-text-muted)]">Monitor retrieval quality, knowledge coverage, escalation load, latency, and system availability.</p><div className="mt-4 grid gap-3 md:grid-cols-4"><span className="rounded-xl bg-white/[0.04] p-3 text-sm">Score {health.overallHealthScore}/100</span><span className="rounded-xl bg-white/[0.04] p-3 text-sm">CSAT {health.customerSatisfaction}/5</span><span className="rounded-xl bg-white/[0.04] p-3 text-sm">Latency {health.latencyMs}ms</span><span className="rounded-xl bg-white/[0.04] p-3 text-sm">Availability {health.systemAvailability}%</span></div></GlassCard>
      <section className="grid gap-4 xl:grid-cols-[360px_1fr]"><HealthGauge /><HealthMetrics /></section>
      <HealthTrend />
      <HealthBreakdown />
    </main>
  );
}
