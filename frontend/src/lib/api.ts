import type { ChatResponse } from "../types/chat";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

export async function sendChat(question: string, sessionId: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, session_id: sessionId }),
  });

  if (!res.ok) {
    throw new Error(`Chat request failed (${res.status})`);
  }

  return res.json();
}

export async function clearMemory(sessionId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/memory/${encodeURIComponent(sessionId)}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Clear memory failed (${res.status})`);
  }
}