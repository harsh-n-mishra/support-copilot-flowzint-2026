import { useState } from "react";
import type { Source } from "../types/chat";

type Props = {
  sources: Source[];
};

export function SourceList({ sources }: Props) {
  const [open, setOpen] = useState(false);

  if (!sources.length) return null;

  return (
    <div className="mt-3 rounded-md border border-slate-700 bg-slate-900/70 p-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-medium text-indigo-300 hover:text-indigo-200"
      >
        {open ? "Hide sources" : `Show sources (${sources.length})`}
      </button>
      {open && (
        <ul className="mt-2 space-y-2">
          {sources.map((source) => (
            <li key={source.id} className="rounded bg-slate-800 p-2">
              <div className="font-semibold text-slate-200">
                [{source.id}] {source.source}
              </div>
              <div className="text-slate-400">score: {source.score}</div>
              <div className="mt-1 text-slate-300">{source.snippet}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}