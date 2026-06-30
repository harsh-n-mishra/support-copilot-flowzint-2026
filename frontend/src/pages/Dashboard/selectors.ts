import { dashboard } from "../../utils/mock/dashboard";
import { supportAgents } from "../../utils/mock/agents";
import { supportHealth } from "../../utils/mock/supportHealth";

export const getDashboardModel = () => ({
  dashboard: { ...dashboard, quickActions: dashboard.quickActions.map((action) => action.label === "Open Chat" ? { ...action, href: "/chat" } : action) },
  supportHealth,
  topAgents: supportAgents.slice(0, 4),
  systemStatus: supportHealth.componentStatus,
});
