import { useEffect, useRef } from "react";
import type { Message } from "../../types/chat";
import { MessageBubble } from "./MessageBubble";

type Props = {
  messages: Message[];
  loading: boolean;
};

export function ChatWindow({ messages, loading }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300">Thinking...</div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}