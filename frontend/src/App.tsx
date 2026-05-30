import { useMemo, useState } from "react";
import { ChatInput } from "./components/ChatInput";
import { ChatWindow } from "./components/ChatWindow";
import { clearMemory, sendChat } from "./lib/api";
import type { Message } from "./types/chat";

function generateSessionId() {
  return `session-${crypto.randomUUID().slice(0, 8)}`;
}

export default function App() {
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canClear = useMemo(() => Boolean(sessionId.trim()), [sessionId]);

  const onSend = async (content: string) => {
    setError(null);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendChat(content, sessionId);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.answer,
        intent: response.intent,
        escalationTarget: response.escalation_target,
        sources: response.sources,
        handoff: response.handoff,
        ticketDraft: response.ticket_draft,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const onClearMemory = async () => {
    setError(null);
    try {
      await clearMemory(sessionId);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const onSessionIdInputChange = (nextValue: string) => {
    setSessionId(nextValue);
    setMessages([]);
    setError(null);
  };

  const onGenerateSessionId = () => {
    setSessionId(generateSessionId());
    setMessages([]);
    setError(null);
  };

  return (
    <main className="mx-auto flex h-screen max-w-4xl flex-col bg-slate-900 text-slate-100">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-700 p-4">
        <h1 className="text-lg font-semibold">AI Support Copilot</h1>
        <input
          value={sessionId}
          onChange={(e) => onSessionIdInputChange(e.target.value)}
          className="min-w-[220px] flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm"
          placeholder="Session ID"
        />
        <button
          onClick={onGenerateSessionId}
          className="rounded-md border border-slate-600 px-3 py-2 text-xs hover:bg-slate-800"
        >
          New Session ID
        </button>
        <button
          onClick={onClearMemory}
          disabled={!canClear}
          className="rounded-md bg-rose-600 px-3 py-2 text-xs font-medium hover:bg-rose-500 disabled:opacity-50"
        >
          Clear Memory
        </button>
      </header>

      {error && <div className="bg-rose-900/40 px-4 py-2 text-sm text-rose-200">{error}</div>}

      <ChatWindow messages={messages} loading={loading} />
      <ChatInput onSend={onSend} disabled={loading} />
    </main>
  );
}