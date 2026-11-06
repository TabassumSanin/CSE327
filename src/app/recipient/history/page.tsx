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
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { DonutChart } from "@/components/ui/charts";
import { TableWrap, Th, Td, Tr } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { currentRecipient } from "@/data/mock";
import { formatDate } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  date: string;
  food: string;
  donor: string;
  quantity: string;
  collected: string;
  status: string;
  category: string;
}

export default function RecipientHistoryPage() {
  const { donations, reservations, notify } = useApp();
  const [search, setSearch] = useState("");
  const [outcome, setOutcome] = useState("all");
  const [year, setYear] = useState("all");

  const mine = reservations.filter((item) => item.recipientName === currentRecipient.organization);
  const closed = mine.filter((item) => ["completed", "declined", "expired", "cancelled"].includes(item.status));

  const entries: HistoryEntry[] = useMemo(
    () =>
      closed.map((item) => {
        const donation = donations.find((entry) => entry.id === item.donationId);
        return {
          id: item.id,
          date: item.collectionDate ?? item.createdAt,
          food: item.foodName,
          donor: item.donorName,
          quantity: `${item.quantity} ${item.unit}`,
          collected: item.collectedQty ? `${item.collectedQty} ${item.unit}` : "—",
          status: item.status,
          category: donation?.category ?? "Other",
        };
      }),
    [closed, donations]
  );

  const years = Array.from(new Set(entries.map((item) => item.date.slice(0, 4)))).sort().reverse();

  const filtered = entries
    .filter((item) => (outcome === "all" ? true : item.status === outcome))
    .filter((item) => (year === "all" ? true : item.date.startsWith(year)))
    .filter((item) => {
      if (!search) return true;
      return `${item.id} ${item.food} ${item.donor} ${item.category}`.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const completed = mine.filter((item) => item.status === "completed");
  const received = completed.reduce((sum, item) => sum + (item.collectedQty ?? item.quantity), 0);
  const donors = new Set(completed.map((item) => item.donorName));
  const meals = Math.round(received * 3);

  const outcomes = [
    { name: "Completed", value: closed.filter((item) => item.status === "completed").length, color: "#245C45" },
    { name: "Declined", value: closed.filter((item) => item.status === "declined").length, color: "#D9A39E" },
    { name: "Expired", value: closed.filter((item) => item.status === "expired").length, color: "#A3C9B4" },
    { name: "Cancelled", value: closed.filter((item) => item.status === "cancelled").length, color: "#DDE5DF" },
  ].filter((item) => item.value > 0);
  const totalOutcomes = outcomes.reduce((sum, item) => sum + item.value, 0) || 1;

  const exportHistory = () => {
    const rows = [
      "Reference,Date,Food,Donor,Category,Reserved,Collected,Outcome",
      ...filtered.map((item) =>
        [item.id, item.date.slice(0, 10), `"${item.food}"`, `"${item.donor}"`, item.category, item.quantity, item.collected, item.status].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "collection-history.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify(`Exported ${filtered.length} collection records.`);
  };

  const reset = () => { setSearch(""); setOutcome("all"); setYear("all"); };

  return (
    <>
      <PageHeader
        title="Collection History"
        description="Review completed collections, declined holds, and the verified food you have received."
        actions={<Button variant="outline" onClick={exportHistory}><ArrowDownToLine className="h-4 w-4" /> Export history</Button>}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Food Received" value={`${received} kg`} icon={PackageCheck} hint="Confirmed collected only" />
        <StatCard label="Meals Provided" value={meals.toLocaleString()} icon={UtensilsCrossed} tone="blue" hint="Estimated at 3 meals per kg" />
        <StatCard label="Donors Supported" value={donors.size} icon={HeartHandshake} tone="amber" />
        <StatCard label="Closed Records" value={entries.length} icon={History} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.6fr]">
        <SectionCard title="Reservation Outcomes" description="How your closed reservations ended">
          <DonutChart
            data={outcomes.length ? outcomes.map((item) => ({ ...item, value: Math.round((item.value / totalOutcomes) * 100) })) : [{ name: "No records", value: 100, color: "#E7F2EB" }]}
            centerValue={`${completed.length}`}
            centerLabel="collections"
          />
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-lightgreen p-3 text-caption text-muted">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            Declined and expired reservations release food back for other eligible recipients.
          </div>
        </SectionCard>

        <SectionCard title="History Records" description="Filter and export your collection history" bodyClassName="p-0 md:p-0">
          <div className="flex flex-col gap-2 border-b border-line p-3 sm:flex-row md:p-4">
            <SearchField value={search} onChange={setSearch} placeholder="Search by food, donor, or reference..." className="flex-1" ariaLabel="Search collection history" />
            <Select value={outcome} onChange={(event) => setOutcome(event.target.value)} className="sm:w-40" aria-label="Filter by outcome">
              <option value="all">All outcomes</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select value={year} onChange={(event) => setYear(event.target.value)} className="sm:w-32" aria-label="Filter by year">
              <option value="all">All years</option>
              {years.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
            <Button variant="outline" onClick={reset}>Reset</Button>
          </div>

          {filtered.length ? (
            <>
              <div className="hidden md:block">
                <TableWrap className="rounded-none border-0">
                  <thead>
                    <tr>
                      <Th>Date</Th>
                      <Th>Food & Donor</Th>
                      <Th>Reserved</Th>
                      <Th>Collected</Th>
                      <Th>Outcome</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => (
                      <Tr key={item.id}>
                        <Td className="whitespace-nowrap text-caption text-muted">
                          <p>{formatDate(item.date)}</p>
                          <p className="text-caption text-muted">{item.id}</p>
                        </Td>
                        <Td>
                          <p className="font-medium text-ink">{item.food}</p>
                          <p className="text-caption text-muted">{item.donor} · {item.category}</p>
                        </Td>
                        <Td>{item.quantity}</Td>
                        <Td className={item.collected === "—" ? "text-muted" : "font-semibold text-primary"}>{item.collected}</Td>
                        <Td><StatusBadge status={item.status} /></Td>
                      </Tr>
                    ))}
                  </tbody>
                </TableWrap>
              </div>
              <ul className="divide-y divide-line md:hidden">
                {filtered.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-label font-semibold text-ink">{item.food}</p>
                        <p className="truncate text-caption text-muted">{item.donor}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-caption text-muted">
                      <span>{item.id} · {formatDate(item.date)}</span>
                      <span>Collected: {item.collected}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="p-4">
              <EmptyState
                icon={SearchX}
                title="No history records match"
                description="Completed, declined, and expired reservations appear here after they close."
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

      <SectionCard className="mt-4" title="Impact Summary">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-line p-3">
            <p className="text-caption text-muted">Completed collections</p>
            <p className="mt-1 text-h3 text-ink">{completed.length}</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-caption text-muted">Verified food received</p>
            <p className="mt-1 text-h3 text-ink">{received} kg</p>
          </div>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-lightgreen p-3">
            <div>
              <p className="text-caption text-muted">Estimated meals served</p>
              <p className="mt-1 text-h3 text-primary">{meals.toLocaleString()}</p>
            </div>
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
      </SectionCard>
    </>
  );
}
