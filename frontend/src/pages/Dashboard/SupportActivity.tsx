import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/tables/DataTable";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { MetricProgress } from "../../components/progress/MetricProgress";
import { getDashboardModel } from "./selectors";

export function SupportActivity() {
  const { dashboard, topAgents, systemStatus } = getDashboardModel();
  return <section className="grid gap-4 xl:grid-cols-3" aria-label="Support activity"><Card title="Recent Activity" variant="glass" className="xl:col-span-2"><DataTable data={dashboard.recentActivityFeed as unknown as Record<string, unknown>[]} pageSize={5} columns={[{key:"title",header:"Intent"},{key:"user",header:"User"},{key:"status",header:"Status",cell:(r)=><StatusBadge status={String(r.status)} />},{key:"timestamp",header:"Time",cell:(r)=>new Date(String(r.timestamp)).toLocaleTimeString()}]} /></Card><Card title="Top Performing Agents" variant="glass"><div className="space-y-4">{topAgents.map(a=><div key={a.id} className="rounded-xl bg-white/[0.04] p-3"><div className="flex justify-between text-sm"><span>{a.name}</span><StatusBadge status={a.currentStatus} /></div><MetricProgress label="Resolution" value={a.resolutionRate} /></div>)}</div></Card><Card title="System Status" variant="glass" className="xl:col-span-3"><div className="grid gap-3 md:grid-cols-4">{systemStatus.map(s=><div key={s.component} className="rounded-xl bg-white/[0.04] p-3"><div className="mb-3 flex justify-between text-sm"><span>{s.component}</span><StatusBadge status={s.status} /></div><MetricProgress label="Score" value={s.value} /></div>)}</div></Card></section>;
}
