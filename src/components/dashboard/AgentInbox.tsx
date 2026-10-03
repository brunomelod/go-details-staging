"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  INBOX_UPDATED_EVENT,
  addAgentReply,
  loadConversations,
  markConversationRead,
  seedInboxIfEmpty,
  setConversationStatus,
  sourceLabel,
} from "@/lib/inbox-store";
import type { Conversation, ConversationStatus } from "@/types/inbox";

type Filter = "all" | ConversationStatus;

function formatTime(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function statusBadge(status: ConversationStatus) {
  const map = {
    new: "bg-accent/20 text-accent",
    open: "bg-blue-500/20 text-blue-300",
    resolved: "bg-muted/20 text-muted",
  } as const;
  const label = { new: "Novo", open: "Em atendimento", resolved: "Resolvido" };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs ${map[status]}`}>
      {label[status]}
    </span>
  );
}

export function AgentInbox() {
  const { logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [reply, setReply] = useState("");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    seedInboxIfEmpty();
    const list = loadConversations().sort(
      (a, b) => b.updatedAt.localeCompare(a.updatedAt),
    );
    setConversations(list);
    setSelectedId((prev) => {
      if (prev && list.some((c) => c.id === prev)) return prev;
      return list[0]?.id ?? null;
    });
  }, []);

  useEffect(() => {
    refresh();
    setReady(true);
    const onUpdate = () => refresh();
    window.addEventListener(INBOX_UPDATED_EVENT, onUpdate);
    window.addEventListener("storage", onUpdate);
    const interval = window.setInterval(refresh, 3000);
    return () => {
      window.removeEventListener(INBOX_UPDATED_EVENT, onUpdate);
      window.removeEventListener("storage", onUpdate);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const filtered = useMemo(() => {
    if (filter === "all") return conversations;
    return conversations.filter((c) => c.status === filter);
  }, [conversations, filter]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    if (selected?.id) markConversationRead(selected.id);
  }, [selected?.id]);

  const unreadCount = conversations.filter((c) => c.unreadForAgent).length;

  function sendReply() {
    if (!selected) return;
    if (addAgentReply(selected.id, reply)) {
      setReply("");
      refresh();
    }
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted">
        Carregando inbox…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="border-b border-border bg-elevated">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">
              Go Details
            </p>
            <h1 className="text-xl font-semibold text-foreground">
              Central de atendimento
            </h1>
            <p className="text-sm text-muted">
              Responda visitantes que chegam pelo site, chat e formulários.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
              {unreadCount} aguardando
            </span>
            <Link
              href="/"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-accent"
            >
              Abrir site
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:border-accent"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-0 px-4 py-4 md:grid-cols-[minmax(0,340px)_1fr] md:px-6 md:py-6">
        <aside className="flex flex-col rounded-xl border border-border bg-card md:max-h-[calc(100vh-140px)]">
          <div className="flex flex-wrap gap-2 border-b border-border p-3">
            {(
              [
                ["all", "Todos"],
                ["new", "Novos"],
                ["open", "Abertos"],
                ["resolved", "Resolvidos"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1 text-xs ${
                  filter === key
                    ? "bg-accent text-accent-fg"
                    : "bg-elevated text-muted hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <ul className="overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <li className="p-4 text-sm text-muted">
                Nenhuma conversa neste filtro.
              </li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`mb-1 w-full rounded-lg border p-3 text-left transition ${
                      selectedId === c.id
                        ? "border-accent/50 bg-accent/10"
                        : "border-transparent bg-transparent hover:bg-elevated"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {c.visitorName}
                        {c.unreadForAgent ? (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-accent" />
                        ) : null}
                      </span>
                      {statusBadge(c.status)}
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted">
                      {c.subject}
                    </p>
                    <p className="mt-1 text-xs text-muted/80">
                      {sourceLabel(c.source)} · {formatTime(c.updatedAt)}
                    </p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        <main className="mt-4 flex min-h-[420px] flex-col rounded-xl border border-border bg-card md:mt-0 md:max-h-[calc(100vh-140px)]">
          {selected ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
                <div>
                  <h2 className="text-lg font-medium text-foreground">
                    {selected.visitorName}
                  </h2>
                  <p className="text-sm text-muted">{selected.subject}</p>
                  {selected.visitorContact ? (
                    <p className="text-sm text-muted">
                      Contato: {selected.visitorContact}
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-muted/80">
                    Origem: {sourceLabel(selected.source)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.status !== "open" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setConversationStatus(selected.id, "open");
                        refresh();
                      }}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-blue-400"
                    >
                      Assumir
                    </button>
                  ) : null}
                  {selected.status !== "resolved" ? (
                    <button
                      type="button"
                      onClick={() => {
                        setConversationStatus(selected.id, "resolved");
                        refresh();
                      }}
                      className="rounded-full border border-border px-3 py-1 text-xs text-muted hover:border-emerald-400"
                    >
                      Marcar resolvido
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {selected.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      m.author === "agent"
                        ? "ml-auto bg-accent text-accent-fg"
                        : m.author === "system"
                          ? "mx-auto bg-elevated text-center text-xs text-muted"
                          : "bg-elevated text-foreground"
                    }`}
                  >
                    <p>{m.body}</p>
                    <p className="mt-1 text-[10px] opacity-70">
                      {formatTime(m.at)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Digite sua resposta ao cliente…"
                    rows={2}
                    className="min-h-[44px] flex-1 resize-none rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={sendReply}
                    className="shrink-0 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-fg hover:opacity-90"
                  >
                    Enviar
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted/80">
                  Chat do site (bolha 💬) cai aqui com origem &quot;Chat do
                  site&quot;. Demo: mesmo navegador / localStorage. Produção:
                  API GoHighLevel.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-muted">
              Selecione uma conversa para atender.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
