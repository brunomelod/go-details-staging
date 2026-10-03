"use client";

import { QuizShell } from "@/components/quiz/QuizShell";
import {
  QuizWizard,
  type QuizAnswers,
  type QuizStep,
} from "@/components/quiz/QuizWizard";
import { submitQuizBooking } from "@/lib/quiz-submit";

const RESIDENTIAL_PROPERTY_STEP: QuizStep = {
  id: "property-type",
  type: "radio",
  field: "propertyType",
  title: "What type of property do you need cleaned?",
  subtitle: "This helps us tailor the service and pricing accurately.",
  options: [
    {
      value: "residential-home",
      label: "Deep Clean - Recurring Cleaning",
    },
    { value: "move-in-out", label: "Move-In / Move-Out Clean" },
    { value: "large-property", label: "Larger Home (2,500+ sq ft)" },
    {
      value: "custom-areas",
      label: "Specific Areas Only (you choose focus areas)",
    },
  ],
};

const COMMERCIAL_PROPERTY_STEP: QuizStep = {
  id: "property-type",
  type: "radio",
  field: "propertyType",
  title: "What type of commercial space needs cleaning?",
  subtitle: "We’ll match crew size and scheduling to your workspace.",
  options: [
    { value: "office", label: "Office / professional workspace" },
    { value: "retail", label: "Retail or showroom" },
    { value: "medical", label: "Medical or wellness facility" },
    { value: "other-commercial", label: "Other commercial space" },
  ],
};

function buildSteps(variant: "residential" | "commercial"): QuizStep[] {
  const propertyStep =
    variant === "commercial"
      ? COMMERCIAL_PROPERTY_STEP
      : RESIDENTIAL_PROPERTY_STEP;

  return [
  propertyStep,
  {
    id: "home-size",
    type: "radio",
    field: "homeSize",
    title:
      variant === "commercial"
        ? "How large is the space?"
        : "What size is your home?",
    subtitle: "Approximate size is perfect. No need to be exact.",
    options: [
      { value: "1000sqft", label: "One Bedroom — Up to 1,000 sq ft" },
      { value: "1500sqft", label: "Two Bedrooms — Up to 1,500 sq ft" },
      { value: "2000sqft", label: "Three Bedrooms — Up to 2,000 sq ft" },
      { value: "2500sqft", label: "Four Bedrooms — Up to 2,500 sq ft" },
    ],
  },
  {
    id: "frequency",
    type: "radio",
    field: "frequency",
    title: "How often do you need cleaning?",
    subtitle: "Choose the option that fits your lifestyle or property needs.",
    options: [
      { value: "weekly", label: "Weekly" },
      { value: "bi-weekly", label: "Bi-Weekly (best value for most homes)" },
      { value: "monthly", label: "Monthly" },
      { value: "one-time-turnover", label: "One-Time Turnover" },
    ],
  },
  {
    id: "cleaning-time",
    type: "radio",
    field: "cleaningTime",
    title: "Estimate your cleaning time",
    subtitle: "Select the minimum time block that best fits your needs.",
    options: [
      { value: "4h", label: "Minimum 4 hrs", price: 244 },
      { value: "4.5h", label: "Minimum 4.5 hrs", price: 274 },
      { value: "5h", label: "Minimum 5 hrs", price: 305 },
      { value: "5.5h", label: "Minimum 5.5 hrs", price: 335.5 },
      { value: "6h", label: "Minimum 6 hrs", price: 366 },
      { value: "6.5h", label: "Minimum 6.5 hrs", price: 396.5 },
      { value: "7h", label: "Minimum 7 hrs", price: 427 },
      { value: "7.5h", label: "Minimum 7.5 hrs", price: 457.5 },
      { value: "8h", label: "Minimum 8 hrs", price: 488 },
    ].map((o) => ({
      value: o.value,
      label: `${o.label} — $${o.price.toFixed(2)}`,
    })),
  },
  {
    id: "contact",
    type: "fields",
    title: "Let's get your details",
    fields: [
      {
        name: "firstName",
        label: "First name *",
        required: true,
      },
      {
        name: "lastName",
        label: "Last name *",
        required: true,
      },
      {
        name: "phone",
        label: "Phone *",
        inputType: "tel",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        inputType: "email",
      },
      {
        name: "street",
        label: "Street address *",
        required: true,
      },
      {
        name: "city",
        label: "City *",
        required: true,
      },
      {
        name: "zip",
        label: "Zip code *",
        required: true,
      },
    ],
  },
  {
    id: "review",
    type: "review",
    title: "Here's your personalized bundle quote",
    summary: (a) => [
      { label: "Property type", value: String(a.propertyType ?? "—") },
      { label: "Home size", value: String(a.homeSize ?? "—") },
      { label: "Frequency", value: String(a.frequency ?? "—") },
      { label: "Time block", value: String(a.cleaningTime ?? "—") },
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
      const map: Record<string, number> = {
        "4h": 244,
        "4.5h": 274,
        "5h": 305,
        "5.5h": 335.5,
        "6h": 366,
        "6.5h": 396.5,
        "7h": 427,
        "7.5h": 457.5,
        "8h": 488,
      };
      const t = a.cleaningTime as string | undefined;
      return t ? map[t] ?? null : null;
    },
  },
];
}

type PropertyCleaningQuizProps = {
  variant?: "residential" | "commercial";
};

export function PropertyCleaningQuiz({
  variant = "residential",
}: PropertyCleaningQuizProps) {
  const steps = buildSteps(variant);

  function handleComplete(answers: QuizAnswers) {
    const review = steps.find((s) => s.type === "review");
    const summaryLines =
      review?.type === "review"
        ? review.summary(answers).map((r) => `${r.label}: ${r.value}`)
        : [];
    const total =
      review?.type === "review" ? review.total?.(answers) ?? undefined : undefined;

    submitQuizBooking({
      quizId:
        variant === "commercial"
          ? "commercial-cleaning"
          : "property-cleaning",
      quizTitle:
        variant === "commercial"
          ? "Commercial cleaning quiz"
          : "Home cleaning quiz",
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
      <QuizWizard steps={steps} onComplete={handleComplete} />
    </QuizShell>
  );
}
