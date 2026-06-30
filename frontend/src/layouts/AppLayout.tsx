import { useState, type ReactNode } from "react";
import { Header } from "../components/navigation/Header";
import { Sidebar } from "../components/navigation/Sidebar";

type AppLayoutProps = {
  children: ReactNode;
  currentPath: string;
};

export function AppLayout({ children, currentPath }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell flex min-h-screen">
      <Sidebar
        currentPath={currentPath}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header currentPath={currentPath} onOpenMobile={() => setMobileOpen(true)} />
        <main className="motion-page flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
