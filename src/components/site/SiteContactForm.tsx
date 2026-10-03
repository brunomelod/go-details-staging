"use client";

import { FormEvent, useState } from "react";
import { createConversation } from "@/lib/inbox-store";

export function SiteContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    createConversation({
      visitorName: name.trim() || "Website visitor",
      visitorContact: contact.trim() || undefined,
      source: "site_form",
      subject: "Website inquiry",
      initialMessage: message.trim(),
    });

    setName("");
    setContact("");
    setMessage("");
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <section className="border-t border-border bg-elevated py-16">
      <div className="mx-auto max-w-xl px-4 md:px-6">
        <h2 className="text-2xl font-semibold text-foreground">Contact us</h2>
        <p className="mt-2 text-sm text-muted">
          Send a message — our team will follow up shortly.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
          />
          <input
            placeholder="Email or phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
          />
          <textarea
            placeholder="How can we help?"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold uppercase text-accent-fg hover:opacity-90"
          >
            Send message
          </button>
          {sent ? (
            <p className="text-sm text-accent" role="status">
              Message sent — we&apos;ll get back to you soon.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
