import { useCallback, useEffect, useMemo, useState } from "react";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { ChatInput } from "./components/ChatInput";
import { ChatWindow } from "./components/ChatWindow";
import { clearMemory, fetchAnalytics, sendChat } from "./lib/api";
import type { AnalyticsResponse, Message } from "./types/chat";

function generateSessionId() {
  return `session-${crypto.randomUUID().slice(0, 8)}`;
}

export default function App() {
  const [sessionId, setSessionId] = useState(generateSessionId());
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"chat" | "analytics">("chat");

  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const canClear = useMemo(() => Boolean(sessionId.trim()), [sessionId]);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const data = await fetchAnalytics();
      setAnalytics(data);
    } catch (err) {
      setAnalyticsError(err instanceof Error ? err.message : "Unknown analytics error");
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeView === "analytics") {
      void loadAnalytics();
    }
  }, [activeView, loadAnalytics]);

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
        debug: response.debug,
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
    <main className="mx-auto flex h-screen max-w-5xl flex-col bg-slate-900 text-slate-100">
      <header className="flex flex-wrap items-center gap-3 border-b border-slate-700 p-4">
        <h1 className="text-lg font-semibold">AI Support Copilot</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveView("chat")}
            className={`rounded-md px-3 py-2 text-xs ${
              activeView === "chat" ? "bg-indigo-600" : "border border-slate-600"
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveView("analytics")}
            className={`rounded-md px-3 py-2 text-xs ${
              activeView === "analytics" ? "bg-indigo-600" : "border border-slate-600"
            }`}
          >
            Analytics
          </button>
        </div>

        {activeView === "chat" && (
          <>
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
          </>
        )}

        {activeView === "analytics" && (
          <button
            onClick={() => void loadAnalytics()}
            className="rounded-md border border-slate-600 px-3 py-2 text-xs hover:bg-slate-800"
          >
            Refresh Analytics
          </button>
        )}
      </header>

      {activeView === "chat" ? (
        <>
          {error && <div className="bg-rose-900/40 px-4 py-2 text-sm text-rose-200">{error}</div>}
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput onSend={onSend} disabled={loading} />
        </>
      ) : (
        <AnalyticsDashboard analytics={analytics} loading={analyticsLoading} error={analyticsError} />
      )}
    </main>
  );
}