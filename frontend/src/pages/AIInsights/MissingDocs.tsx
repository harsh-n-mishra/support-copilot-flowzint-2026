import { Card } from "../../components/ui/Card";
import { BarChart } from "../../components/charts";
import { getAIInsightsModel } from "./selectors";

export function MissingDocs() {
  const { insights } = getAIInsightsModel();
  return (
    <section className="grid gap-4 xl:grid-cols-2" aria-label="Missing documentation and actions">
      <Card title="Missing Documentation" variant="glass"><BarChart data={insights.missingDocumentation.map((doc)=>({ label: doc.title, value: doc.requests }))} series={[{ key: "value", label: "Requests", color: "#8b5cf6" }]} layout="horizontal" /></Card>
      <Card title="Recommended Actions" variant="glass"><ul className="space-y-3">{insights.aiSuggestions.map((suggestion)=><li key={suggestion} className="rounded-xl bg-white/[0.04] p-3 text-sm leading-6">{suggestion}</li>)}</ul></Card>
    </section>
  );
}
