import { FormEvent, useState } from "react";

type Props = {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    await onSend(trimmed);
  };

  return (
    <form onSubmit={submit} className="flex gap-2 border-t border-slate-700 p-4">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask a support question..."
        className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <button
        disabled={disabled}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}