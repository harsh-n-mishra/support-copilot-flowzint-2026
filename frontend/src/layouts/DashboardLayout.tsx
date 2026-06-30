import type { ReactNode } from "react";
import { AppLayout } from "./AppLayout";

type DashboardLayoutProps = {
  children: ReactNode;
  currentPath: string;
};

export function DashboardLayout({ children, currentPath }: DashboardLayoutProps) {
  return <AppLayout currentPath={currentPath}>{children}</AppLayout>;
}
