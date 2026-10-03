import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteImages } from "@/data/site-images";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#results", label: "Our Results" },
  { href: "#reviews", label: "Reviews" },
];

export function Header() {
  return (
    <header className="relative z-20 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src={siteImages.logo}
            alt="Go Details"
            width={140}
            height={48}
            className="h-10 w-auto object-contain md:h-12"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline">
            <ThemeToggle />
          </span>
          <span className="sm:hidden">
            <ThemeToggle compact />
          </span>
          <a
            href="tel:9706375446"
            className="hidden rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground md:inline-block"
          >
            +1 (970) 637-5446
          </a>
          <a
            href="/quiz-intro"
            className="rounded-full bg-accent px-4 py-2 text-xs font-semibold uppercase text-accent-fg hover:opacity-90"
          >
            Book now
          </a>
        </div>
      </div>
    </header>
  );
}
