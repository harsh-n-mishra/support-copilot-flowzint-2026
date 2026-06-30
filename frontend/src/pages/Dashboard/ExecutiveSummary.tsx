import { GlassCard } from "../../components/cards/GlassCard";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { getDashboardModel } from "./selectors";

export function ExecutiveSummary() {
  const { dashboard } = getDashboardModel();
  return <section className="animate-fade-in" aria-labelledby="executive-summary"><GlassCard className="p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs uppercase tracking-[0.25em] text-violet-200">Executive overview</p><h1 id="executive-summary" className="mt-2 text-2xl font-semibold">Dashboard</h1><p className="mt-1 max-w-2xl text-sm text-[var(--color-text-muted)]">AI support operations are healthy with strong confidence, low escalations, and steady conversation growth.</p></div><StatusBadge status="Healthy" /></div><div className="mt-5 grid gap-3 md:grid-cols-3">{dashboard.recentAlerts.slice(0,3).map(a=><div key={a.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><p className="text-sm font-medium">{a.title}</p><p className="mt-1 text-xs text-[var(--color-text-muted)]">Recent alert · {a.severity}</p></div>)}</div></GlassCard></section>;
}
