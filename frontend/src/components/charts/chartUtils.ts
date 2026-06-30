export type ChartDatum = Record<string, string | number>;
export type ChartSeries = { key: string; label?: string; color?: string };
export const chartColors = ["#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#38bdf8", "#ec4899"];
export function numeric(value: unknown) { return typeof value === "number" && Number.isFinite(value) ? value : Number(value) || 0; }
export function extent(values: number[]) { const min = Math.min(...values, 0); const max = Math.max(...values, 1); return { min, max: max === min ? min + 1 : max }; }
export function points(data: ChartDatum[], key: string, width: number, height: number, pad = 16) { const values = data.map((d) => numeric(d[key])); const { min, max } = extent(values); return values.map((v, i) => ({ x: pad + (i * (width - pad * 2)) / Math.max(data.length - 1, 1), y: height - pad - ((v - min) / (max - min)) * (height - pad * 2), value: v })); }
export function pathFromPoints(items: Array<{ x: number; y: number }>) { return items.map((p, i) => `${i ? "L" : "M"}${p.x},${p.y}`).join(" "); }
export function areaFromPoints(items: Array<{ x: number; y: number }>, height: number, pad = 16) { return `${pathFromPoints(items)} L${items.at(-1)?.x ?? pad},${height - pad} L${items[0]?.x ?? pad},${height - pad} Z`; }
