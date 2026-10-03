import type {
  Conversation,
  ConversationStatus,
  CreateConversationInput,
  InboxMessage,
} from "@/types/inbox";

export const INBOX_STORAGE_KEY = "go-details-inbox-v1";
export const INBOX_UPDATED_EVENT = "go-details-inbox-updated";
export const VISITOR_CHAT_SESSION_KEY = "go-details-visitor-chat-session";
export const VISITOR_CHAT_CONVERSATION_KEY = "go-details-visitor-chat-conversation-id";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function notifyInboxUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(INBOX_UPDATED_EVENT));
}

export function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INBOX_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(INBOX_STORAGE_KEY, JSON.stringify(conversations));
  notifyInboxUpdated();
}

export function seedInboxIfEmpty() {
  if (loadConversations().length > 0) return;
  const t = nowIso();
  const seed: Conversation[] = [
    {
      id: uid(),
      visitorName: "Sarah M.",
      visitorContact: "sarah@email.com",
      source: "site_chat",
      status: "new",
      subject: "Dúvida sobre auto detailing",
      unreadForAgent: true,
      createdAt: t,
      updatedAt: t,
      messages: [
        {
          id: uid(),
          author: "visitor",
          body: "Hi! Do you come to Loveland for interior detail?",
          at: t,
        },
      ],
    },
    {
      id: uid(),
      visitorName: "Website visitor",
      source: "site_booking",
      status: "open",
      subject: "Book home cleaning",
      unreadForAgent: false,
      createdAt: t,
      updatedAt: t,
      messages: [
        {
          id: uid(),
          author: "system",
          body: "Lead gerado pelo botão Book Home Cleaning na home.",
          at: t,
        },
        {
          id: uid(),
          author: "agent",
          body: "Olá! Posso ajudar a agendar — qual o melhor dia para você?",
          at: t,
        },
      ],
    },
  ];
  saveConversations(seed);
}

export function getConversationById(id: string): Conversation | undefined {
  return loadConversations().find((c) => c.id === id);
}

export function getOrCreateVisitorSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(VISITOR_CHAT_SESSION_KEY);
  if (!id) {
    id = uid();
    sessionStorage.setItem(VISITOR_CHAT_SESSION_KEY, id);
  }
  return id;
}

function findVisitorChatConversation(sessionId: string): Conversation | undefined {
  return loadConversations().find(
    (c) => c.source === "site_chat" && c.visitorSessionId === sessionId,
  );
}

/** Mensagem do visitante no chat flutuante → mesma fila do /dashboard */
export function sendVisitorChatMessage(
  body: string,
  visitorName?: string,
): Conversation | null {
  const trimmed = body.trim();
  if (!trimmed || typeof window === "undefined") return null;

  const sessionId = getOrCreateVisitorSessionId();
  const conversations = loadConversations();
  const t = nowIso();
  const storedId = sessionStorage.getItem(VISITOR_CHAT_CONVERSATION_KEY);

  let idx = storedId
    ? conversations.findIndex((c) => c.id === storedId)
    : -1;

  if (idx === -1) {
    const existing = findVisitorChatConversation(sessionId);
    if (existing) {
      idx = conversations.findIndex((c) => c.id === existing.id);
    }
  }

  const message: InboxMessage = {
    id: uid(),
    author: "visitor",
    body: trimmed,
    at: t,
  };

  if (idx === -1) {
    const name = visitorName?.trim() || "Chat visitor";
    const conversation: Conversation = {
      id: uid(),
      visitorName: name,
      visitorSessionId: sessionId,
      source: "site_chat",
      status: "new",
      subject: "Live chat on website",
      unreadForAgent: true,
      createdAt: t,
      updatedAt: t,
      messages: [message],
    };
    saveConversations([conversation, ...conversations]);
    sessionStorage.setItem(VISITOR_CHAT_CONVERSATION_KEY, conversation.id);
    return conversation;
  }

  const current = conversations[idx];
  conversations[idx] = {
    ...current,
    visitorName: visitorName?.trim() || current.visitorName,
    visitorSessionId: sessionId,
    status: current.status === "resolved" ? "new" : current.status,
    unreadForAgent: true,
    messages: [...current.messages, message],
    updatedAt: t,
  };
  saveConversations(conversations);
  sessionStorage.setItem(VISITOR_CHAT_CONVERSATION_KEY, current.id);
  return conversations[idx];
}

export function getVisitorChatConversation(): Conversation | null {
  if (typeof window === "undefined") return null;
  const sessionId = getOrCreateVisitorSessionId();
  const storedId = sessionStorage.getItem(VISITOR_CHAT_CONVERSATION_KEY);
  if (storedId) {
    const byId = getConversationById(storedId);
    if (byId) return byId;
  }
  return findVisitorChatConversation(sessionId) ?? null;
}

export function createConversation(input: CreateConversationInput): Conversation {
  const conversations = loadConversations();
  const t = nowIso();
  const conversation: Conversation = {
    id: uid(),
    visitorName: input.visitorName ?? "Website visitor",
    visitorContact: input.visitorContact,
    source: input.source,
    status: "new",
    subject: input.subject,
    unreadForAgent: true,
    createdAt: t,
    updatedAt: t,
    messages: [
      {
        id: uid(),
        author: "visitor",
        body: input.initialMessage,
        at: t,
      },
    ],
  };
  saveConversations([conversation, ...conversations]);
  return conversation;
}

export function addAgentReply(conversationId: string, body: string): boolean {
  const trimmed = body.trim();
  if (!trimmed) return false;

  const conversations = loadConversations();
  const idx = conversations.findIndex((c) => c.id === conversationId);
  if (idx === -1) return false;

  const t = nowIso();
  const message: InboxMessage = {
    id: uid(),
    author: "agent",
    body: trimmed,
    at: t,
  };

  conversations[idx] = {
    ...conversations[idx],
    status: conversations[idx].status === "resolved" ? "open" : conversations[idx].status === "new" ? "open" : conversations[idx].status,
    messages: [...conversations[idx].messages, message],
    updatedAt: t,
    unreadForAgent: false,
  };

  saveConversations(conversations);
  return true;
}

export function setConversationStatus(
  conversationId: string,
  status: ConversationStatus,
) {
  const conversations = loadConversations();
  const idx = conversations.findIndex((c) => c.id === conversationId);
  if (idx === -1) return;

  conversations[idx] = {
    ...conversations[idx],
    status,
    updatedAt: nowIso(),
    unreadForAgent: status === "resolved" ? false : conversations[idx].unreadForAgent,
  };
  saveConversations(conversations);
}

export function markConversationRead(conversationId: string) {
  const conversations = loadConversations();
  const idx = conversations.findIndex((c) => c.id === conversationId);
  if (idx === -1) return;

  if (!conversations[idx].unreadForAgent) return;

  conversations[idx] = {
    ...conversations[idx],
    unreadForAgent: false,
    updatedAt: nowIso(),
  };
  saveConversations(conversations);
}

const SOURCE_LABEL: Record<Conversation["source"], string> = {
  site_chat: "Chat do site",
  site_booking: "Booking",
  site_form: "Formulário",
  quiz: "Quiz / funil",
};

export function sourceLabel(source: Conversation["source"]) {
  return SOURCE_LABEL[source];
}
