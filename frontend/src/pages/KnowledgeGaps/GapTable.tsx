import { Card } from "../../components/ui/Card";
import { DataTable } from "../../components/tables/DataTable";
import { PriorityBadge } from "../../components/badges/PriorityBadge";
import { StatusBadge } from "../../components/badges/StatusBadge";
import { getKnowledgeGapModel } from "./selectors";

export function GapTable() {
  const { gaps } = getKnowledgeGapModel();
  return (
    <Card title="Gap Table" subtitle="Prioritized missing knowledge topics" variant="glass">
      <DataTable searchable pageSize={8} data={gaps as unknown as Record<string, unknown>[]} columns={[
        { key: "title", header: "Topic", sortable: true },
        { key: "businessArea", header: "Area", sortable: true },
        { key: "frequency", header: "Frequency", sortable: true },
        { key: "confidenceImpact", header: "Confidence Impact", cell: (row) => `${row.confidenceImpact}%` },
        { key: "priority", header: "Priority", cell: (row) => <PriorityBadge priority={String(row.priority)} /> },
        { key: "status", header: "Status", cell: (row) => <StatusBadge status={String(row.status)} /> },
      ]} />
    </Card>
  );
}
