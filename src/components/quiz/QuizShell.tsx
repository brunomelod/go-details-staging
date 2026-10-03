import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { siteImages } from "@/data/site-images";
import type { ReactNode } from "react";

export function QuizShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 md:px-6">
        <Link href="/">
          <Image
            src={siteImages.logo}
            alt="Go Details"
            width={120}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>
        <ThemeToggle compact />
      </div>
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">{children}</div>
    </div>
  );
}
