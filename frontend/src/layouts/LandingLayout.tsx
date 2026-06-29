import type { ReactNode } from "react";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <main className="app-shell motion-page grid min-h-screen place-items-center p-6">
      <div className="w-full max-w-5xl">{children}</div>
    </main>
  );
}
