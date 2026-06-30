import { ChartCard } from "../../components/cards/ChartCard";
import { LineChart, DonutChart, BarChart } from "../../components/charts";
import { MetricProgress } from "../../components/progress/MetricProgress";
import { getDashboardModel } from "./selectors";

export function DashboardCharts() {
  const { dashboard, supportHealth } = getDashboardModel();
  return <section className="grid gap-4 xl:grid-cols-3" aria-label="Dashboard charts"><ChartCard title="Conversation Trend" subtitle="Last 30 days" className="xl:col-span-2" variant="glass"><LineChart data={dashboard.conversationTrends} series={[{key:"conversations",label:"Conversations"},{key:"escalations",label:"Escalations",color:"#fb7185"}]} /></ChartCard><ChartCard title="Confidence Distribution" variant="glass"><div className="flex flex-col items-center gap-4"><DonutChart data={dashboard.topCategories} centerLabel={`${dashboard.executiveKpis.totalConversations.toLocaleString()}`} totalLabel="Total" />{dashboard.topCategories.slice(0,4).map(c=><MetricProgress key={c.label} label={c.label} value={c.value} />)}</div></ChartCard><ChartCard title="Confidence Trend" variant="glass"><LineChart data={dashboard.confidenceTrends} series={[{key:"confidence",label:"Confidence",color:"#22c55e"}]} /></ChartCard><ChartCard title="Top Intents" className="xl:col-span-2" variant="glass"><BarChart data={dashboard.topIntents.map(i=>({label:i.intent,value:i.count}))} series={[{key:"value",label:"Conversations",color:"#8b5cf6"}]} layout="horizontal" /></ChartCard><ChartCard title="Support Health Preview" variant="glass">{supportHealth.healthBreakdown.map(m=><MetricProgress key={m.label} label={m.label} value={m.value} />)}</ChartCard></section>;
}
