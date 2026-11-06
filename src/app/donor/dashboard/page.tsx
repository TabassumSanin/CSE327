"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardCheck,
  Download,
  HeartHandshake,
  Leaf,
  PackageCheck,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChart, DonutChart } from "@/components/ui/charts";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Avatar } from "@/components/ui/table";
import { currentDonor } from "@/data/mock";
import { daysUntil, formatDate } from "@/lib/utils";

const monthLabels = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function DonorDashboardPage() {
  const { donations, reservations, notifications, notify } = useApp();

  const myDonations = donations.filter((item) => item.donor.id === currentDonor.id);
  const myDonationIds = new Set(myDonations.map((item) => item.id));
  const myReservations = reservations.filter((item) => myDonationIds.has(item.donationId));
  const active = myDonations.filter((item) => item.status === "available" || item.status === "reserved").length;
  const pendingReviews = myDonations.filter((item) => item.status === "pending-review").length;
  const collected = myDonations.reduce((sum, item) => sum + item.collectedQty, 0);
  const meals = Math.round(collected * 3);
  const unread = notifications.filter((item) => item.audience === "donor" && !item.read).length;

  const trend = monthLabels.map((label, index) => ({
    label,
    value: myDonations.filter((item) => new Date(item.createdAt).getMonth() === 5 + index).length,
  }));

  const categoryData = ["Prepared Food", "Produce", "Packaged Food", "Bakery"].map((name, index) => ({
    name,
    value: myDonations.filter((item) => item.category === name).length,
    color: ["#245C45", "#3B8062", "#6FA88C", "#A3C9B4"][index],
  })).filter((item) => item.value > 0);
  const totalCategory = categoryData.reduce((sum, item) => sum + item.value, 0) || 1;

  const recentDonations = myDonations.slice(0, 4);
  const upcoming = myReservations
    .filter((item) => ["provisional", "awaiting", "confirmed", "in-progress"].includes(item.status))
    .slice(0, 4);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${currentDonor.name.split(" ")[0]}`}
        description="Track your food donations, reservations, and verified impact."
        eyebrow={currentDonor.organization}
        actions={
          <>
            <Button variant="outline" onClick={() => notify("Impact summary downloaded for November 2026.")}>
              <Download className="h-4 w-4" /> Impact summary
            </Button>
            <Link href="/donor/add-donation" className={buttonStyles()}>
              <Plus className="h-4 w-4" /> Add donation
            </Link>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active Donations" value={active} icon={HeartHandshake} hint={`${myDonations.length} total donations`} />
        <StatCard label="Pending Review" value={pendingReviews} icon={ClipboardCheck} tone="amber" hint="Awaiting verification" />
        <StatCard label="Food Collected" value={`${collected} kg`} icon={PackageCheck} tone="blue" hint="Confirmed collected only" />
        <StatCard label="Meals Provided" value={meals.toLocaleString()} icon={Users} hint="Estimated from collected food" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Your Donation Activity" description="Donations submitted over the last 6 months">
          <div className="mb-3 flex gap-4 text-caption text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Donations submitted</span>
          </div>
          <AreaChart data={trend} height={210} />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <div>
              <p className="text-caption text-muted">Total donated</p>
              <p className="text-h3 text-ink">{myDonations.reduce((sum, item) => sum + item.quantity, 0)} kg</p>
            </div>
            <div>
              <p className="text-caption text-muted">Redistributed</p>
              <p className="text-h3 text-ink">{collected} kg</p>
            </div>
            <div>
              <p className="text-caption text-muted">Recipients served</p>
              <p className="text-h3 text-ink">{new Set(myReservations.map((item) => item.recipientName)).size}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Donation Mix" description="Share of your donations by category">
          {categoryData.length ? (
            <DonutChart
              data={categoryData.map((item) => ({ ...item, value: Math.round((item.value / totalCategory) * 100) }))}
              centerValue={`${myDonations.length}`}
              centerLabel="donations"
            />
          ) : (
            <p className="text-small text-muted">Add your first donation to see your category mix.</p>
          )}
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-lightgreen p-3 text-caption text-muted">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Prepared food is matched fastest when allergen and temperature details are complete.
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard
          title="Recent Donations"
          description="Your latest food listings"
          action={<Link href="/donor/donations" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}
          bodyClassName="p-0 md:p-0"
        >
          <ul className="divide-y divide-line">
            {recentDonations.map((item) => {
              const days = daysUntil(item.expiresAt);
              return (
                <li key={item.id}>
                  <Link href={`/donor/donations/${item.id}`} className="flex items-center gap-3 p-4 transition hover:bg-[#FAFCFA]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lightgreen text-primary">
                      <Leaf className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-label font-semibold text-ink">{item.name}</p>
                      <p className="truncate text-caption text-muted">
                        {item.id} · {item.availableQty} {item.unit} available · {days < 0 ? "expired" : days === 0 ? "expires today" : `${days} days left`}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </Link>
                </li>
              );
            })}
          </ul>
          {recentDonations.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-small text-muted">You have not created any donations yet.</p>
              <Link href="/donor/add-donation" className={buttonStyles("primary", "sm", "mt-3")}>
                <Plus className="h-3.5 w-3.5" /> Add your first donation
              </Link>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard
          title="Upcoming Reservations"
          description="Recipients collecting your food"
          action={<Link href="/donor/reservations" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">View all <ArrowRight className="h-3.5 w-3.5" /></Link>}
          bodyClassName="p-0 md:p-0"
        >
          <ul className="divide-y divide-line">
            {upcoming.map((item) => (
              <li key={item.id} className="flex items-start gap-3 p-4">
                <Avatar name={item.recipientName} color="#2F6B5A" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label font-semibold text-ink">{item.recipientName}</p>
                  <p className="truncate text-caption text-muted">{item.quantity} {item.unit} of {item.foodName}</p>
                  <p className="mt-1 flex items-center gap-1 text-caption text-muted">
                    <CalendarCheck className="h-3.5 w-3.5" /> {item.collectionDate ? formatDate(item.collectionDate) : item.collectionWindow}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
          {upcoming.length === 0 ? <p className="p-6 text-center text-small text-muted">No active reservations right now.</p> : null}
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Quick Actions">
          <div className="grid gap-2 sm:grid-cols-2">
            <Link href="/donor/add-donation" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><Plus className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">New donation</span><span className="block text-caption text-muted">Share surplus food today</span></span>
            </Link>
            <Link href="/donor/donations" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-info text-[#23548C]"><HeartHandshake className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Manage donations</span><span className="block text-caption text-muted">Edit or cancel listings</span></span>
            </Link>
            <Link href="/donor/reservations" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning text-[#7A5A0B]"><CalendarCheck className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Reservations</span><span className="block text-caption text-muted">Confirm pending requests</span></span>
            </Link>
            <Link href="/donor/history" className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><PackageCheck className="h-4 w-4" /></span>
              <span><span className="block text-label font-semibold text-ink">Donation history</span><span className="block text-caption text-muted">Review your impact</span></span>
            </Link>
          </div>
        </SectionCard>

        <SectionCard
          title="Notifications"
          description="Updates about your donations"
          action={<Link href="/donor/notifications" className="text-caption font-semibold text-primary hover:underline">View all{unread ? ` (${unread})` : ""}</Link>}
          bodyClassName="p-0 md:p-0"
        >
          <ul className="divide-y divide-line">
            {notifications.filter((item) => item.audience === "donor").slice(0, 4).map((item) => (
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
