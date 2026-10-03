import Image from "next/image";
import { Marquee } from "@/components/ui/Marquee";
import { siteImages } from "@/data/site-images";

export function ResultsMarquee() {
  const row1 = siteImages.carousel.slice(0, 5);
  const row2 = siteImages.carousel.slice(5);

  return (
    <section id="results" className="bg-page py-16">
      <div className="mx-auto max-w-6xl px-4 text-center md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Results that make a big change
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground md:text-4xl">
          Wow-worthy results
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Real homes and vehicles, professionally cleaned. No filters, just
          results.
        </p>
      </div>
      <div className="mt-10 space-y-4">
        <Marquee direction="left" durationSec={45}>
          {row1.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={320}
              height={240}
              className="h-48 w-72 shrink-0 rounded-xl object-cover"
            />
          ))}
        </Marquee>
        <Marquee direction="right" durationSec={50}>
          {row2.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={320}
              height={240}
              className="h-48 w-72 shrink-0 rounded-xl object-cover"
            />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
