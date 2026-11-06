"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/providers/app-provider";
import { Leaf, Globe2 } from "lucide-react";

const links = [
  { label: "Home", key: "home", href: "/" },
  { label: "About", key: "about", href: "/about" },
  { label: "How It Works", key: "howItWorks", href: "/how-it-works" },
  { label: "Contact", key: "contact", href: "/contact" },
];

export function PublicHeader() {
  const { language, toggleLanguage, t } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Smart Food Exchange home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold text-ink">{t("brand")}</span>
            <span className="block text-[11px] text-muted">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-label transition",
                pathname === link.href
                  ? "bg-lightgreen text-primary"
                  : "text-muted hover:bg-lightgreen/60 hover:text-primary"
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="hidden items-center gap-1.5 rounded-lg border border-line px-2.5 py-2 text-caption font-medium text-muted transition hover:border-secondary hover:text-primary sm:inline-flex"
            aria-label="Switch language"
          >
            <Globe2 className="h-3.5 w-3.5" />
            {language === "en" ? "বাংলা" : "English"}
          </button>
          <Link
            href="/login"
            className="hidden h-10 items-center rounded-xl border border-line bg-white px-4 text-btn text-ink transition hover:border-secondary hover:text-primary sm:inline-flex"
          >
            {t("login")}
          </Link>
          <Link
            href="/register"
            className="hidden h-10 items-center rounded-xl bg-primary px-4 text-btn text-white transition hover:bg-[#1d4c39] sm:inline-flex"
          >
            {t("register")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-white px-4 pb-4 lg:hidden">
          <nav className="flex flex-col py-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-label",
                  pathname === link.href ? "bg-lightgreen text-primary" : "text-ink"
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 border-t border-line pt-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl border border-line text-btn text-ink"
            >
              <Globe2 className="h-4 w-4" /> {language === "en" ? "বাংলা" : "English"}
            </button>
            <Link href="/login" className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-line text-btn text-ink">
              {t("login")}
            </Link>
            <Link href="/register" className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-primary text-btn text-white">
              {t("register")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
