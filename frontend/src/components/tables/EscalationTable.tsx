import { DataTable, type DataTableProps } from "./DataTable";
export function EscalationTable<T extends Record<string, unknown>>(props: DataTableProps<T>) { return <DataTable {...props} />; }
