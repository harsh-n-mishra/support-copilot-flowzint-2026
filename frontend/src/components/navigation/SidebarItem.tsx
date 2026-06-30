import { cn } from "../../utils/cn";
import type { NavItem } from "./navItems";

type SidebarItemProps = {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
};

export function SidebarItem({ item, active, collapsed, onNavigate }: SidebarItemProps) {
  return (
    <a
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring transition-foundation group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-caption",
        active
          ? "border-[color:var(--color-border-strong)] bg-[rgba(124,58,237,0.18)] text-[color:var(--color-text)] shadow-[var(--shadow-glow)]"
          : "border-transparent text-[color:var(--color-text-muted)] hover:border-[color:var(--color-border)] hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text)]",
        collapsed && "justify-center"
      )}
      href={item.href}
      onClick={onNavigate}
    >
      <span aria-hidden="true" className="grid h-7 w-7 place-items-center rounded-lg bg-[rgba(255,255,255,0.05)]">
        {item.icon}
      </span>
      {!collapsed && <span className="truncate font-medium">{item.label}</span>}
    </a>
  );
}
