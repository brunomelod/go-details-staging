"use client";

import { usePathname } from "next/navigation";
import { GhlChatWidget } from "@/components/integrations/GhlChatWidget";
import { SiteChatWidget } from "@/components/site/SiteChatWidget";

/**
 * Chat do site → fila /dashboard (SiteChatWidget).
 * GHL só se NEXT_PUBLIC_GHL_CHAT=true (widget externo, não passa pelo inbox local).
 */
export function PublicChatLoader() {
  const pathname = usePathname();
  const useGhl = process.env.NEXT_PUBLIC_GHL_CHAT === "true";

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/quiz")
  ) {
    return null;
  }

  if (useGhl) return <GhlChatWidget />;
  return <SiteChatWidget />;
}
