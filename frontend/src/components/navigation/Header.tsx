import { useTheme } from "../../hooks/useTheme";
import { Breadcrumb } from "./Breadcrumb";

type HeaderProps = {
  currentPath: string;
  onOpenMobile: () => void;
};

export function Header({ currentPath, onOpenMobile }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-border)] bg-[rgba(5,8,22,0.72)] px-4 py-3 backdrop-blur-xl md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open navigation menu"
            className="focus-ring rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-caption text-[color:var(--color-text)] lg:hidden"
            type="button"
            onClick={onOpenMobile}
          >
            Menu
          </button>
          <Breadcrumb currentPath={currentPath} />
        </div>
        <button
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="focus-ring rounded-xl border border-[color:var(--color-border)] px-3 py-2 text-caption text-muted transition-foundation hover:bg-[color:var(--color-surface-muted)] hover:text-[color:var(--color-text)]"
          type="button"
          onClick={toggleTheme}
        >
          {theme === "dark" ? "Light" : "Dark"} mode
        </button>
      </div>
    </header>
  );
}
