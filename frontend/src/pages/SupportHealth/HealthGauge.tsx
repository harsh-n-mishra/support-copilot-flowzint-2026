import { Card } from "../../components/ui/Card";
import { GaugeChart } from "../../components/charts";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { getSupportHealthModel } from "./selectors";

export function HealthGauge() {
  const { health } = getSupportHealthModel();
  return (
    <Card title="Overall Support Health Score" variant="glass" className="grid place-items-center text-center">
      <GaugeChart value={health.overallHealthScore} label="/100" />
      <StatusBadge status="Healthy" />
      <p className="mt-3 text-sm text-[var(--color-text-muted)]">Everything is operating within support thresholds.</p>
    </Card>
  );
}
