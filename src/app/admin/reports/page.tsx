"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  CalendarRange,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  HeartHandshake,
  PackageCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { AreaChart, BarChart, DonutChart, ProgressBar } from "@/components/ui/charts";
import { Select, Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  categoryDistribution as seedCategory,
  donationStatusData as seedStatus,
  matchStats,
  monthlyData,
  recipientActivity,
} from "@/data/mock";
import { formatDate } from "@/lib/utils";

export default function AdminReportsPage() {
  const { donations, reservations, users, notify } = useApp();
  const [preset, setPreset] = useState("6m");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [exportOpen, setExportOpen] = useState(false);
  const [format, setFormat] = useState("csv");
  const [includeDonations, setIncludeDonations] = useState(true);
  const [includeReservations, setIncludeReservations] = useState(true);
  const [includeRecipients, setIncludeRecipients] = useState(false);

  const filteredDonations = useMemo(() => {
    return donations.filter((item) => {
      const date = item.createdAt.slice(0, 10);
      if (fromDate && date < fromDate) return false;
      if (toDate && date > toDate) return false;
      return true;
    });
  }, [donations, fromDate, toDate]);

  const redistributed = filteredDonations.reduce((sum, item) => sum + item.collectedQty, 0);
  const completedReservations = reservations.filter((item) => item.status === "completed");
  const activeDonors = users.filter((user) => user.role === "donor" && user.status === "active").length;
  const activeRecipients = users.filter((user) => user.role === "recipient" && user.status === "active").length;
  const successRate = reservations.length
    ? Math.round((completedReservations.length / reservations.length) * 100)
    : 0;

  const categoryData = useMemo(() => {
    const colors = seedCategory.map((item) => item.color);
    const grouped = new Map<string, number>();
    filteredDonations.forEach((item) => {
      grouped.set(item.category, (grouped.get(item.category) ?? 0) + 1);
    });
    const total = filteredDonations.length || 1;
    return Array.from(grouped.entries()).map(([name, count], index) => ({
      name,
      value: Math.round((count / total) * 100),
      color: colors[index % colors.length],
    }));
  }, [filteredDonations]);

  const statusData = useMemo(() => {
    const grouped = new Map<string, number>();
    filteredDonations.forEach((item) => {
      const key = ["available", "reserved", "completed"].includes(item.status) ? item.status : "Other";
      grouped.set(key, (grouped.get(key) ?? 0) + 1);
    });
    const colors: Record<string, string> = {
      available: "#245C45",
      reserved: "#3B8062",
      completed: "#A3C9B4",
      Other: "#DDE5DF",
    };
    const total = filteredDonations.length || 1;
    return Array.from(grouped.entries()).map(([name, count]) => ({
      name: name === "Other" ? "Other" : name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.round((count / total) * 100),
      color: colors[name] ?? "#DDE5DF",
    }));
  }, [filteredDonations]);

  const rangeLabel =
    fromDate || toDate
      ? `${fromDate ? formatDate(fromDate) : "Start"} – ${toDate ? formatDate(toDate) : "Today"}`
      : preset === "7d"
      ? "Last 7 days"
      : preset === "30d"
      ? "Last 30 days"
      : preset === "1y"
      ? "This year"
      : "Last 6 months";

  const exportReport = () => {
    const rows: string[] = [];
    if (includeDonations) {
      rows.push("Type,ID,Food/Name,Category/Status,Donor/Recipient,Quantity,Date");
      filteredDonations.forEach((item) => {
        rows.push(
          [
            "Donation",
            item.id,
            `"${item.name}"`,
            item.category,
            `"${item.donor.organization ?? item.donor.name}"`,
            `${item.quantity} ${item.unit}`,
            item.createdAt.slice(0, 10),
          ].join(",")
        );
      });
    }
    if (includeReservations) {
      if (rows.length === 0) rows.push("Type,ID,Food/Name,Category/Status,Donor/Recipient,Quantity,Date");
      reservations.forEach((item) => {
        rows.push(
          [
            "Reservation",
            item.id,
            `"${item.foodName}"`,
            item.status,
            `"${item.recipientName}"`,
            `${item.quantity} ${item.unit}`,
            item.createdAt.slice(0, 10),
          ].join(",")
        );
      });
    }
    if (includeRecipients) {
      if (rows.length === 0) rows.push("Type,ID,Food/Name,Category/Status,Donor/Recipient,Quantity,Date");
      users
        .filter((user) => user.role === "recipient")
        .forEach((user) => {
          rows.push(["Recipient", user.id, `"${user.name}"`, user.status, `"${user.location}"`, "", user.joinedAt].join(","));
        });
    }
    const content = format === "json" ? JSON.stringify({ generatedAt: new Date().toISOString(), label: rangeLabel, csv: rows }, null, 2) : rows.join("\n");
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `smart-food-exchange-report.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
    notify(`Report exported as ${format.toUpperCase()} for ${rangeLabel}.`);
  };

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        description="Measure verified redistribution, matching performance, and recipient activity."
        actions={
          <Button onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4" /> Export Report
          </Button>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Total Donations" value={filteredDonations.length} icon={HeartHandshake} />
        <StatCard label="Food Redistributed" value={`${redistributed} kg`} icon={PackageCheck} hint="Confirmed collected only" />
        <StatCard label="Successful Matches" value={completedReservations.length} icon={CheckCircle2} tone="blue" />
        <StatCard label="Active Donors" value={activeDonors} icon={Building2} tone="amber" />
        <StatCard label="Active Recipients" value={activeRecipients} icon={Users} />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2 text-label font-medium text-ink">
            <CalendarRange className="h-4 w-4 text-secondary" /> Date range
          </div>
          <Select value={preset} onChange={(event) => { setPreset(event.target.value); setFromDate(""); setToDate(""); }} className="w-auto" aria-label="Date range preset">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">This year</option>
          </Select>
          <Field label="From" htmlFor="from-date" className="w-full sm:w-auto">
            <Input id="from-date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} />
          </Field>
          <Field label="To" htmlFor="to-date" className="w-full sm:w-auto">
            <Input id="to-date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} />
          </Field>
          <p className="pb-2 text-caption text-muted">Showing: {rangeLabel}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Donation Trends" description="Donations submitted over the last 6 months">
          <div className="mb-3 flex gap-4 text-caption text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> Donations</span>
          </div>
          <AreaChart data={monthlyData.map((item) => ({ label: item.month, value: item.donations }))} height={220} />
          <div className="mt-4 rounded-xl bg-page p-3 text-caption text-muted">
            Donation volume peaks in October. Only confirmed collected quantities are counted as redistributed food.
          </div>
        </SectionCard>

        <SectionCard title="Monthly Redistribution" description="Donations vs redistributed food (kg)">
          <BarChart data={monthlyData.map((item) => ({ label: item.month, value: item.redistributed, secondary: item.donations }))} height={220} valueLabel="kg" />
          <div className="mt-4 flex gap-4 text-caption text-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Redistributed</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[#C9E0D2]" /> Donated</span>
          </div>
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <SectionCard title="Food Category Distribution" description="Donation share by category">
          <DonutChart data={categoryData.length ? categoryData : seedCategory} centerValue={`${filteredDonations.length}`} centerLabel="donations" />
        </SectionCard>
        <SectionCard title="Donation Status Breakdown" description="Current status of donations in range">
          <DonutChart data={statusData.length ? statusData : seedStatus} centerValue={`${successRate}%`} centerLabel="completion rate" />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Recipient Activity" description="Verified food received by active recipients">
          <ul className="space-y-4">
            {recipientActivity.map((recipient) => (
              <li key={recipient.name}>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <p className="text-small font-medium text-ink">{recipient.name}</p>
                  <p className="text-caption text-muted">{recipient.meals.toLocaleString()} meals</p>
                </div>
                <ProgressBar value={recipient.value} showValue={false} color="#3B8062" />
                <p className="mt-1 text-caption text-muted">{recipient.value}% of their requested food was fulfilled</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Successful Matching" description="AI matching performance indicators">
          <div className="grid grid-cols-2 gap-3">
            {matchStats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-line bg-page p-3">
                <p className="text-[26px] font-bold leading-none text-ink">
                  {stat.value}
                  <span className="ml-0.5 text-small font-medium text-muted">{stat.unit}</span>
                </p>
                <p className="mt-1.5 text-caption text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl bg-lightgreen p-3 text-caption text-muted">
            <p className="flex items-center gap-1.5 font-semibold text-primary"><Sparkles className="h-3.5 w-3.5" /> Matching priorities</p>
            <p className="mt-1">1. Recipient urgency · 2. Eligibility · 3. Match score · 4. Available quantity</p>
          </div>
        </SectionCard>
      </div>

      <SectionCard className="mt-4" title="Report Summary" description="Key metrics for the selected range">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Donations in range", `${filteredDonations.length}`],
            ["Available now", `${filteredDonations.filter((item) => item.status === "available").length}`],
            ["Reservations completed", `${completedReservations.length}`],
            ["Food redistributed", `${redistributed} kg`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-line p-3">
              <p className="text-caption text-muted">{label}</p>
              <p className="mt-1 text-h3 text-ink">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="flex items-center gap-1.5 text-caption text-muted">
            <BarChart3 className="h-4 w-4 text-secondary" /> Generated from mock platform data · {rangeLabel}
          </p>
          <Button variant="outline" onClick={() => setExportOpen(true)}>
            <FileSpreadsheet className="h-4 w-4" /> Export this report
          </Button>
        </div>
      </SectionCard>

      <Modal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        title="Export report"
        description={`Generate a report for ${rangeLabel}.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setExportOpen(false)}>Cancel</Button>
            <Button onClick={exportReport} disabled={!includeDonations && !includeReservations && !includeRecipients}>
              <Download className="h-4 w-4" /> Generate report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="File format" htmlFor="export-format">
            <Select id="export-format" value={format} onChange={(event) => setFormat(event.target.value)}>
              <option value="csv">CSV spreadsheet</option>
              <option value="json">JSON data</option>
            </Select>
          </Field>
          <div>
            <p className="label">Include sections</p>
            <div className="space-y-2">
              {[
                { label: "Donation records", checked: includeDonations, set: setIncludeDonations },
                { label: "Reservation records", checked: includeReservations, set: setIncludeReservations },
                { label: "Recipient accounts", checked: includeRecipients, set: setIncludeRecipients },
              ].map((option) => (
                <label key={option.label} className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-small text-ink">
                  <input
                    type="checkbox"
                    checked={option.checked}
                    onChange={(event) => option.set(event.target.checked)}
                    className="h-4 w-4 rounded accent-[#245C45]"
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-page p-3 text-caption text-muted">
            Export includes only the selected date range and does not include personal documents.
            Redistribution totals represent confirmed collected quantities only.
          </div>
        </div>
      </Modal>
    </>
  );
}
