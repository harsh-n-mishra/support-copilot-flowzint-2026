import type { ReactNode } from "react";
import { Card, type CardProps } from "../ui/Card";
import { cn } from "../../utils/cn";

export interface MetricCardProps extends CardProps {
  label: string;
  value: ReactNode;
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  icon?: ReactNode;
}

const tones = {
  positive: "text-emerald-300",
  negative: "text-rose-300",
  neutral: "text-[var(--color-text-muted)]",
};

export function MetricCard({ label, value, change, changeTone = "neutral", icon, className, children, ...props }: MetricCardProps) {
  return (
    <Card variant="glass" className={cn("group hover:-translate-y-1 hover:border-violet-400/40", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[var(--color-text-muted)]">{label}</p>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-[var(--color-text)]">{value}</div>
        </div>
        {icon ? <div className="rounded-xl bg-violet-500/15 p-2 text-violet-200">{icon}</div> : null}
      </div>
      {change ? <p className={cn("mt-3 text-xs", tones[changeTone])}>{change}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </Card>
  );
}
