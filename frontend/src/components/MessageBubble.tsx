import ReactMarkdown from "react-markdown";
import type { Message } from "../types/chat";
import { HandoffCard } from "./HandoffCard";
import { SourceList } from "./SourceList";

type Props = {
  message: Message;
};

export function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
          isUser ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-100"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{message.content}</ReactMarkdown>
        )}

        {!isUser && message.sources && <SourceList sources={message.sources} />}
        {!isUser && message.handoff && <HandoffCard handoff={message.handoff} />}
      </div>
    </div>
  );
}