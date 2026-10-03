"use client";

import { QuizShell } from "@/components/quiz/QuizShell";
import {
  QuizWizard,
  type QuizAnswers,
  type QuizStep,
} from "@/components/quiz/QuizWizard";
import {
  AUTO_PACKAGES,
  AUTO_VEHICLES,
  calculateAutoTotal,
} from "@/lib/auto-quiz-pricing";
import { submitQuizBooking } from "@/lib/quiz-submit";

const CLEANING_TIME_PRICES: Record<string, number> = {
  "4h": 244,
  "5h": 305,
  "6h": 366,
};

const STEPS: QuizStep[] = [
  {
    id: "vehicle",
    type: "radio",
    field: "vehicle",
    title: "What kind of vehicle do you have?",
    options: AUTO_VEHICLES.map((v) => ({ value: v, label: v })),
  },
  {
    id: "auto-package",
    type: "radio",
    field: "autoPackage",
    title: "Which detailing package would you like?",
    options: AUTO_PACKAGES.map((p) => ({
      value: p.value,
      label: p.label,
      hint: p.hint,
    })),
  },
  {
    id: "home-size",
    type: "radio",
    field: "homeSize",
    title: "What size is your home?",
    options: [
      { value: "1000sqft", label: "Up to 1,000 sq ft" },
      { value: "1500sqft", label: "Up to 1,500 sq ft" },
      { value: "2000sqft", label: "Up to 2,000 sq ft" },
      { value: "2500sqft", label: "Up to 2,500 sq ft" },
    ],
  },
  {
    id: "frequency",
    type: "radio",
    field: "frequency",
    title: "How often do you need home cleaning?",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "bi-weekly", label: "Bi-Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "one-time", label: "One-time" },
    ],
  },
  {
    id: "cleaning-time",
    type: "radio",
    field: "cleaningTime",
    title: "Estimate your cleaning time",
    options: [
      { value: "4h", label: "Minimum 4 hrs — $244.00" },
      { value: "5h", label: "Minimum 5 hrs — $305.00" },
      { value: "6h", label: "Minimum 6 hrs — $366.00" },
    ],
  },
  {
    id: "contact",
    type: "fields",
    title: "A few details before we get started",
    fields: [
      { name: "firstName", label: "First name *", required: true },
      { name: "lastName", label: "Last name *", required: true },
      { name: "phone", label: "Phone *", inputType: "tel", required: true },
      { name: "email", label: "Email", inputType: "email" },
      { name: "street", label: "Street address *", required: true },
      { name: "city", label: "City *", required: true },
      { name: "zip", label: "Zip code *", required: true },
    ],
  },
  {
    id: "review",
    type: "review",
    title: "Here’s your personalized bundle quote",
    summary: (a) => [
      { label: "Vehicle", value: String(a.vehicle ?? "—") },
      { label: "Detailing", value: String(a.autoPackage ?? "—") },
      { label: "Home size", value: String(a.homeSize ?? "—") },
      { label: "Cleaning frequency", value: String(a.frequency ?? "—") },
      { label: "Cleaning time", value: String(a.cleaningTime ?? "—") },
      {
        label: "Contact",
        value: `${a.firstName ?? ""} ${a.lastName ?? ""} · ${a.phone ?? ""}`.trim(),
      },
      {
        label: "Address",
        value: `${a.street ?? ""}, ${a.city ?? ""} ${a.zip ?? ""}`.trim(),
      },
    ],
    total: (a) => {
      const vehicle = String(a.vehicle ?? "");
      const pkg = String(a.autoPackage ?? "");
      const time = String(a.cleaningTime ?? "");
      const auto =
        vehicle && pkg ? calculateAutoTotal(vehicle, pkg, []) : 0;
      const home = CLEANING_TIME_PRICES[time] ?? 0;
      if (!auto && !home) return null;
      return auto + home;
    },
  },
];

export function BundlesQuiz() {
  function handleComplete(answers: QuizAnswers) {
    const review = STEPS.find((s) => s.type === "review");
    const summaryLines =
      review?.type === "review"
        ? review.summary(answers).map((r) => `${r.label}: ${r.value}`)
        : [];
    const total =
      review?.type === "review"
        ? review.total?.(answers) ?? undefined
        : undefined;

    submitQuizBooking({
      quizId: "bundles",
      quizTitle: "Bundle quiz",
      customerName:
        `${answers.firstName ?? ""} ${answers.lastName ?? ""}`.trim() ||
        "Quiz customer",
      customerContact: [answers.phone, answers.email]
        .filter(Boolean)
        .join(" · "),
      summaryLines,
      estimatedTotal: total ?? undefined,
    });
  }

  return (
    <QuizShell>
      <QuizWizard steps={STEPS} onComplete={handleComplete} />
    </QuizShell>
  );
}
