import type { AnalyticsResponse } from "../../types/chat";

type Props = {
  analytics: AnalyticsResponse | null;
  loading: boolean;
  error: string | null;
};

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function AnalyticsDashboard({ analytics, loading, error }: Props) {
  if (loading) {
    return <div className="p-4 text-slate-300">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-4 text-rose-300">{error}</div>;
  }

  if (!analytics) {
    return <div className="p-4 text-slate-300">No analytics data yet.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="text-xs text-slate-400">Total Chats</div>
          <div className="text-2xl font-semibold">{analytics.total_chats}</div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="text-xs text-slate-400">Handoff Rate</div>
          <div className="text-2xl font-semibold">{pct(analytics.handoff_rate)}</div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
          <div className="text-xs text-slate-400">Avg Retrieval Score</div>
          <div className="text-2xl font-semibold">{analytics.avg_retrieval_score.toFixed(3)}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h2 className="mb-2 text-sm font-semibold">Top Intents</h2>
        <ul className="space-y-1 text-sm text-slate-300">
          {analytics.top_intents.map((item) => (
            <li key={item.intent} className="flex justify-between">
              <span>{item.intent}</span>
              <span>{item.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
        <h2 className="mb-2 text-sm font-semibold">Failed Queries</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="pr-4">Question</th>
                <th className="pr-4">Retrieval Score</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {analytics.failed_queries.map((fq, idx) => (
                <tr key={`${fq.timestamp}-${idx}`} className="border-t border-slate-700">
                  <td className="py-2 pr-4">{fq.question}</td>
                  <td className="py-2 pr-4">{fq.retrieval_score.toFixed(3)}</td>
                  <td className="py-2">{new Date(fq.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}