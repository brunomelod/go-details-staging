"use client";

import { useEffect, useState } from "react";

const WIDGET_ID =
  process.env.NEXT_PUBLIC_GHL_WIDGET_ID ?? "69e1459a5d1f0ed330b02c27";

export function GhlChatWidget() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);
    window.addEventListener("pointerdown", enable, { once: true });
    window.addEventListener("keydown", enable, { once: true });
    const t = window.setTimeout(enable, 4000);
    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (document.getElementById("ghl-chat-widget")) return;

    const script = document.createElement("script");
    script.id = "ghl-chat-widget";
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.async = true;
    script.setAttribute(
      "data-resources-url",
      "https://widgets.leadconnectorhq.com/chat-widget/loader.js",
    );
    script.setAttribute("data-widget-id", WIDGET_ID);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [enabled]);

  return null;
}
