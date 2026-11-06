"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Globe2,
  LogOut,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/components/providers/app-provider";
import type { NavItem } from "@/lib/nav";
import { adminNav, donorNav, recipientNav } from "@/lib/nav";
import { Modal } from "@/components/ui/modal";

const roleLinks = [
  { href: "/admin/dashboard", label: "Admin dashboard" },
  { href: "/donor/dashboard", label: "Donor dashboard" },
  { href: "/recipient/dashboard", label: "Recipient dashboard" },
];

export function Topbar({
  role,
  nav,
  user,
  onOpenMobile,
}: {
  role: "admin" | "donor" | "recipient";
  nav: NavItem[];
  user: { name: string; subtitle: string; color: string };
  onOpenMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage, notifications, t } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current =
    nav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ??
    (pathname.startsWith("/recipient/food/")
      ? nav.find((item) => item.href === "/recipient/available-food")
      : undefined);
  const unread = notifications.filter((item) => item.audience === role && !item.read).length;

  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const allNav = useMemo(() => [...adminNav, ...donorNav, ...recipientNav], []);
  const matches = useMemo(
    () =>
      allNav
        .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
        .filter((item, index, self) => self.findIndex((entry) => entry.href === item.href) === index)
        .slice(0, 8),
    [allNav, query]
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-2 px-3 md:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-label font-semibold text-ink md:text-h3">
            {language === "bn" ? current?.labelBn : current?.label ?? t("dashboard")}
          </p>
          <p className="hidden truncate text-caption text-muted sm:block">
            {role === "admin"
              ? "Smart Food Exchange administration"
              : role === "donor"
              ? "Donation management workspace"
              : "Recipient workspace"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="hidden h-10 w-64 items-center gap-2 rounded-xl border border-line bg-page px-3 text-left text-caption text-muted transition hover:border-secondary md:flex"
          aria-label="Search pages"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1">Search pages…</span>
          <kbd className="rounded border border-line bg-white px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-muted transition hover:text-primary md:hidden"
          aria-label="Search pages"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className="hidden h-10 items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 text-caption font-medium text-muted transition hover:text-primary sm:inline-flex"
          aria-label="Switch language"
        >
          <Globe2 className="h-4 w-4" />
          {language === "en" ? "বাংলা" : "EN"}
        </button>

        <Link
          href={`/${role}/notifications`}
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-muted transition hover:text-primary"
          aria-label={`${t("notifications")}${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#B4473D] px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          ) : null}
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            className="flex h-10 items-center gap-2 rounded-xl border border-line bg-white pl-1 pr-2 transition hover:border-secondary"
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <span
              className="grid h-8 w-8 place-items-center rounded-lg text-caption font-semibold text-white"
              style={{ backgroundColor: user.color }}
            >
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <span className="hidden max-w-[120px] truncate text-caption font-medium text-ink lg:block">
              {user.name}
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted lg:block" />
          </button>

          {profileOpen ? (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden />
              <div
                role="menu"
                className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-soft animate-fade-up"
              >
                <div className="border-b border-line px-4 py-3">
                  <p className="text-label font-semibold text-ink">{user.name}</p>
                  <p className="text-caption text-muted">{user.subtitle}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    href={`/${role}/profile`}
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-small text-ink hover:bg-lightgreen hover:text-primary"
                  >
                    <UserRound className="h-4 w-4" /> {t("profile")}
                  </Link>
                  <Link
                    href={role === "admin" ? "/admin/settings" : `/${role}/profile`}
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-small text-ink hover:bg-lightgreen hover:text-primary"
                  >
                    <Settings className="h-4 w-4" /> {t("settings")}
                  </Link>
                </div>
                <div className="border-t border-line p-1.5">
                  <p className="px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted">
                    Demo role switcher
                  </p>
                  {roleLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-small hover:bg-lightgreen hover:text-primary",
                        link.href.startsWith(`/${role}/`) ? "text-primary" : "text-muted"
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-line p-1.5">
                  <Link
                    href="/login"
                    role="menuitem"
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-small text-[#8C2F27] hover:bg-error"
                  >
                    <LogOut className="h-4 w-4" /> {t("logout")}
                  </Link>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <Modal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        title="Search pages"
        description="Jump to any page across the admin, donor, and recipient workspaces."
        size="sm"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages…"
            className="field pl-9 pr-9"
            aria-label="Search pages"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-primary"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <ul className="mt-3 max-h-72 overflow-y-auto">
          {matches.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    router.push(item.href);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-small text-ink hover:bg-lightgreen hover:text-primary"
                >
                  <Icon className="h-4 w-4 text-secondary" />
                  {item.label}
                  <span className="ml-auto text-caption text-muted">{item.href}</span>
                </button>
              </li>
            );
          })}
          {matches.length === 0 ? (
            <li className="px-2.5 py-6 text-center text-small text-muted">No pages match “{query}”.</li>
          ) : null}
        </ul>
      </Modal>
    </header>
  );
}
