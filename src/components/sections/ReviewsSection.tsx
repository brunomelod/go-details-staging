"use client";

import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { StarIcon } from "@/components/icons/StarIcon";
import { googleReviews } from "@/data/reviews";

function ReviewCard({
  name,
  text,
  rating,
}: {
  name: string;
  text: string;
  rating: number;
}) {
  return (
    <article className="w-[min(100%,320px)] shrink-0 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <div className="flex text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4" />
          ))}
        </div>
        <span className="text-sm text-muted">{rating.toFixed(1)}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">&ldquo;{text}&rdquo;</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <GoogleLogo className="h-5 w-5" />
      </div>
    </article>
  );
}

function VerticalTicker({
  reviews,
  direction,
}: {
  reviews: typeof googleReviews;
  direction: "up" | "down";
}) {
  const anim = direction === "up" ? "marquee-up" : "marquee-down";
  const doubled = [...reviews, ...reviews];

  return (
    <div className="relative h-[520px] overflow-hidden rounded-xl">
      <div className={`flex flex-col gap-4 ${anim}`} style={{ animationDuration: "55s" }}>
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.name}-${i}`} {...review} />
        ))}
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const colA = googleReviews.filter((_, i) => i % 2 === 0);
  const colB = googleReviews.filter((_, i) => i % 2 === 1);

  return (
    <section className="bg-page py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            5 star stories
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-foreground">
            Real stories, real results
          </h2>
          <p className="mt-3 text-muted">
            Discover why Northern Colorado homeowners trust Go Details.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <VerticalTicker reviews={colA} direction="up" />
          <VerticalTicker reviews={colB} direction="down" />
        </div>
      </div>
    </section>
  );
}
