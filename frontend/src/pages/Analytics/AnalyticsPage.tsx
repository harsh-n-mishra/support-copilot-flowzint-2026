import { Card } from "../../components/ui/Card";
import { BarChart } from "../../components/charts";
import { KPICards } from "./KPICards";
import { TrendCharts } from "./TrendCharts";
import { IntentChart } from "./IntentChart";
import { ConfidenceChart } from "./ConfidenceChart";
import { FailedQueriesTable } from "./FailedQueriesTable";
import { EscalationTable } from "./EscalationTable";
import { getAnalyticsModel } from "./selectors";

export function AnalyticsPage(){const {analytics}=getAnalyticsModel();return <main className="space-y-5" aria-label="Analytics page"><header className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl"><p className="text-xs uppercase tracking-[0.25em] text-violet-200">Operational analytics</p><h1 className="mt-2 text-2xl font-semibold">Analytics</h1><p className="mt-1 text-sm text-[var(--color-text-muted)]">Deep insights into support operations, confidence, escalations, failed queries, and trends.</p></header><KPICards/><TrendCharts/><IntentChart/><ConfidenceChart/><section className="grid gap-4 xl:grid-cols-2"><Card title="Top Questions" variant="glass"><BarChart data={analytics.frequentlyAskedQuestions.slice(0,8).map(q=>({label:q.question,value:q.count}))} series={[{key:"value",color:"#8b5cf6"}]} layout="horizontal" /></Card><Card title="Traffic Heatmap" subtitle="Hourly intensity by day" variant="glass"><div className="grid gap-1 overflow-x-auto" style={{gridTemplateColumns:"repeat(24,minmax(1.25rem,1fr))"}} aria-label="Weekly traffic heatmap">{analytics.weeklyHeatmap.flat().map((c)=><span key={`${c.day}-${c.hour}`} title={`Day ${c.day + 1}, ${c.hour}:00`} className="h-5 min-w-5 rounded" style={{backgroundColor:`rgba(139,92,246,${Math.min(c.value/120,.9)})`}} />)}</div></Card></section><section className="grid gap-4 xl:grid-cols-2"><FailedQueriesTable/><EscalationTable/></section></main>}
export const AnalyticsDashboard = AnalyticsPage;
