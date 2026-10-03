"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { siteImages } from "@/data/site-images";
import { normalizeWebflowCdnUrl } from "@/lib/cdn-url";

const TABS = [
  {
    title: "Easy Online Booking",
    description:
      "Book with confidence. Our easy online system lets you schedule your service without needing a credit card upfront.",
  },
  {
    title: "Mobile Convenience",
    description:
      "We come to you, whether it's your driveway or doorstep, saving you time while delivering five star results.",
  },
  {
    title: "Five Star Rated",
    description:
      "Trusted by customers across Northern Colorado, with over 160 glowing reviews reflecting our commitment to excellence.",
  },
  {
    title: "Transparent Pricing",
    description:
      "Know exactly what you're paying for. No hidden fees, just clear, upfront pricing tailored to your vehicle or home.",
  },
  {
    title: "Insured & Reliable",
    description:
      "All services are fully insured and performed by experienced professionals, giving you peace of mind every time.",
  },
  {
    title: "Bilingual & Friendly",
    description:
      "We proudly serve English and Spanish speaking clients with a friendly, professional touch.",
  },
] as const;

const AUTO_ADVANCE_MS = 5000;

export function WhyGoDetailsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index % TABS.length);
    setProgress(0);
  }, []);

  useEffect(() => {
    const tick = 50;
    const id = window.setInterval(() => {
      setProgress((p) => {
        const next = p + (tick / AUTO_ADVANCE_MS) * 100;
        if (next >= 100) {
          setActiveIndex((i) => (i + 1) % TABS.length);
          return 0;
        }
        return next;
      });
    }, tick);
    return () => window.clearInterval(id);
  }, [activeIndex]);

  const active = TABS[activeIndex];

  return (
    <section className="relative overflow-hidden bg-[#0c0c0c] py-16 text-white md:py-20">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-black/80"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl font-semibold md:text-4xl">
          The Difference In the Details
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-stretch">
          <div className="flex flex-col gap-2">
            {TABS.map((tab, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={tab.title}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`rounded-xl border px-4 py-4 text-left transition ${
                    isActive
                      ? "border-white/20 bg-white/5"
                      : "border-transparent hover:bg-white/5"
                  }`}
                >
                  <h3 className="text-lg font-semibold">{tab.title}</h3>
                  <p
                    className={`mt-1 text-sm leading-relaxed transition ${
                      isActive ? "text-zinc-300" : "text-zinc-500"
                    }`}
                  >
                    {tab.description}
                  </p>
                  <div className="mt-3 h-0.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full bg-accent transition-[width] duration-75 ease-linear"
                      style={{
                        width: isActive ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                </button>
              );
            })}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quiz-auto-detailing"
                className="rounded-full bg-white px-6 py-3 text-center text-xs font-semibold uppercase text-black hover:bg-zinc-100"
              >
                Book auto detailing
              </Link>
              <Link
                href="/quiz-property-cleaning"
                className="rounded-full border border-accent px-6 py-3 text-center text-xs font-semibold uppercase text-accent hover:bg-accent/10"
              >
                Book home cleaning
              </Link>
            </div>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-[480px]">
            <Image
              src={normalizeWebflowCdnUrl(siteImages.whyTeamMember)}
              alt="A Go Details team member"
              fill
              unoptimized
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-l lg:from-black/30 lg:via-transparent lg:to-transparent" />
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {active.title}: {active.description}
        </p>
      </div>
    </section>
  );
}
