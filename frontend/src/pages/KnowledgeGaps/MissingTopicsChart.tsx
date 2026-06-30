import { ChartCard } from "../../components/cards/ChartCard";
import { BarChart, DonutChart, LineChart } from "../../components/charts";
import { getKnowledgeGapModel } from "./selectors";

export function MissingTopicsChart() {
  const { summary, distribution, topCategories, trend, documentationStatus } = getKnowledgeGapModel();
  return (
    <section className="grid gap-4 xl:grid-cols-3" aria-label="Knowledge gap charts">
      <ChartCard title="Top Missing Categories" className="xl:col-span-2" variant="glass"><BarChart data={topCategories} series={[{ key: "value", label: "Gaps", color: "#8b5cf6" }]} layout="horizontal" /></ChartCard>
      <ChartCard title="Knowledge Gap Distribution" variant="glass"><div className="flex justify-center"><DonutChart data={distribution} centerLabel={String(summary.detectedGaps)} totalLabel="Gaps" /></div></ChartCard>
      <ChartCard title="Gap Trends" className="xl:col-span-2" variant="glass"><LineChart data={trend} series={[{ key: "gaps", label: "Detected gaps" }, { key: "benefit", label: "Resolution benefit", color: "#22c55e" }]} /></ChartCard>
      <ChartCard title="Documentation Status" variant="glass"><BarChart data={documentationStatus} series={[{ key: "value", label: "Documents", color: "#f59e0b" }]} layout="horizontal" /></ChartCard>
    </section>
  );
}
