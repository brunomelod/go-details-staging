import Image from "next/image";
import { siteImages } from "@/data/site-images";
import { normalizeWebflowCdnUrl } from "@/lib/cdn-url";

export function ServicesPreview() {
  return (
    <section id="services" className="bg-elevated py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Pick your service and see the shine
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-foreground">
          Luxury cleaning, inside and out
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siteImages.services.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative h-48">
                <Image
                  src={normalizeWebflowCdnUrl(service.image)}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-3 left-3 right-3 text-lg font-medium text-white">
                  {service.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
