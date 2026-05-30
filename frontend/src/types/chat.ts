export type Source = {
  id: number;
  source: string;
  snippet: string;
  score: number;
};

export type Handoff = {
  ticket_id: string;
  reason: string;
  contact: string;
};

export type TicketDraft = {
  title: string;
  summary: string;
  intent: string;
  escalation_target: string;
  conversation_summary: string;
};

export type ChatResponse = {
  answer: string;
  sources: Source[];
  intent: string;
  escalation_target: string;
  handoff: Handoff | null;
  ticket_draft: TicketDraft | null;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  escalationTarget?: string;
  sources?: Source[];
  handoff?: Handoff | null;
  ticketDraft?: TicketDraft | null;
};