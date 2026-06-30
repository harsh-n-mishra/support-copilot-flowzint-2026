import { MetricCard } from "../../components/cards/MetricCard";
import { Sparkline } from "../../components/charts/Sparkline";
import { getDashboardModel } from "./selectors";

export function KPIGrid() {
  const { dashboard } = getDashboardModel();
  const k = dashboard.executiveKpis;
  const spark = dashboard.conversationTrends.slice(-10).map((d) => Number(d.conversations));
  const items = [
    ["Support Health", `${k.supportHealthScore}/100`, "+4.2% this week", "positive", "♡"],
    ["Total Conversations", k.totalConversations.toLocaleString(), "+12.5% vs yesterday", "positive", "☰"],
    ["Resolved Conversations", k.resolvedConversations.toLocaleString(), "92% resolution rate", "positive", "✓"],
    ["Escalation Rate", `${k.escalationRate.toFixed(1)}%`, "-1.3% vs yesterday", "positive", "↗"],
    ["Avg Confidence", `${k.averageConfidence}%`, "+3.8% this week", "positive", "☺"],
    ["Avg Resolution", `${k.averageResolutionTime}h`, "Enterprise SLA ready", "neutral", "◷"],
  ] as const;
  return <section aria-labelledby="dashboard-kpis" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"><h2 id="dashboard-kpis" className="sr-only">Dashboard KPIs</h2>{items.map(([label,value,change,tone,icon], i)=><MetricCard key={label} label={label} value={value} change={change} changeTone={tone} icon={icon}>{i===0 ? <Sparkline values={spark} /> : null}</MetricCard>)}</section>;
}
