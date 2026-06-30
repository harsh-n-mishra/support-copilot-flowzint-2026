export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "⌂" },
  { label: "AI Chat", href: "/chat", icon: "◌" },
  { label: "Analytics", href: "/analytics", icon: "▥" },
  { label: "Knowledge Gaps", href: "/knowledge-gaps", icon: "◎" },
  { label: "Support Health", href: "/support-health", icon: "♡" },
  { label: "AI Insights", href: "/ai-insights", icon: "✦" },
];
