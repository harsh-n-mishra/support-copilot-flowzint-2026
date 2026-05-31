export type Source = {
  id: number;
  source: string;
  snippet: string;
  score: number;
};

export type DebugChunk = {
  source: string;
  score: number;
  snippet: string;
};

export type DebugInfo = {
  retrieved_chunks: DebugChunk[];
  top_score: number;
  handoff_reason: string | null;
  prompt_context_preview: string;
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
  debug: DebugInfo;
  handoff: Handoff | null;
  ticket_draft: TicketDraft | null;
};

export type IntentCount = {
  intent: string;
  count: number;
};

export type FailedQuery = {
  question: string;
  retrieval_score: number;
  timestamp: string;
};

export type AnalyticsResponse = {
  total_chats: number;
  handoff_rate: number;
  avg_retrieval_score: number;
  top_intents: IntentCount[];
  failed_queries: FailedQuery[];
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  intent?: string;
  escalationTarget?: string;
  debug?: DebugInfo;
  sources?: Source[];
  handoff?: Handoff | null;
  ticketDraft?: TicketDraft | null;
};