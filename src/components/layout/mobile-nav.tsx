"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/nav";
import { useApp } from "@/components/providers/app-provider";

export function MobileBottomNav({ role, nav }: { role: string; nav: NavItem[] }) {
  const pathname = usePathname();
  const { language } = useApp();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      aria-label="Primary mobile navigation"
    >
      <div className="grid grid-cols-5">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[60px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10.5px] font-medium transition",
                active ? "text-primary" : "text-muted hover:text-primary"
              )}
            >
              <span
                className={cn(
                  "grid h-8 w-10 place-items-center rounded-lg transition",
                  active ? "bg-lightgreen" : "bg-transparent"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="w-full truncate text-center">
                {language === "bn" ? item.labelBn : item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
