"use client";

import { QuizShell } from "@/components/quiz/QuizShell";
import {
  QuizWizard,
  type QuizAnswers,
  type QuizStep,
} from "@/components/quiz/QuizWizard";
import {
  AUTO_EXTRAS,
  AUTO_PACKAGES,
  AUTO_VEHICLES,
  calculateAutoTotal,
  getAutoExtrasForPackage,
} from "@/lib/auto-quiz-pricing";
import { submitQuizBooking } from "@/lib/quiz-submit";

function buildSteps(): QuizStep[] {
  return [
    {
      id: "vehicle",
      type: "radio",
      field: "vehicle",
      title: "What kind of vehicle do you have?",
      options: AUTO_VEHICLES.map((v) => ({ value: v, label: v })),
    },
    {
      id: "package",
      type: "radio",
      field: "package",
      title: "Which detailing package would you like?",
      options: AUTO_PACKAGES.map((p) => ({
        value: p.value,
        label: p.label,
        hint: p.hint,
      })),
    },
    {
      id: "extras",
      type: "checkbox",
      field: "extras",
      title: "Would you like to add any of these extras?",
      options: AUTO_EXTRAS.map((e) => ({
        value: e.id,
        label: e.label,
        price: e.price,
      })),
    },
    {
      id: "details",
      type: "fields",
      title: "Let's get your details",
      subtitle: "Vehicle information and contact",
      fields: [
        {
          name: "firstName",
          label: "First name *",
          required: true,
          placeholder: "First name",
        },
        {
          name: "lastName",
          label: "Last name *",
          required: true,
          placeholder: "Last name",
        },
        {
          name: "phone",
          label: "Phone *",
          inputType: "tel",
          required: true,
          placeholder: "+1 (970) 555-0100",
        },
        {
          name: "email",
          label: "Email",
          inputType: "email",
          placeholder: "you@email.com",
        },
        {
          name: "year",
          label: "Year *",
          required: true,
          placeholder: "2022",
        },
        {
          name: "make",
          label: "Make *",
          required: true,
          placeholder: "Toyota",
        },
        {
          name: "model",
          label: "Model *",
          required: true,
          placeholder: "Camry",
        },
      ],
    },
    {
      id: "address",
      type: "fields",
      title: "Tell us where to meet you",
      subtitle:
        "We're a fully mobile team — park and we'll handle the rest.",
      fields: [
        {
          name: "street",
          label: "Street address *",
          required: true,
          placeholder: "123 Main St",
        },
        {
          name: "city",
          label: "City *",
          required: true,
          placeholder: "Fort Collins",
        },
        {
          name: "zip",
          label: "Zip code *",
          required: true,
          placeholder: "80521",
        },
      ],
    },
    {
      id: "review",
      type: "review",
      title: "Review and confirm your appointment",
      subtitle: "Please review your selections below.",
      summary: (a) => {
        const pkgName = String(a.package ?? "");
        const extraIds = ((a.extras as string[] | undefined) ?? []).filter(
          (id) =>
            getAutoExtrasForPackage(pkgName).some((e) => e.id === id),
        );
        const extraLabels = extraIds.length
          ? extraIds
              .map(
                (id) =>
                  getAutoExtrasForPackage(pkgName).find((e) => e.id === id)
                    ?.label,
              )
              .filter(Boolean)
              .join(", ")
          : "None";
        return [
          { label: "Vehicle type", value: String(a.vehicle ?? "—") },
          { label: "Package", value: String(a.package ?? "—") },
          { label: "Extras", value: extraLabels || "None" },
          {
            label: "Vehicle",
            value: `${a.year ?? ""} ${a.make ?? ""} ${a.model ?? ""}`.trim(),
          },
          {
            label: "Contact",
            value: `${a.firstName ?? ""} ${a.lastName ?? ""} · ${a.phone ?? ""}`.trim(),
          },
          {
            label: "Service address",
            value: `${a.street ?? ""}, ${a.city ?? ""} ${a.zip ?? ""}`.trim(),
          },
        ];
      },
      total: (a) => {
        const vehicle = String(a.vehicle ?? "");
        const packageName = String(a.package ?? "");
        const extraIds = ((a.extras as string[] | undefined) ?? []).filter(
          (id) =>
            getAutoExtrasForPackage(packageName).some((e) => e.id === id),
        );
        if (!vehicle || !packageName) return null;
        return calculateAutoTotal(vehicle, packageName, extraIds);
      },
    },
  ];
}

export function AutoDetailingQuiz() {
  const steps = buildSteps();

  function handleComplete(answers: QuizAnswers) {
    const firstName = String(answers.firstName ?? "").trim();
    const lastName = String(answers.lastName ?? "").trim();
    const phone = String(answers.phone ?? "").trim();
    const email = String(answers.email ?? "").trim();
    const packageName = String(answers.package ?? "");
    const extraIds = ((answers.extras as string[] | undefined) ?? []).filter(
      (id) => getAutoExtrasForPackage(packageName).some((e) => e.id === id),
    );
    const total = calculateAutoTotal(
      String(answers.vehicle ?? ""),
      packageName,
      extraIds,
    );

    const reviewStep = buildSteps().find((s) => s.type === "review");
    const summaryLines =
      reviewStep?.type === "review"
        ? reviewStep.summary(answers).map((r) => `${r.label}: ${r.value}`)
        : [];

    submitQuizBooking({
      quizId: "auto-detailing",
      quizTitle: "Auto detailing quiz",
      customerName: `${firstName} ${lastName}`.trim() || "Quiz customer",
      customerContact: [phone, email].filter(Boolean).join(" · "),
      summaryLines,
      estimatedTotal: total,
    });
  }

  return (
    <QuizShell>
      <QuizWizard steps={steps} onComplete={handleComplete} />
    </QuizShell>
  );
}
