import Image from "next/image";
import Link from "next/link";
import { QuizShell } from "@/components/quiz/QuizShell";
import { siteImages } from "@/data/site-images";
import { normalizeWebflowCdnUrl } from "@/lib/cdn-url";

const options = [
  {
    href: "/quiz-auto-detailing",
    title: "Auto detailing",
    description:
      "Mobile detailing packages, add-ons, and instant pricing for your vehicle.",
    image: siteImages.quizAuto,
  },
  {
    href: "/quiz-property-cleaning",
    title: "Home cleaning",
    description:
      "Recurring deep cleans, move-in/out, and time blocks tailored to your home.",
    image: siteImages.quizProperty,
  },
  {
    href: "/quiz-commercial-cleaning",
    title: "Commercial cleaning",
    description:
      "Offices and workspaces — tell us about your space and schedule.",
    image: siteImages.quizCommercial,
  },
  {
    href: "/quiz-bundles",
    title: "Bundles",
    description:
      "Combine vehicle care and home cleaning in one streamlined quote.",
    image: siteImages.quizBundles,
  },
] as const;

export function QuizIntro() {
  return (
    <QuizShell>
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Book with Go Details
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">
          Choose your service
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          Whether it&apos;s a detailed vehicle or a pristine home, Go Details
          delivers the same high standard of care — professional teams, reliable
          scheduling, and results you can see and feel.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {options.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition hover:border-accent/50 hover:shadow-lg"
          >
            <div className="relative h-44">
              <Image
                src={normalizeWebflowCdnUrl(item.image)}
                alt=""
                fill
                unoptimized
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width:768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <h2 className="absolute bottom-3 left-4 text-xl font-semibold text-white">
                {item.title}
              </h2>
            </div>
            <p className="p-4 text-sm text-muted">{item.description}</p>
          </Link>
        ))}
      </div>
    </QuizShell>
  );
}
