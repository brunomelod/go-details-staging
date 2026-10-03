"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import type { ThemeMode } from "@/lib/theme";

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const btn = (mode: ThemeMode, label: string) => (
    <button
      key={mode}
      type="button"
      onClick={() => setTheme(mode)}
      aria-pressed={theme === mode}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        theme === mode
          ? "bg-accent text-accent-fg"
          : "text-muted hover:bg-elevated"
      }`}
    >
      {label}
    </button>
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:border-accent hover:text-foreground"
        aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
        title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      >
        {theme === "dark" ? "☀" : "☾"}
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-full border border-border bg-card p-0.5"
      role="group"
      aria-label="Tema da interface"
    >
      {btn("dark", "Dark")}
      {btn("light", "Light")}
    </div>
  );
}
