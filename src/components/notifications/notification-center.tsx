"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, BellOff, CheckCheck, SearchX, Settings2 } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { Button, buttonStyles } from "@/components/ui/button";
import { NotificationCard } from "@/components/ui/notification-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Role } from "@/types";

export function NotificationCenter({ role }: { role: Extract<Role, "donor" | "recipient"> }) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [tab, setTab] = useState("all");
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");

  const mine = notifications.filter((item) => item.audience === role);
  const unread = mine.filter((item) => !item.read);
  const types = Array.from(new Set(mine.map((item) => item.type))).sort();

  const filtered = useMemo(
    () =>
      mine
        .filter((item) => (tab === "unread" ? !item.read : true))
        .filter((item) => (type === "all" ? true : item.type === type))
        .filter((item) => {
          if (!search) return true;
          return `${item.title} ${item.message} ${item.type}`.toLowerCase().includes(search.toLowerCase());
        }),
    [mine, tab, type, search]
  );

  const reset = () => { setTab("all"); setType("all"); setSearch(""); };

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Stay up to date with matches, reservations, verification results, and collection reminders."
        actions={
          <>
            <Link href={`/${role}/profile`} className={buttonStyles("outline")}>
              <Settings2 className="h-4 w-4" /> Preferences
            </Link>
            <Button onClick={() => markAllNotificationsRead(role)} disabled={unread.length === 0}>
              <CheckCheck className="h-4 w-4" /> Mark all as read
            </Button>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Unread" value={unread.length} icon={Bell} tone={unread.length ? "amber" : "green"} hint="Needs your attention" />
        <StatCard label="Total Notifications" value={mine.length} icon={Bell} />
        <StatCard label="Match Alerts" value={mine.filter((item) => item.type === "match").length} icon={Bell} tone="blue" />
        <StatCard label="Reservation Updates" value={mine.filter((item) => item.type === "reservation").length} icon={CheckCheck} />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <Tabs
            options={[
              { value: "all", label: "All", count: mine.length },
              { value: "unread", label: "Unread", count: unread.length },
            ]}
            value={tab}
            onChange={setTab}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchField value={search} onChange={setSearch} placeholder="Search notifications..." className="flex-1" ariaLabel="Search notifications" />
            <Select value={type} onChange={(event) => setType(event.target.value)} className="sm:w-44" aria-label="Filter by notification type">
              <option value="all">All types</option>
              {types.map((item) => <option key={item} value={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</option>)}
            </Select>
            <Button variant="outline" onClick={reset}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-small text-muted">{filtered.length} notification{filtered.length === 1 ? "" : "s"}</p>
        <p className="text-caption text-muted">Notifications are simulated for this demo.</p>
      </div>

      {filtered.length ? (
        <div className="mt-3 space-y-2">
          {filtered.map((item) => (
            <NotificationCard key={item.id} item={item} onRead={markNotificationRead} />
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <EmptyState
            icon={tab === "unread" && mine.length ? BellOff : SearchX}
            title={tab === "unread" && mine.length ? "You are all caught up" : "No notifications match"}
            description={tab === "unread" && mine.length ? "Every notification has been read. New updates will appear here." : "Try a different tab, type, or search term."}
            action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
          />
        </div>
      )}

      <SectionCard className="mt-4" title="Notification Settings">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-muted">Choose which updates you receive by email and in-app. Preference changes are managed on your profile.</p>
          <Link href={`/${role}/profile`} className={buttonStyles("outline", "sm")}>
            <Settings2 className="h-3.5 w-3.5" /> Manage preferences
          </Link>
        </div>
      </SectionCard>
    </>
  );
}
