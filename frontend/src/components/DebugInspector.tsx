import { useState } from "react";
import type { DebugInfo } from "../types/chat";

type Props = {
  debug: DebugInfo;
};

export function DebugInspector({ debug }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3 rounded-md border border-emerald-700/60 bg-emerald-950/20 p-2 text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-medium text-emerald-300 hover:text-emerald-200"
      >
        {open ? "Hide debug inspector" : "Show debug inspector"}
      </button>

      {open && (
        <div className="mt-2 space-y-3 text-emerald-100">
          <div>
            <div className="font-semibold">Top Score</div>
            <div>{debug.top_score.toFixed(4)}</div>
          </div>

          <div>
            <div className="font-semibold">Handoff Reason</div>
            <div>{debug.handoff_reason ?? "None"}</div>
          </div>

          <div>
            <div className="font-semibold">Prompt Context Preview</div>
            <div className="whitespace-pre-wrap rounded bg-emerald-900/30 p-2 text-emerald-50">
              {debug.prompt_context_preview}
            </div>
          </div>

          <div>
            <div className="font-semibold">Retrieved Chunks ({debug.retrieved_chunks.length})</div>
            <ul className="mt-1 space-y-2">
              {debug.retrieved_chunks.map((chunk, idx) => (
                <li key={`${chunk.source}-${idx}`} className="rounded bg-emerald-900/30 p-2">
                  <div>
                    <strong>Source:</strong> {chunk.source}
                  </div>
                  <div>
                    <strong>Score:</strong> {chunk.score.toFixed(4)}
                  </div>
                  <div className="mt-1 text-emerald-50">{chunk.snippet}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}