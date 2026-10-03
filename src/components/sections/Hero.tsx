import Image from "next/image";
import { GoogleLogo } from "@/components/icons/GoogleLogo";
import { StarIcon } from "@/components/icons/StarIcon";
import { siteImages } from "@/data/site-images";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={siteImages.heroDesktop}
        alt=""
        fill
        priority
        className="object-cover object-[50%_0%] max-md:hidden"
        sizes="100vw"
      />
      <Image
        src={siteImages.heroMobile}
        alt=""
        fill
        priority
        className="object-cover object-[100%_50%] md:hidden"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:px-6 md:py-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-300">
            <span className="text-[#f7c602]">●</span>
            Proudly Serving Fort Collins, CO
          </div>

          <div>
            <h1 className="max-w-xl text-4xl font-semibold leading-tight text-white md:text-5xl">
              Reclaim <span className="text-[#f7c602]">Your Time.</span>
              <br />
              We Handle the <span className="text-[#f7c602]">Cleaning.</span>
            </h1>
            <p className="mt-4 max-w-md text-zinc-300">
              Top-rated home cleaning and auto detailing trusted by{" "}
              <span className="text-[#f7c602]">Fort Collins families.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Auto detailing
              </p>
              <p className="text-sm text-white">Interior Details</p>
              <p className="mt-2 text-2xl font-semibold text-[#f7c602]">$240</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-zinc-400">
                Home services
              </p>
              <p className="text-sm text-white">Deep Cleans</p>
              <p className="mt-2 text-2xl font-semibold text-[#f7c602]">$260</p>
            </div>
          </div>

          <div
            id="reviews"
            className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur"
          >
            <GoogleLogo className="h-10 w-10 shrink-0" />
            <div>
              <div className="flex gap-0.5 text-[#f7c602]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <p className="text-sm text-zinc-300">160+ Five-star Reviews</p>
            </div>
          </div>
        </div>

        <div
          id="book"
          className="flex flex-col justify-end gap-3 md:items-stretch md:pb-4"
        >
          <a
            href="/quiz-property-cleaning"
            className="rounded-full bg-white px-6 py-3 text-center text-sm font-semibold uppercase text-black hover:bg-zinc-100"
          >
            Book home cleaning
          </a>
          <a
            href="/quiz-auto-detailing"
            className="rounded-full border border-[#f7c602] px-6 py-3 text-center text-sm font-semibold uppercase text-[#f7c602] hover:bg-[#f7c602]/10"
          >
            Book auto detailing
          </a>
        </div>
      </div>
    </section>
  );
}
