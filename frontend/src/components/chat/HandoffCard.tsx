import type { Handoff } from "../../types/chat";

type Props = {
  handoff: Handoff;
};

export function HandoffCard({ handoff }: Props) {
  return (
    <div className="mt-3 rounded-md border border-amber-600/40 bg-amber-900/20 p-3 text-xs text-amber-100">
      <div className="font-semibold">Human handoff created</div>
      <div className="mt-1">Ticket: {handoff.ticket_id}</div>
      <div>Reason: {handoff.reason}</div>
      <div>Contact: {handoff.contact}</div>
    </div>
  );
}