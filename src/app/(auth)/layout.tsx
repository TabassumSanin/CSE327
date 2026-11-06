import Link from "next/link";
import { Leaf } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-ink">Smart Food Exchange</span>
              <span className="block text-[11px] text-muted">Food Redistribution Platform</span>
            </span>
          </Link>
          <Link href="/" className="text-caption font-medium text-muted transition hover:text-primary">
            ← Back to home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
