import { supportHealth } from "../../utils/mock/supportHealth";

export function getSupportHealthModel() {
  return {
    health: supportHealth,
    healthMetrics: [
      { label: "Retrieval Confidence", value: supportHealth.retrievalConfidence, suffix: "%" },
      { label: "Knowledge Coverage", value: supportHealth.knowledgeCoverage, suffix: "%" },
      { label: "Escalation Rate", value: supportHealth.escalationRate, suffix: "%" },
      { label: "Latency", value: supportHealth.latencyMs, suffix: "ms" },
      { label: "Resolution Time", value: supportHealth.averageResolutionTime, suffix: "h" },
      { label: "Availability", value: supportHealth.systemAvailability, suffix: "%" },
      { label: "Customer Satisfaction", value: supportHealth.customerSatisfaction, suffix: "/5" },
    ],
    alerts: supportHealth.componentStatus.filter((component) => component.status !== "healthy"),
  };
}
