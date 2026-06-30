import { categories, generateChartData, generateTrend, intents, seeded } from "./common";
import { conversations } from "./conversations";
const totalConversations = 24318;
export const analytics = {
  totals: { conversations: totalConversations, escalations: 1942, averageConfidence: 91, knowledgeGaps: 326, failureRate: 7.8 },
  daily: generateChartData(30, ["conversations", "escalations", "confidence"], "Jun"),
  weekly: generateChartData(26, ["conversations", "resolutionTime"], "W"),
  monthly: Array.from({ length: 24 }, (_, i) => ({ month: new Date(2024, 6 + i, 1).toLocaleString("en", { month: "short", year: "2-digit" }), conversations: 760 + i * 32 + seeded(i, 90), escalations: 54 + seeded(i + 4, 38), confidence: 84 + seeded(i, 12), resolutionTime: 2.8 - Math.min(i * 0.03, .7) })),
  topIntents: intents.slice(0, 10).map((intent, i) => ({ intent, count: 2420 - i * 143, escalationRate: 4 + seeded(i, 14) })),
  intentDistribution: intents.slice(0, 6).map((label, i) => ({ label, value: 34 - i * 4 })),
  confidenceDistribution: [{ label: "High", value: 54 }, { label: "Medium", value: 32 }, { label: "Low", value: 14 }],
  sourceDistribution: ["Docs", "Knowledge Base", "Playbooks", "Prior Tickets"].map((label, i) => ({ label, value: 42 - i * 7 })),
  topFailedQuestions: conversations.filter((c) => c.escalation).slice(0, 10).map((c) => ({ question: c.messages[0].content, count: 96 - seeded(c.confidence, 30), failureRate: 18 + seeded(c.confidence, 20) })),
  frequentlyAskedQuestions: conversations.slice(0, 12).map((c, i) => ({ question: c.messages[0].content, count: 620 - i * 29 })),
  escalatedConversations: conversations.filter((c) => c.escalation),
  hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({ hour, conversations: 120 + Math.round(Math.sin(hour / 3) * 60) + seeded(hour, 35) })),
  weeklyHeatmap: Array.from({ length: 7 }, (_, day) => Array.from({ length: 24 }, (_, hour) => ({ day, hour, value: 20 + seeded(day * 24 + hour, 90) }))),
  categoryBreakdown: categories.map((label, i) => ({ label, value: 32 - i * 3 })),
  trendValues: generateTrend(12, 88, 4, .2),
};
export { totalConversations };
