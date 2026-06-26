import type { TicketDraft } from "../../types/chat";

type Props = {
  ticketDraft: TicketDraft;
};

export function TicketDraftCard({ ticketDraft }: Props) {
  return (
    <div className="mt-3 rounded-md border border-cyan-600/40 bg-cyan-900/20 p-3 text-xs text-cyan-100">
      <div className="font-semibold">Ticket Draft</div>
      <div className="mt-1"><strong>Title:</strong> {ticketDraft.title}</div>
      <div><strong>Summary:</strong> {ticketDraft.summary}</div>
      <div><strong>Intent:</strong> {ticketDraft.intent}</div>
      <div><strong>Escalation:</strong> {ticketDraft.escalation_target}</div>
      <div className="mt-1"><strong>Conversation summary:</strong> {ticketDraft.conversation_summary}</div>
    </div>
  );
}