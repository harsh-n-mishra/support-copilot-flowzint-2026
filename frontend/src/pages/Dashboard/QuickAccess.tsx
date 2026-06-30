import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { getDashboardModel } from "./selectors";

const icons = ["☰", "⌕", "▦", "◆"];
export function QuickAccess() {
  const { dashboard } = getDashboardModel();
  return <section aria-labelledby="quick-access"><Card title="Quick Actions" variant="glass"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{dashboard.quickActions.map((a,i)=><a key={a.href} href={a.href} className="group rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-400"><span className="mb-3 inline-grid h-9 w-9 place-items-center rounded-lg bg-violet-500/15 text-violet-200">{icons[i]}</span><h3 className="text-sm font-semibold">{a.label}</h3><p className="mt-1 text-xs text-[var(--color-text-muted)]">Open {a.label.toLowerCase()}</p></a>)}</div><div className="mt-4"><Button variant="secondary" size="sm">View all activity</Button></div></Card></section>;
}
