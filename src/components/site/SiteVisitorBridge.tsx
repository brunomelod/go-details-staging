"use client";

import { useEffect } from "react";
import { createConversation } from "@/lib/inbox-store";

function handleBookIntent(label: string) {
  const key = `go-details-booking-lead-${label}`;
  if (sessionStorage.getItem(key) === "1") return;
  sessionStorage.setItem(key, "1");
  createConversation({
    source: "site_booking",
    subject: label,
    initialMessage: `Booking interest: "${label}" from the website.`,
  });
}

/**
 * Envia leads do site para a fila local (demo).
 * Em produção: webhooks GoHighLevel → backend → mesmo inbox.
 */
export function SiteVisitorBridge() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const text = (anchor.textContent ?? "").trim().toLowerCase();

      if (
        href === "#book" ||
        href.startsWith("/quiz") ||
        text.includes("book")
      ) {
        const label = (anchor.textContent ?? "Booking").trim();
        handleBookIntent(label);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
