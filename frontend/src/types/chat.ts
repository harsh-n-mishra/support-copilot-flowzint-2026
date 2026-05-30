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

export type ChatResponse = {
  answer: string;
  sources: Source[];
  handoff: Handoff | null;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  handoff?: Handoff | null;
};