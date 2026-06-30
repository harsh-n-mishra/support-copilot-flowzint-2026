import { knowledgeGaps, knowledgeGapSummary } from "../../utils/mock/knowledgeGaps";

export function getKnowledgeGapModel() {
  const distribution = ["critical", "high", "medium", "low"].map((priority) => ({
    label: priority,
    value: knowledgeGaps.filter((gap) => gap.priority === priority).length,
  }));
  const categoryMap = knowledgeGaps.reduce<Record<string, number>>((acc, gap) => {
    acc[gap.businessArea] = (acc[gap.businessArea] ?? 0) + 1;
    return acc;
  }, {});
  const statusMap = knowledgeGaps.reduce<Record<string, number>>((acc, gap) => {
    acc[gap.status] = (acc[gap.status] ?? 0) + 1;
    return acc;
  }, {});

  const coverage = Math.round(100 - (knowledgeGapSummary.criticalGapCount / knowledgeGapSummary.detectedGaps) * 100);

  return {
    gaps: knowledgeGaps,
    summary: knowledgeGapSummary,
    coverage,
    distribution,
    topCategories: Object.entries(categoryMap).map(([label, value]) => ({ label, value })).slice(0, 8),
    documentationStatus: Object.entries(statusMap).map(([label, value]) => ({ label, value })),
    highPriorityGaps: knowledgeGaps.filter((gap) => gap.priority === "critical" || gap.priority === "high").slice(0, 8),
    recentGaps: knowledgeGaps.slice(0, 6),
    trend: knowledgeGaps.slice(0, 12).map((gap, index) => ({ label: `W${index + 1}`, gaps: Math.max(20, Math.round(gap.frequency / 5)), benefit: gap.estimatedResolutionBenefit })),
  };
}
