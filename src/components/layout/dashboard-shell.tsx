"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileBottomNav } from "@/components/layout/mobile-nav";
import { adminNav, donorNav, recipientNav, mobileNav, type NavItem } from "@/lib/nav";

const navByRole: Record<"admin" | "donor" | "recipient", NavItem[]> = {
  admin: adminNav,
  donor: donorNav,
  recipient: recipientNav,
};

export function DashboardShell({
  role,
  user,
  children,
}: {
  role: "admin" | "donor" | "recipient";
  user: { name: string; subtitle: string; color: string };
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = navByRole[role];

  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar
        role={role}
        nav={nav}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} nav={nav} user={user} onOpenMobile={() => setMobileOpen(true)} />
        <main className="container-page flex-1 py-5 pb-24 md:py-6 lg:pb-8">{children}</main>
        <MobileBottomNav role={role} nav={mobileNav[role]} />
      </div>
    </div>
  );
}
