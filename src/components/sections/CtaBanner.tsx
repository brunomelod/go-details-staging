import Image from "next/image";

type CtaBannerProps = {
  image: string;
  title: string;
  description: string;
};

export function CtaBanner({ image, title, description }: CtaBannerProps) {
  return (
    <section className="py-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl px-4 md:px-6">
        <div className="relative min-h-[280px] overflow-hidden rounded-2xl">
          <Image src={image} alt="" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative flex min-h-[280px] flex-col justify-center p-8 md:p-12">
            <h2 className="max-w-lg text-3xl font-semibold text-white">{title}</h2>
            <p className="mt-2 max-w-md text-zinc-200">{description}</p>
            <a
              href="/quiz-intro"
              className="mt-6 inline-flex w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase text-black"
            >
              Get your quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
