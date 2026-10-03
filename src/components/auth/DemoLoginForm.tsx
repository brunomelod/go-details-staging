"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function DemoLoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (login(username.trim(), password)) {
      router.replace("/dashboard");
      return;
    }
    setError("Invalid username or password.");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-8 shadow-xl"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Respond to customers from the website inbox.
          </p>
        </div>
        <ThemeToggle />
      </div>
      <label className="block text-sm text-muted">
        Username
        <input
          className="mt-1 w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </label>
      <label className="block text-sm text-muted">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent-fg transition hover:opacity-90"
      >
        Sign in
      </button>
    </form>
  );
}
