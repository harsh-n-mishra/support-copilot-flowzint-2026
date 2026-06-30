import { DataTable, type DataTableProps } from "./DataTable";
export function TopQuestionsTable<T extends Record<string, unknown>>(props: DataTableProps<T>) { return <DataTable {...props} />; }
