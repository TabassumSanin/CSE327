"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  Download,
  HeartHandshake,
  Package,
  Plus,
  Users,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChart, DonutChart } from "@/components/ui/charts";
import { StatusBadge } from "@/components/ui/badge";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TableWrap, Th, Td, Tr, Avatar } from "@/components/ui/table";
import { categoryDistribution, monthlyData, weeklyData } from "@/data/mock";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { donations, users, activities, notify } = useApp();
  const [range, setRange] = useState("6m");
  const [search, setSearch] = useState("");
  const [chartView, setChartView] = useState<"area" | "week">("area");

  const pending = donations.filter((item) => item.status === "pending-review").length;
  const completed = donations.filter((item) => item.status === "completed").length;
  const recent = donations
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);
  const recentUsers = [...users].sort((a, b) => b.joinedAt.localeCompare(a.joinedAt)).slice(0, 4);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Monitor users, donations, and platform health at a glance."
        actions={
          <>
            <Select value={range} onChange={(event) => setRange(event.target.value)} className="w-auto" aria-label="Date range">
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">This year</option>
            </Select>
            <Button variant="outline" onClick={() => notify(`Exported dashboard snapshot for ${range}.`)}>
              <Download className="h-4 w-4" /> Export
            </Button>
            <Link href="/admin/food-reviews" className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-btn text-white transition hover:bg-[#1d4c39]">
              <ClipboardCheck className="h-4 w-4" /> Review food
            </Link>
          </>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} change={{ value: "12%" }} icon={Users} />
        <StatCard label="Total Donations" value={donations.length} change={{ value: "8%" }} icon={HeartHandshake} tone="blue" />
        <StatCard label="Pending Reviews" value={pending} icon={ClipboardCheck} tone="amber" hint="Needs administrator review" />
        <StatCard label="Completed Donations" value={completed} change={{ value: "4%" }} icon={Package} tone="green" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Donation Analytics"
          description={chartView === "area" ? "Donations and redistribution over the last 6 months" : "Donations this week"}
          action={
            <div className="flex rounded-lg border border-line p-0.5">
              <button
                type="button"
                onClick={() => setChartView("area")}
                className={`rounded-md px-2.5 py-1 text-caption font-medium ${chartView === "area" ? "bg-primary text-white" : "text-muted"}`}
              >
                6 months
              </button>
              <button
                type="button"
                onClick={() => setChartView("week")}
                className={`rounded-md px-2.5 py-1 text-caption font-medium ${chartView === "week" ? "bg-primary text-white" : "text-muted"}`}
              >
                This week
              </button>
            </div>
          }
        >
          {chartView === "area" ? (
            <>
              <div className="mb-4 flex flex-wrap gap-4 text-caption text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Donations</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#A3C9B4]" /> Redistributed</span>
              </div>
              <AreaChart data={monthlyData.map((item) => ({ label: item.month, value: item.donations }))} />
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 sm:grid-cols-3">
                <div>
                  <p className="text-caption text-muted">Monthly average</p>
                  <p className="text-h3 text-ink">547 donations</p>
                </div>
                <div>
                  <p className="text-caption text-muted">Redistributed total</p>
                  <p className="text-h3 text-ink">2,650 kg</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-caption text-muted">Success rate</p>
                  <p className="text-h3 text-ink">87%</p>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-7 items-end gap-2" style={{ height: 220 }}>
              {weeklyData.map((item) => (
                <div key={item.day} className="flex h-full flex-col items-center justify-end gap-1.5">
                  <span className="text-caption font-semibold text-ink">{item.value}</span>
                  <div
                    className="w-full max-w-[34px] rounded-t-lg bg-primary transition hover:bg-secondary"
                    style={{ height: `${(item.value / 40) * 100}%` }}
                  />
                  <span className="text-caption text-muted">{item.day}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Food Category Distribution" description="Share of donations by category">
          <DonutChart data={categoryDistribution} centerValue="100%" centerLabel="of donations" />
          <div className="mt-4 rounded-xl bg-page p-3 text-caption text-muted">
            Prepared food remains the largest category. Review flagged prepared items carefully before matching.
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title="Recent Donations"
          action={
            <Link href="/admin/donations" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-0 md:p-0"
        >
          <div className="border-b border-line p-3 md:p-4">
            <SearchField value={search} onChange={setSearch} placeholder="Search recent donations..." ariaLabel="Search recent donations" />
          </div>
          <div className="hidden md:block">
            <TableWrap className="rounded-none border-0">
              <thead>
                <tr>
                  <Th>Donation</Th>
                  <Th>Donor</Th>
                  <Th>Category</Th>
                  <Th>Qty</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {recent.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <p className="font-medium text-ink">{item.name}</p>
                      <p className="text-caption text-muted">{item.id}</p>
                    </Td>
                    <Td>{item.donor.organization}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.quantity} {item.unit}</Td>
                    <Td><StatusBadge status={item.status} /></Td>
                    <Td className="text-caption text-muted">{formatDate(item.createdAt)}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </div>
          <div className="divide-y divide-line md:hidden">
            {recent.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-label font-semibold text-ink">{item.name}</p>
                    <p className="text-caption text-muted">{item.donor.organization} · {item.id}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-2 flex items-center justify-between text-caption text-muted">
                  <span>{item.category}</span>
                  <span>{item.quantity} {item.unit}</span>
                </div>
              </div>
            ))}
          </div>
          {recent.length === 0 ? <p className="p-6 text-center text-small text-muted">No donations match your search.</p> : null}
        </SectionCard>

        <SectionCard
          title="Recent User Registrations"
          action={
            <Link href="/admin/users" className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-0 md:p-0"
        >
          <ul className="divide-y divide-line">
            {recentUsers.map((user) => (
              <li key={user.id} className="flex items-center gap-3 p-4">
                <Avatar name={user.name} color={user.avatarColor} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-label font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-caption text-muted">{user.organization ?? user.accountType} · {formatDate(user.joinedAt)}</p>
                </div>
                <StatusBadge status={user.status} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <SectionCard title="Quick Actions">
          <div className="grid gap-2">
            <Link href="/admin/approvals" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-warning text-[#7A5A0B]"><Users className="h-4 w-4" /></span>
              <span className="flex-1">
                <span className="block text-label font-semibold text-ink">Account approvals</span>
                <span className="block text-caption text-muted">Review pending recipient applications</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
            <Link href="/admin/food-reviews" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><ClipboardCheck className="h-4 w-4" /></span>
              <span className="flex-1">
                <span className="block text-label font-semibold text-ink">Food reviews</span>
                <span className="block text-caption text-muted">Approve or reject flagged food</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
            <Link href="/admin/reports" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-info text-[#23548C]"><Activity className="h-4 w-4" /></span>
              <span className="flex-1">
                <span className="block text-label font-semibold text-ink">Impact reports</span>
                <span className="block text-caption text-muted">Download redistribution analytics</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
            <Link href="/admin/donations" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-secondary hover:bg-lightgreen/40">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-lightgreen text-primary"><Plus className="h-4 w-4" /></span>
              <span className="flex-1">
                <span className="block text-label font-semibold text-ink">Manage donations</span>
                <span className="block text-caption text-muted">Edit quantities and statuses</span>
              </span>
              <ArrowRight className="h-4 w-4 text-muted" />
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Recent Platform Activity" description="Latest actions across the exchange">
          <ol className="space-y-4">
            {activities.slice(0, 6).map((item) => (
              <li key={item.id} className="flex gap-3">
                <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lightgreen text-primary">
                  {item.kind === "donation" ? <HeartHandshake className="h-4 w-4" /> : item.kind === "user" ? <Users className="h-4 w-4" /> : item.kind === "review" ? <ClipboardCheck className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-label font-medium text-ink">{item.title}</p>
                  <p className="text-caption text-muted">{item.message}</p>
                </div>
                <span className="shrink-0 text-caption text-muted">{item.time}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>
    </>
  );
}
