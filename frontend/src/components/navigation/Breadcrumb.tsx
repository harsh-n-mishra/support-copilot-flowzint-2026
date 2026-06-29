type BreadcrumbProps = {
  currentPath: string;
};

function labelFromPath(path: string) {
  if (path === "/") return "Dashboard";
  return path
    .replace(/^\//, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function Breadcrumb({ currentPath }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-caption text-muted">
      <ol className="flex items-center gap-2">
        <li>
          <a className="focus-ring rounded-md hover:text-[color:var(--color-text)]" href="/dashboard">
            Home
          </a>
        </li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className="font-medium text-[color:var(--color-text)]">
          {labelFromPath(currentPath)}
        </li>
      </ol>
    </nav>
  );
}
