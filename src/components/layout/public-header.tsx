"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Leaf, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/providers/app-provider";
import { buttonStyles } from "@/components/ui/button";

const links = [
  { label: "home", href: "/" },
  { label: "about", href: "/about" },
  { label: "howItWorks", href: "/how-it-works" },
  { label: "contact", href: "/contact" },
];

export function PublicHeader() {
  const { language, toggleLanguage, t } = useApp();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-page">
      <div className="container-page flex h-16 items-center justify-between gap-3 md:h-[72px]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Smart Food Exchange home">
          <Leaf className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <span className="min-w-0 leading-tight">
            <span className="block truncate font-display text-[16px] font-semibold text-ink md:text-[17px]">
              {t("brand")}
            </span>
            <span className="hidden text-[11px] text-muted sm:block">{t("tagline")}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main navigation">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "py-2 text-label transition-colors",
                  active
                    ? "font-semibold text-primary underline decoration-primary decoration-2 underline-offset-8"
                    : "text-muted hover:text-primary"
                )}
              >
                {t(link.label)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-caption font-medium text-muted transition-colors hover:bg-cream hover:text-primary sm:px-2.5"
            aria-label={language === "en" ? "Switch language to Bangla" : "Switch language to English"}
          >
            <Globe2 className="h-4 w-4" aria-hidden />
            {language === "en" ? "বাংলা" : "English"}
          </button>

          <Link
            href="/login"
            className="hidden text-label text-ink transition-colors hover:text-primary sm:inline-flex sm:py-2"
          >
            {t("login")}
          </Link>
          <Link href="/register?role=donor" className={buttonStyles("primary", "md", "hidden sm:inline-flex")}>
            {t("donateFood")}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="public-mobile-menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="public-mobile-menu" className="border-t border-line bg-page lg:hidden">
          <nav className="container-page flex flex-col py-2" aria-label="Mobile navigation">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b border-line py-3 text-body last:border-b-0",
                    active ? "font-semibold text-primary" : "text-ink"
                  )}
                >
                  {t(link.label)}
                </Link>
              );
            })}
          </nav>
          <div className="container-page flex flex-col gap-2 pb-5 pt-2 sm:flex-row">
            <Link href="/register?role=donor" className={buttonStyles("primary", "md", "flex-1")}>
              {t("donateFood")}
            </Link>
            <Link href="/login" className={buttonStyles("secondary", "md", "flex-1")}>
              {t("login")}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
