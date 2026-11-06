"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  MapPin,
  Package,
  PackageCheck,
  Sparkles,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { FoodCard } from "@/components/ui/food-card";
import { ProgressBar, DonutChart } from "@/components/ui/charts";
import { currentRecipient } from "@/data/mock";
import { daysUntil, formatDate } from "@/lib/utils";

export default function RecipientDashboardPage() {
  const { donations, reservations, notifications } = useApp();

  const available = donations.filter((item) => item.status === "available" && item.availableQty > 0);
  const mine = reservations.filter((item) => item.recipientName === currentRecipient.organization);
  const pending = mine.filter((item) => ["provisional", "awaiting"].includes(item.status));
  const active = mine.filter((item) => ["confirmed", "in-progress"].includes(item.status));
  const completed = mine.filter((item) => item.status === "completed");
  const received = completed.reduce((sum, item) => sum + (item.collectedQty ?? item.quantity), 0);
  const unread = notifications.filter((item) => item.audience === "recipient" && !item.read).length;

  const recommended = [...available]
    .sort((a, b) => daysUntil(a.expiresAt) - daysUntil(b.expiresAt))
    .slice(0, 3);

  const upcoming = active.slice(0, 4);

  const categoryCounts = new Map<string, number>();
  completed.forEach((reservation) => {
    const donation = donations.find((item) => item.id === reservation.donationId);
    const category = donation?.category ?? "Other";
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + (reservation.collectedQty ?? reservation.quantity));
  });
  const colors = ["#245C45", "#3B8062", "#6FA88C", "#A3C9B4", "#C9E0D2"];
  const totalCategory = Array.from(categoryCounts.values()).reduce((sum, value) => sum + value, 0) || 1;
  const categoryData = Array.from(categoryCounts.entries()).map(([name, value], index) => ({
    name,
    value: Math.round((value / totalCategory) * 100),
    color: colors[index % colors.length],
  }));

  return (
    <>
      <PageHeader
        title={`Hello, ${currentRecipient.name.split(" ")[0]}`}
        description="Find safely verified food, confirm reservations, and coordinate collections."
        eyebrow={currentRecipient.organization}
        actions={
          <Link href="/recipient/available-food" className={buttonStyles()}>
            <UtensilsCrossed className="h-4 w-4" /> Browse available food
          </Link>
        }
      />

      {pending.length ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F0DFA8] bg-warning/60 p-3">
          <p className="flex items-start gap-2 text-small text-[#7A5A0B]">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0" />
            You have {pending.length} reservation{pending.length === 1 ? "" : "s"} awaiting confirmation. Confirm before the hold expires.
          </p>
          <Link href="/recipient/reservations" className={buttonStyles("primary", "sm")}>Review now</Link>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Available Food" value={available.length} icon={UtensilsCrossed} hint={`${available.reduce((sum, item) => sum + item.availableQty, 0)} kg available`} />
        <StatCard label="Awaiting Confirmation" value={pending.length} icon={CalendarCheck} tone="amber" hint="Provisional holds" />
        <StatCard label="Active Reservations" value={active.length} icon={Package} tone="blue" hint="Confirmed or collecting" />
        <StatCard label="Food Received" value={`${received} kg`} icon={PackageCheck} hint="Confirmed collected only" />
      </div>

      <div className="mt-4">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-h2 text-ink">Recommended for you</h2>
            <p className="text-small text-muted">Available food matched to your urgency and eligibility.</p>
          </div>
          <Link href="/recipient/available-food" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">
            View all food <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recommended.map((donation, index) => (
            <FoodCard
              key={donation.id}
              donation={donation}
              href={`/recipient/food/${donation.id}`}
              action={
                <span className="inline-flex h-9 items-center gap-1 rounded-lg bg-lightgreen px-2.5 text-caption font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {94 - index * 3}% match
                </span>
              }
            />
          ))}
        </div>
        {recommended.length === 0 ? <p className="card p-6 text-center text-small text-muted">No food is available right now. Check back soon.</p> : null}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard
          title="Upcoming Collections"
          description="Confirmed reservations and collection windows"
          action={<Link href="/recipient/collections" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">View collections <ArrowRight className="h-3.5 w-3.5" /></Link>}
          bodyClassName="p-0 md:p-0"
        >
          {upcoming.length ? (
            <ul className="divide-y divide-line">
              {upcoming.map((reservation) => (
                <li key={reservation.id} className="flex flex-wrap items-start gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lightgreen text-primary"><Package className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label font-semibold text-ink">{reservation.foodName}</p>
                    <p className="truncate text-caption text-muted">{reservation.donorName} · {reservation.quantity} {reservation.unit}</p>
                    <p className="mt-1 flex items-center gap-1 text-caption text-muted">
                      <CalendarCheck className="h-3.5 w-3.5" /> {reservation.collectionDate ? formatDate(reservation.collectionDate) : "To be coordinated"} · {reservation.collectionWindow}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-caption text-muted"><MapPin className="h-3.5 w-3.5" /> {reservation.address}</p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center">
              <p className="text-small text-muted">No confirmed collections yet.</p>
              <Link href="/recipient/available-food" className={buttonStyles("outline", "sm", "mt-3")}>Find food</Link>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Food Received" description="Share of collected food by category">
          {categoryData.length ? (
            <DonutChart data={categoryData} centerValue={`${received}`} centerLabel="kg received" />
          ) : (
            <p className="text-small text-muted">Your category breakdown will appear after your first completed collection.</p>
          )}
          <div className="mt-4">
            <ProgressBar label="Monthly collection goal" value={received} max={50} color="#3B8062" />
            <p className="mt-2 text-caption text-muted">{received} of 50 kg collected this month · {completed.length} completed collection{completed.length === 1 ? "" : "s"}</p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Quick Actions">
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/recipient/available-food" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><UtensilsCrossed className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Browse food</span><span className="block text-caption text-muted">See verified donations nearby</span></span>
            </Link>
            <Link href="/recipient/reservations" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning text-[#7A5A0B]"><CalendarCheck className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Confirm holds</span><span className="block text-caption text-muted">{pending.length} awaiting confirmation</span></span>
            </Link>
            <Link href="/recipient/collections" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-info text-[#23548C]"><Package className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Manage collections</span><span className="block text-caption text-muted">Confirm collected quantities</span></span>
            </Link>
            <Link href="/recipient/history" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><PackageCheck className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Collection history</span><span className="block text-caption text-muted">Review your received food</span></span>
            </Link>
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-page p-3">
            <Users className="h-4 w-4 text-secondary" />
            <p className="text-caption text-muted">Serving approximately <strong className="text-ink">{Math.round(received * 3)}</strong> meals from confirmed collections.</p>
          </div>
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Matches, reservations, and collection reminders"
          action={<Link href="/recipient/notifications" className="text-caption font-semibold text-primary hover:underline">View all{unread ? ` (${unread})` : ""}</Link>}
          bodyClassName="p-0 md:p-0"
        >
          <ul className="divide-y divide-line">
            {notifications.filter((item) => item.audience === "recipient").slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-start gap-3 p-4">
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-line" : "bg-secondary"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label font-medium text-ink">{item.title}</p>
                  <p className="line-clamp-2 text-caption text-muted">{item.message}</p>
                </div>
                <span className="shrink-0 text-caption text-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  );
}
