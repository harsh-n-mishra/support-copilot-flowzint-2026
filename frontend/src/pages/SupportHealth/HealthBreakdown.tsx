import { Card } from "../../components/ui/Card";
import { BarChart } from "../../components/charts";
import { MetricProgress } from "../../components/progress/MetricProgress";
import { StatusCard } from "../../components/cards/StatusCard";
import { getSupportHealthModel } from "./selectors";

export function HealthBreakdown() {
  const { health, alerts } = getSupportHealthModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Health breakdown">
      <Card title="Health Breakdown" variant="glass" className="xl:col-span-2"><BarChart data={health.healthBreakdown} series={[{ key: "value", label: "Score", color: "#22c55e" }]} layout="horizontal" /></Card>
      <Card title="System Status" variant="glass"><div className="space-y-4">{health.healthBreakdown.map((item)=><MetricProgress key={item.label} label={item.label} value={item.value} />)}</div></Card>
      <div className="grid gap-4 xl:col-span-3 md:grid-cols-2 xl:grid-cols-4">{health.componentStatus.map((component)=><StatusCard key={component.component} label={component.component} status={component.status} value={component.value} description="Component health" />)}</div>
      <Card title="Alerts" variant="glass" className="xl:col-span-3">{alerts.length ? <div className="grid gap-3 md:grid-cols-2">{alerts.map((alert)=><div key={alert.component} className="rounded-xl bg-amber-400/10 p-3 text-sm">{alert.component} needs attention at {alert.value}%.</div>)}</div> : <p className="text-sm text-emerald-300">No active system alerts.</p>}</Card>
    </section>
  );
}
