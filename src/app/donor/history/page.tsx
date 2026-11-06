"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  HeartHandshake,
  History,
  PackageCheck,
  SearchX,
  Users,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DonutChart } from "@/components/ui/charts";
import { TableWrap, Th, Td, Tr } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { currentDonor } from "@/data/mock";
import { formatDate } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  quantity: string;
  status: string;
  kind: "Donation" | "Reservation";
}

export default function DonorHistoryPage() {
  const { donations, reservations, notify } = useApp();
  const [type, setType] = useState("all");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  const myDonations = donations.filter((item) => item.donor.id === currentDonor.id);
  const myDonationIds = new Set(myDonations.map((item) => item.id));
  const myReservations = reservations.filter((item) => myDonationIds.has(item.donationId));

  const closedDonations = myDonations.filter((item) =>
    ["completed", "cancelled", "rejected", "expired"].includes(item.status)
  );
  const closedReservations = myReservations.filter((item) =>
    ["completed", "declined", "expired", "cancelled"].includes(item.status)
  );

  const entries: HistoryEntry[] = useMemo(
    () => [
      ...closedDonations.map((item) => ({
        id: item.id,
        date: item.createdAt,
        title: item.name,
        subtitle: `${item.category} · ${item.donor.organization ?? item.donor.name}`,
        quantity: `${item.collectedQty || item.quantity} ${item.unit}`,
        status: item.status,
        kind: "Donation" as const,
      })),
      ...closedReservations.map((item) => ({
        id: item.id,
        date: item.collectionDate ?? item.createdAt,
        title: item.foodName,
        subtitle: `${item.recipientName} · ${item.donationId}`,
        quantity: `${item.collectedQty ?? item.quantity} ${item.unit}`,
        status: item.status,
        kind: "Reservation" as const,
      })),
    ],
    [closedDonations, closedReservations]
  );

  const years = Array.from(new Set(entries.map((item) => item.date.slice(0, 4)))).sort().reverse();

  const filtered = entries
    .filter((item) => type === "all" || item.kind.toLowerCase() === type)
    .filter((item) => year === "all" || item.date.startsWith(year))
    .filter((item) => {
      if (!search) return true;
      return `${item.id} ${item.title} ${item.subtitle}`.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const redistributed = myDonations.reduce((sum, item) => sum + item.collectedQty, 0);
  const recipients = new Set(myReservations.filter((item) => item.status === "completed").map((item) => item.recipientName));
  const meals = Math.round(redistributed * 3);

  const outcomeData = [
    { name: "Completed", value: closedDonations.filter((item) => item.status === "completed").length, color: "#245C45" },
    { name: "Expired", value: closedDonations.filter((item) => item.status === "expired").length, color: "#A3C9B4" },
    { name: "Rejected", value: closedDonations.filter((item) => item.status === "rejected").length, color: "#D9A39E" },
    { name: "Cancelled", value: closedDonations.filter((item) => item.status === "cancelled").length, color: "#DDE5DF" },
  ].filter((item) => item.value > 0);
  const totalOutcomes = outcomeData.reduce((sum, item) => sum + item.value, 0) || 1;

  const exportHistory = () => {
    const rows = [
      "Type,Reference,Date,Item,Recipient/Details,Quantity,Outcome",
      ...filtered.map((item) =>
        [item.kind, item.id, item.date.slice(0, 10), `"${item.title}"`, `"${item.subtitle}"`, item.quantity, item.status].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "donation-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify(`Exported ${filtered.length} history records.`);
  };

  const reset = () => { setType("all"); setSearch(""); setYear("all"); };

  return (
    <>
      <PageHeader
        title="Donation History"
        description="Review completed, declined, and expired donations along with your verified impact."
        actions={<Button variant="outline" onClick={exportHistory}><ArrowDownToLine className="h-4 w-4" /> Export history</Button>}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Food Redistributed" value={`${redistributed} kg`} icon={PackageCheck} hint="Confirmed collected only" />
        <StatCard label="Meals Provided" value={meals.toLocaleString()} icon={HeartHandshake} tone="blue" hint="Estimated at 3 meals per kg" />
        <StatCard label="Recipients Served" value={recipients.size} icon={Users} tone="amber" />
        <StatCard label="Closed Records" value={entries.length} icon={History} hint="Donations and reservations" />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <SectionCard title="Donation Outcomes" description="How your closed donations ended">
          <DonutChart
            data={outcomeData.length ? outcomeData.map((item) => ({ ...item, value: Math.round((item.value / totalOutcomes) * 100) })) : [{ name: "No records", value: 100, color: "#E7F2EB" }]}
            centerValue={`${closedDonations.filter((item) => item.status === "completed").length}`}
            centerLabel="completed"
          />
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-lightgreen p-3 text-caption text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Expired and rejected donations never count as redistributed food.
          </div>
        </SectionCard>

        <SectionCard title="History Records" description="Filter and export your closed activity" bodyClassName="p-0 md:p-0">
          <div className="space-y-3 border-b border-line p-3 md:p-4">
            <Tabs
              options={[
                { value: "all", label: "All records", count: entries.length },
                { value: "donation", label: "Donations", count: closedDonations.length },
                { value: "reservation", label: "Reservations", count: closedReservations.length },
              ]}
              value={type}
              onChange={setType}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchField value={search} onChange={setSearch} placeholder="Search history..." className="flex-1" ariaLabel="Search history" />
              <Select value={year} onChange={(event) => setYear(event.target.value)} className="sm:w-36" aria-label="Filter by year">
                <option value="all">All years</option>
                {years.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
              <Button variant="outline" onClick={reset}>Reset</Button>
            </div>
          </div>

          {filtered.length ? (
            <>
              <div className="hidden md:block">
                <TableWrap className="rounded-none border-0">
                  <thead>
                    <tr>
                      <Th>Date</Th>
                      <Th>Type</Th>
                      <Th>Item</Th>
                      <Th>Recipient / Details</Th>
                      <Th>Quantity</Th>
                      <Th>Outcome</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <Tr key={`${item.kind}-${item.id}`}>
                        <Td className="whitespace-nowrap text-caption text-muted">{formatDate(item.date)}</Td>
                        <Td><span className="rounded-full bg-page px-2 py-0.5 text-caption text-muted">{item.kind}</span></Td>
                        <Td>
                          <p className="font-medium text-ink">{item.title}</p>
                          <p className="text-caption text-muted">{item.id}</p>
                        </Td>
                        <Td className="text-caption text-muted">{item.subtitle}</Td>
                        <Td>{item.quantity}</Td>
                        <Td><StatusBadge status={item.status} /></Td>
                      </Tr>
                    ))}
                  </tbody>
                </TableWrap>
              </div>
              <ul className="divide-y divide-line md:hidden">
                {filtered.map((item) => (
                  <li key={`${item.kind}-${item.id}`} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-label font-semibold text-ink">{item.title}</p>
                        <p className="truncate text-caption text-muted">{item.subtitle}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-caption text-muted">
                      <span>{item.kind} · {item.id}</span>
                      <span>{formatDate(item.date)}</span>
                    </div>
                    <p className="mt-1 text-caption text-muted">Quantity: {item.quantity}</p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={SearchX}
                title="No history records match"
                description="Closed donations and reservations will appear here after they are completed, declined, or expired."
                action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-3 md:p-4">
            <p className="flex items-center gap-1.5 text-caption text-muted"><CalendarDays className="h-3.5 w-3.5" /> {filtered.length} matching record{filtered.length === 1 ? "" : "s"}</p>
            <Button size="sm" variant="outline" onClick={exportHistory}><ArrowDownToLine className="h-3.5 w-3.5" /> Export these records</Button>
          </div>
        </SectionCard>
      </div>
    </>
  );
}
