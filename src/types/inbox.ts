export type ConversationStatus = "new" | "open" | "resolved";

export type ConversationSource =
  | "site_chat"
  | "site_booking"
  | "site_form"
  | "quiz";

export type MessageAuthor = "visitor" | "agent" | "system";

export type InboxMessage = {
  id: string;
  author: MessageAuthor;
  body: string;
  at: string;
};

export type Conversation = {
  id: string;
  visitorName: string;
  visitorContact?: string;
  /** Liga a sessão do visitante no site ao thread no dashboard (chat). */
  visitorSessionId?: string;
  source: ConversationSource;
  status: ConversationStatus;
  subject: string;
  messages: InboxMessage[];
  createdAt: string;
  updatedAt: string;
  unreadForAgent: boolean;
};

export type CreateConversationInput = {
  visitorName?: string;
  visitorContact?: string;
  source: ConversationSource;
  subject: string;
  initialMessage: string;
};
