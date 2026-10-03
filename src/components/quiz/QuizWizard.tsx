"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type QuizAnswers = Record<string, string | string[] | boolean>;

type StepBase = {
  id: string;
  title: string;
  subtitle?: string;
};

export type RadioStep = StepBase & {
  type: "radio";
  field: string;
  options: { value: string; label: string; hint?: string }[];
};

export type CheckboxStep = StepBase & {
  type: "checkbox";
  field: string;
  options: { value: string; label: string; price?: number }[];
  visible?: (answers: QuizAnswers) => boolean;
};

export type FieldsStep = StepBase & {
  type: "fields";
  fields: {
    name: string;
    label: string;
    placeholder?: string;
    inputType?: "text" | "tel" | "email";
    required?: boolean;
  }[];
};

export type ReviewStep = StepBase & {
  type: "review";
  summary: (answers: QuizAnswers) => { label: string; value: string }[];
  total?: (answers: QuizAnswers) => number | null;
};

export type QuizStep = RadioStep | CheckboxStep | FieldsStep | ReviewStep;

type QuizWizardProps = {
  steps: QuizStep[];
  onComplete: (answers: QuizAnswers) => void;
  completeLabel?: string;
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${
            i <= current ? "bg-accent" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

export function QuizWizard({
  steps,
  onComplete,
  completeLabel = "Confirm booking request",
}: QuizWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [done, setDone] = useState(false);

  const activeSteps = useMemo(() => {
    return steps.filter((s) => {
      if (s.type === "checkbox" && s.visible) return s.visible(answers);
      return true;
    });
  }, [steps, answers]);

  const step = activeSteps[stepIndex];
  const total = activeSteps.length;

  function setField(name: string, value: string | string[] | boolean) {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  }

  function canNext(): boolean {
    if (!step) return false;
    if (step.type === "radio") {
      return Boolean(answers[step.field]);
    }
    if (step.type === "checkbox") return true;
    if (step.type === "fields") {
      return step.fields.every((f) => {
        if (!f.required) return true;
        const v = answers[f.name];
        return typeof v === "string" && v.trim().length > 0;
      });
    }
    if (step.type === "review") return true;
    return false;
  }

  function next() {
    if (step?.type === "review") {
      onComplete(answers);
      setDone(true);
      return;
    }
    if (stepIndex < total - 1) setStepIndex((i) => i + 1);
  }

  function prev() {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-2xl font-semibold text-foreground">Thank you!</h2>
        <p className="mt-2 text-muted">
          Your request was sent to our team. We&apos;ll follow up shortly to
          confirm your appointment.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold uppercase text-accent-fg"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!step) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <ProgressBar current={stepIndex} total={total} />
      <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
        {step.title}
      </h1>
      {step.subtitle ? (
        <p className="mt-2 text-sm text-muted">{step.subtitle}</p>
      ) : null}

      <div className="mt-8 space-y-3">
        {step.type === "radio" &&
          step.options.map((opt) => {
            const selected = answers[step.field] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setField(step.field, opt.value)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <span className="font-medium text-foreground">{opt.label}</span>
                {opt.hint ? (
                  <span className="mt-0.5 block text-sm text-muted">
                    {opt.hint}
                  </span>
                ) : null}
              </button>
            );
          })}

        {step.type === "checkbox" &&
          step.options.map((opt) => {
            const list = (answers[step.field] as string[] | undefined) ?? [];
            const checked = list.includes(opt.value);
            return (
              <label
                key={opt.value}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
                  checked ? "border-accent bg-accent/10" : "border-border"
                }`}
              >
                <span className="text-foreground">{opt.label}</span>
                {opt.price != null ? (
                  <span className="text-sm text-muted">
                    ${opt.price.toFixed(2)}
                  </span>
                ) : null}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? list.filter((x) => x !== opt.value)
                      : [...list, opt.value];
                    setField(step.field, next);
                  }}
                  className="h-4 w-4 accent-[var(--accent)]"
                />
              </label>
            );
          })}

        {step.type === "fields" &&
          step.fields.map((f) => (
            <label key={f.name} className="block text-sm text-muted">
              {f.label}
              <input
                type={f.inputType ?? "text"}
                required={f.required}
                placeholder={f.placeholder}
                value={(answers[f.name] as string) ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--input-bg)] px-3 py-2 text-foreground outline-none focus:border-accent"
              />
            </label>
          ))}

        {step.type === "review" && (
          <div className="space-y-4">
            {step.summary(answers).map((row) => (
              <div
                key={row.label}
                className="flex justify-between gap-4 border-b border-border pb-2 text-sm"
              >
                <span className="text-muted">{row.label}</span>
                <span className="text-right font-medium text-foreground">
                  {row.value}
                </span>
              </div>
            ))}
            {step.total?.(answers) != null ? (
              <div className="flex justify-between pt-2 text-lg font-semibold">
                <span>Estimated total</span>
                <span className="text-accent">
                  ${step.total!(answers)!.toFixed(2)}
                </span>
              </div>
            ) : null}
            <p className="text-xs text-muted">
              Demo: request is sent to the staff dashboard inbox. Production:
              sync with GoHighLevel / payment.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {stepIndex > 0 ? (
          <button
            type="button"
            onClick={prev}
            className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-foreground"
          >
            Previous
          </button>
        ) : null}
        <button
          type="button"
          disabled={!canNext()}
          onClick={next}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold uppercase text-accent-fg disabled:opacity-40"
        >
          {step.type === "review" ? completeLabel : "Next"}
        </button>
      </div>
    </div>
  );
}
