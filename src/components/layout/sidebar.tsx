"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  LogOut,
  X,
  ShieldCheck,
  HeartHandshake,
  HandHeart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";
import { useApp } from "@/components/providers/app-provider";

const roleMeta = {
  admin: { title: "Administrator", subtitle: "Platform control", icon: ShieldCheck },
  donor: { title: "Donor Account", subtitle: "Green Harvest Kitchen", icon: HeartHandshake },
  recipient: { title: "Recipient Account", subtitle: "Hope Community Kitchen", icon: HandHeart },
};

export function Sidebar({
  role,
  nav,
  mobileOpen,
  onCloseMobile,
}: {
  role: "admin" | "donor" | "recipient";
  nav: NavItem[];
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { t, language } = useApp();
  const meta = roleMeta[role];
  const RoleIcon = meta.icon;

  const content = (
    <>
      <div className={cn("flex h-16 items-center gap-2.5 border-b border-line px-4", collapsed && "lg:justify-center lg:px-2")}>
        <Link href="/" className="flex items-center gap-2.5" aria-label="Smart Food Exchange home">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-white">
            <Leaf className="h-5 w-5" />
          </span>
          <span className={cn("leading-tight", collapsed && "lg:hidden")}>
            <span className="block text-[14px] font-bold text-ink">{t("brand")}</span>
            <span className="block text-[10.5px] text-muted">{t("tagline")}</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-muted hover:bg-lightgreen lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("mx-3 mt-4 flex items-center gap-2.5 rounded-xl bg-lightgreen px-3 py-2.5", collapsed && "lg:justify-center lg:px-2")}>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-white">
          <RoleIcon className="h-4 w-4" />
        </span>
        <div className={cn("min-w-0", collapsed && "lg:hidden")}>
          <p className="truncate text-caption font-semibold text-primary">{meta.title}</p>
          <p className="truncate text-[11px] text-muted">{meta.subtitle}</p>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2.5 pb-4 scrollbar-thin" aria-label={`${role} navigation`}>
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-label transition",
                active
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted hover:bg-lightgreen hover:text-primary",
                collapsed && "lg:justify-center lg:px-2"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className={cn("truncate", collapsed && "lg:hidden")}>
                {language === "bn" ? item.labelBn : item.label}
              </span>
              {active ? <ChevronRight className={cn("ml-auto h-4 w-4", collapsed && "lg:hidden")} /> : null}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-line p-3", collapsed && "lg:px-2")}>
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-label text-muted transition hover:bg-error hover:text-[#8C2F27]",
            collapsed && "lg:justify-center lg:px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          <span className={cn(collapsed && "lg:hidden")}>{t("logout")}</span>
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="mt-1 hidden w-full items-center gap-2.5 rounded-xl px-3 py-2 text-caption text-muted transition hover:bg-lightgreen hover:text-primary lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="mx-auto h-4 w-4" /> : <><ChevronLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-line bg-white transition-[width] duration-200 lg:flex",
          collapsed ? "w-[76px]" : "w-[264px]"
        )}
      >
        {content}
      </aside>

      <div className={cn("fixed inset-0 z-50 lg:hidden", mobileOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <div
          className={cn("absolute inset-0 bg-[#1B2C23]/50 transition-opacity", mobileOpen ? "opacity-100" : "opacity-0")}
          onClick={onCloseMobile}
          aria-hidden
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-[280px] max-w-[85%] flex-col bg-white shadow-soft transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
          aria-label="Mobile navigation"
        >
          {content}
        </aside>
      </div>
    </>
  );
}
