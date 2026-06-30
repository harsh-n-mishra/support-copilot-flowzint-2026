import { cn } from "../../utils/cn";
import { SidebarItem } from "./SidebarItem";
import { UserProfile } from "./UserProfile";
import { navItems } from "./navItems";

type SidebarProps = {
  currentPath: string;
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
};

export function Sidebar({ currentPath, collapsed, mobileOpen, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const navigation = (
    <aside
      aria-label="Primary navigation"
      className={cn(
        "transition-foundation flex h-full flex-col border-r border-[color:var(--color-border)] bg-[rgba(5,8,22,0.9)] p-4 backdrop-blur-xl",
        collapsed ? "w-24" : "w-72"
      )}
    >
      <div className="mb-8 flex items-center justify-between gap-3">
        <a className="focus-ring flex min-w-0 items-center gap-3 rounded-xl" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary font-bold shadow-[var(--shadow-glow)]">⌘</span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-title">IntelliSupport</span>
              <span className="block truncate text-[0.7rem] text-muted">AI support copilot</span>
            </span>
          )}
        </a>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="focus-ring hidden rounded-lg border border-[color:var(--color-border)] px-2 py-1 text-caption text-muted transition-foundation hover:text-[color:var(--color-text)] lg:block"
          type="button"
          onClick={onToggleCollapse}
        >
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={currentPath === item.href || (currentPath === "/" && item.href === "/dashboard")}
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
        ))}
      </nav>

      <UserProfile collapsed={collapsed} />
    </aside>
  );

  return (
    <>
      <div className="hidden lg:block">{navigation}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button className="absolute inset-0 bg-black/60" type="button" aria-label="Close navigation menu" onClick={onCloseMobile} />
          <div className="motion-drawer relative h-full w-80 max-w-[86vw]">{navigation}</div>
        </div>
      )}
    </>
  );
}
