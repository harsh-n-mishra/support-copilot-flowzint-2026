import { ChartCard } from "../../components/cards/ChartCard";
import { LineChart, AreaChart } from "../../components/charts";
import { getSupportHealthModel } from "./selectors";

export function HealthTrend() {
  const { health } = getSupportHealthModel();
  return (
    <section className="grid gap-4 xl:grid-cols-2" aria-label="Health trends">
      <ChartCard title="Weekly Health Trend" variant="glass"><AreaChart data={health.weeklyHealthHistory} series={[{ key: "score", label: "Weekly score", color: "#22c55e" }]} /></ChartCard>
      <ChartCard title="Monthly Health Trend" variant="glass"><LineChart data={health.monthlyHealthHistory} series={[{ key: "score", label: "Monthly score", color: "#8b5cf6" }]} /></ChartCard>
    </section>
  );
}
