import { Card } from "../../components/ui/Card";
import { MetricCard } from "../../components/cards/MetricCard";
import { MetricProgress } from "../../components/progress/MetricProgress";
import { getSupportHealthModel } from "./selectors";

export function HealthMetrics() {
  const { health, healthMetrics } = getSupportHealthModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Health metrics">
      <div className="grid gap-4 sm:grid-cols-2 xl:col-span-2">
        {healthMetrics.slice(0, 4).map((metric) => <MetricCard key={metric.label} label={metric.label} value={`${metric.value}${metric.suffix}`} change="Live system metric" icon="•" />)}
      </div>
      <Card title="Performance Overview" variant="glass"><div className="space-y-4"><MetricProgress label="Resolution Time" value={Math.round((1 / health.averageResolutionTime) * 100)} /><MetricProgress label="Availability" value={Math.round(health.systemAvailability)} /><MetricProgress label="Customer Satisfaction" value={Math.round((health.customerSatisfaction / 5) * 100)} /></div></Card>
    </section>
  );
}
