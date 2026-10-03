"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  INBOX_UPDATED_EVENT,
  getVisitorChatConversation,
  sendVisitorChatMessage,
} from "@/lib/inbox-store";
import type { Conversation } from "@/types/inbox";

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function SiteChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const refresh = useCallback(() => {
    setConversation(getVisitorChatConversation());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener(INBOX_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    const interval = window.setInterval(refresh, 2000);
    return () => {
      window.removeEventListener(INBOX_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
      window.clearInterval(interval);
    };
  }, [refresh]);

  function onSend(e: FormEvent) {
    e.preventDefault();
    const sent = sendVisitorChatMessage(draft, name);
    if (sent) {
      setDraft("");
      setConversation(sent);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      {open ? (
        <div
          className="flex h-[min(420px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          role="dialog"
          aria-label="Chat with Go Details"
        >
          <header className="flex items-center justify-between border-b border-border bg-elevated px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Go Details</p>
              <p className="text-xs text-muted">
                Our team replies from the support dashboard
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-muted hover:bg-elevated hover:text-foreground"
              aria-label="Close chat"
            >
              ✕
            </button>
          </header>

          {!conversation && !name ? (
            <div className="border-b border-border p-4">
              <label className="text-xs text-muted">Your name (optional)</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="mt-1 w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
          ) : null}

          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {conversation?.messages.length ? (
              conversation.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                    m.author === "agent"
                      ? "ml-auto bg-accent text-accent-fg"
                      : m.author === "visitor"
                        ? "bg-elevated text-foreground"
                        : "mx-auto text-center text-xs text-muted"
                  }`}
                >
                  {m.body}
                  <p className="mt-0.5 text-[10px] opacity-60">{formatTime(m.at)}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-muted">
                Hi! Send a message — our team will reply here shortly.
              </p>
            )}
          </div>

          <form
            onSubmit={onSend}
            className="flex gap-2 border-t border-border p-3"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type your message…"
              className="min-w-0 flex-1 rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase text-accent-fg hover:opacity-90"
            >
              Send
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-2xl text-accent-fg shadow-lg transition hover:scale-105 hover:opacity-90"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        💬
      </button>
    </div>
  );
}
