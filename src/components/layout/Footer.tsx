import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-page py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p>© {new Date().getFullYear()} Go Details — Fort Collins, CO</p>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
