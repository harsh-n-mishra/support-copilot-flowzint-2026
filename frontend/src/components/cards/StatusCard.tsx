import { Card, type CardProps } from "../ui/Card";
import { StatusBadge } from "../badges/StatusBadge";
import { ProgressBar } from "../charts/ProgressBar";
import { cn } from "../../utils/cn";

export interface StatusCardProps extends CardProps {
  label: string;
  status: string;
  value?: number;
  description?: string;
}

export function StatusCard({ label, status, value, description, className, ...props }: StatusCardProps) {
  return (
    <Card variant="glass" className={cn("hover:-translate-y-1 hover:border-emerald-400/30", className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{label}</h3>
          {description ? <p className="mt-1 text-xs text-[var(--color-text-muted)]">{description}</p> : null}
        </div>
        <StatusBadge status={status} />
      </div>
      {typeof value === "number" ? <div className="mt-4"><ProgressBar value={value} variant={value > 85 ? "success" : value > 70 ? "warning" : "danger"} /></div> : null}
    </Card>
  );
}
