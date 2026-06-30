import type { ReactNode } from "react";
import { Card, type CardProps } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { cn } from "../../utils/cn";

export interface InsightCardProps extends CardProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  impact?: string;
  icon?: ReactNode;
}

export function InsightCard({ eyebrow, title, description, impact, icon, className, children, ...props }: InsightCardProps) {
  return (
    <Card variant="glass" className={cn("h-full hover:-translate-y-1 hover:border-violet-400/40", className)} {...props}>
      <div className="flex items-start gap-3">
        {icon ? <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-500/15 text-violet-200">{icon}</div> : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-violet-200">{eyebrow}</p> : null}
            {impact ? <Badge variant={impact === "high" ? "danger" : impact === "medium" ? "warning" : "neutral"}>{impact} impact</Badge> : null}
          </div>
          <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">{title}</h3>
          {description ? <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{description}</p> : null}
        </div>
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </Card>
  );
}
