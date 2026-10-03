import Link from "next/link";
import { DemoLoginForm } from "@/components/auth/DemoLoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-page px-4 py-12">
      <Link
        href="/"
        className="mb-8 text-sm text-muted hover:text-accent"
      >
        ← Back to website
      </Link>
      <DemoLoginForm />
    </div>
  );
}
