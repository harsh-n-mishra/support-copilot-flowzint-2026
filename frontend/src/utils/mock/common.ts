export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "open" | "in_progress" | "resolved" | "escalated" | "monitoring";
export type BusinessArea = "Identity" | "Billing" | "Platform" | "Integrations" | "Security" | "Migration" | "Administration" | "Developer Experience";

export const baseDate = new Date("2026-06-30T12:00:00.000Z");
export const intents = ["Password Reset", "Billing", "Enterprise Migration", "API Keys", "OAuth", "SSO", "Rate Limits", "Slack Integration", "Teams Integration", "Webhooks", "SCIM", "Account Recovery", "User Provisioning", "Invoices", "Licensing"] as const;
export const categories: BusinessArea[] = ["Identity", "Billing", "Migration", "Developer Experience", "Integrations", "Security", "Administration", "Platform"];
export const users = ["Maya Chen", "Jordan Patel", "Elena Rodriguez", "Noah Kim", "Avery Johnson", "Priya Shah", "Marcus Lee", "Sofia Garcia", "Ben Carter", "Amara Okafor", "Liam O'Neill", "Nadia Rahman", "Owen Brooks", "Iris Wang", "Theo Martin", "Zara Ali", "Caleb Stone", "Hannah Reed", "Mina Sato", "Evan Wright"];
export const enterpriseAccounts = ["Acme Corp", "Northstar Bank", "Globex Logistics", "Summit Health", "Vertex Cloud", "BlueRiver Retail", "Atlas Education", "Crescent Energy"];
export const docs = ["account-recovery", "authentication", "billing", "enterprise", "integrations-slack", "integrations-jira", "api-rate-limits", "api-webhooks", "migration-guide", "user-roles", "data-retention", "scim-provisioning", "sso-setup", "incident-management"];

export function seeded(index: number, mod: number) { return Math.abs((index * 9301 + 49297) % 233280) % mod; }
export function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
export function randomTimestamp(daysBack = 30, index = 0) { const date = new Date(baseDate); date.setHours(date.getHours() - seeded(index, daysBack * 24)); return date.toISOString(); }
export function randomAvatar(name: string) { return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
export function formatConfidence(value: number) { return `${Math.round(value)}%`; }
export function formatTrend(value: number) { return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`; }
export function generateTrend(length: number, start: number, volatility = 6, slope = 0) { return Array.from({ length }, (_, i) => Math.round(start + slope * i + Math.sin(i / 2) * volatility + seeded(i + start, volatility * 2) - volatility)); }
export function generateChartData(length: number, keys: string[], labelPrefix = "Day") { return Array.from({ length }, (_, i) => Object.fromEntries([["label", `${labelPrefix} ${i + 1}`], ...keys.map((key, j) => [key, Math.max(0, generateTrend(length, 80 + j * 20, 10, j + 1)[i])])])) as Array<Record<string, string | number>>; }
export function generateHealthScore(confidence: number, coverage: number, escalationRate: number, latencyMs: number) { return clamp(Math.round(confidence * 0.35 + coverage * 0.35 + (100 - escalationRate * 5) * 0.2 + (100 - latencyMs / 25) * 0.1), 1, 100); }
export function areaForIntent(intent: string): BusinessArea { if (/billing|invoice|licens/i.test(intent)) return "Billing"; if (/migration/i.test(intent)) return "Migration"; if (/oauth|sso|password|account/i.test(intent)) return "Identity"; if (/slack|teams|webhook|scim/i.test(intent)) return "Integrations"; if (/api|rate/i.test(intent)) return "Developer Experience"; return "Platform"; }
