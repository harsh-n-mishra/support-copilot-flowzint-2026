import { DashboardCharts } from "./DashboardCharts";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { KPIGrid } from "./KPIGrid";
import { QuickAccess } from "./QuickAccess";
import { SupportActivity } from "./SupportActivity";

export function DashboardPage() {
  return <main className="space-y-5" aria-label="Dashboard page"><ExecutiveSummary /><div className="animate-fade-in"><KPIGrid /></div><DashboardCharts /><QuickAccess /><SupportActivity /></main>;
}
