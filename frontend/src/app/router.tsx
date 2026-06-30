import { useEffect, useState } from "react";
import App from "./App";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { LandingLayout } from "../layouts/LandingLayout";
import { AIInsightsPage } from "../pages/AIInsights/AIInsightsPage";
import { AnalyticsPage } from "../pages/Analytics/AnalyticsPage";
import { DashboardPage } from "../pages/Dashboard/DashboardPage";
import { KnowledgeGapPage } from "../pages/KnowledgeGaps/KnowledgeGapPage";
import { LandingPage } from "../pages/Landing/LandingPage";
import { SupportHealthPage } from "../pages/SupportHealth/SupportHealthPage";
import { Placeholder } from "../components/ui/Placeholder";

function useCurrentPath() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;

      if (!anchor || anchor.target || anchor.origin !== window.location.origin) return;
      event.preventDefault();
      window.history.pushState(null, "", anchor.pathname);
      setPath(anchor.pathname);
    };

    const onPopState = () => setPath(window.location.pathname);

    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return path;
}

function renderRoute(path: string) {
  switch (path) {
    case "/":
      return (
        <LandingLayout>
          <LandingPage />
        </LandingLayout>
      );
    case "/dashboard":
      return (
        <DashboardLayout currentPath={path}>
          <DashboardPage />
        </DashboardLayout>
      );
    case "/chat":
      return (
        <DashboardLayout currentPath={path}>
          <App />
        </DashboardLayout>
      );
    case "/analytics":
      return (
        <DashboardLayout currentPath={path}>
          <AnalyticsPage />
        </DashboardLayout>
      );
    case "/knowledge-gaps":
      return (
        <DashboardLayout currentPath={path}>
          <KnowledgeGapPage />
        </DashboardLayout>
      );
    case "/support-health":
      return (
        <DashboardLayout currentPath={path}>
          <SupportHealthPage />
        </DashboardLayout>
      );
    case "/ai-insights":
      return (
        <DashboardLayout currentPath={path}>
          <AIInsightsPage />
        </DashboardLayout>
      );
    default:
      return (
        <DashboardLayout currentPath={path}>
          <Placeholder title="Page Not Found" />
        </DashboardLayout>
      );
  }
}

export function AppRouter() {
  const path = useCurrentPath();
  return renderRoute(path);
}
