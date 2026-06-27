import ReactMarkdown from "react-markdown";
import type { Message } from "../../types/chat";
import { DebugInspector } from "../../components/chat/DebugInspector";
import { HandoffCard } from "../../components/chat/HandoffCard";
import { SourceList } from "../../components/chat/SourceList";
import { TicketDraftCard } from "../../components/chat/TicketDraftCard";

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

        {!isUser && (message.intent || message.confidence || message.escalationTarget) && (
          <div className="mt-3 rounded-md border border-slate-700 bg-slate-900/70 p-2 text-xs text-slate-300">
            {message.intent && (
              <div>
                <strong>Intent:</strong> {message.intent}
              </div>
            )}
            {message.confidence && (
              <div>
                <strong>Confidence:</strong> {message.confidence}
              </div>
            )}
            {message.escalationTarget && (
              <div>
                <strong>Escalation:</strong> {message.escalationTarget}
              </div>
            )}
          </div>
        )}

        {!isUser && message.sources && <SourceList sources={message.sources} />}
        {!isUser && message.debug && <DebugInspector debug={message.debug} />}
        {!isUser && message.handoff && <HandoffCard handoff={message.handoff} />}
        {!isUser && message.ticketDraft && <TicketDraftCard ticketDraft={message.ticketDraft} />}
      </div>
    </div>
  );
}