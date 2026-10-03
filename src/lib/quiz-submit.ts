import { createConversation } from "@/lib/inbox-store";

export function submitQuizBooking(params: {
  quizId: string;
  quizTitle: string;
  customerName: string;
  customerContact?: string;
  summaryLines: string[];
  estimatedTotal?: number;
}) {
  const body = [
    `Quiz: ${params.quizTitle}`,
    ...params.summaryLines,
    params.estimatedTotal != null
      ? `Estimated total: $${params.estimatedTotal.toFixed(2)}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return createConversation({
    visitorName: params.customerName,
    visitorContact: params.customerContact,
    source: "quiz",
    subject: `${params.quizTitle} — new booking request`,
    initialMessage: body,
  });
}
