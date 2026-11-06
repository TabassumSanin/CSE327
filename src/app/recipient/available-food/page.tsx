"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Filter,
  Leaf,
  PackageCheck,
  SearchX,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select, Field, Input } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FoodCard } from "@/components/ui/food-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Modal } from "@/components/ui/modal";
import { daysUntil } from "@/lib/utils";
import type { Donation } from "@/types";

const PAGE_SIZE = 6;
const categories = ["Prepared Food", "Packaged Food", "Produce", "Bakery", "Refrigerated", "Frozen"];

export default function AvailableFoodPage() {
  const { donations, reserveFood } = useApp();
  const router = useRouter();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("expiry");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [expiringOnly, setExpiringOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [reserving, setReserving] = useState<Donation | null>(null);
  const [quantity, setQuantity] = useState("");

  const available = donations.filter((item) => item.status === "available" && item.availableQty > 0);

  const filtered = useMemo(() => {
    const rows = available.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
      if (verifiedOnly && item.verification !== "verified") return false;
      if (expiringOnly && daysUntil(item.expiresAt) > 2) return false;
      if (search) {
        const haystack = `${item.name} ${item.category} ${item.description} ${item.donor.organization ?? item.donor.name} ${item.pickupLocation}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
    return rows.sort((a, b) => {
      if (sort === "quantity") return b.availableQty - a.availableQty;
      if (sort === "newest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "name") return a.name.localeCompare(b.name);
      return daysUntil(a.expiresAt) - daysUntil(b.expiresAt);
    });
  }, [available, category, verifiedOnly, expiringOnly, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const openReserve = (donation: Donation) => {
    setReserving(donation);
    setQuantity(String(Math.min(5, donation.availableQty)));
  };

  const confirmReserve = () => {
    if (!reserving) return;
    const amount = Number(quantity);
    if (!amount || amount <= 0) return;
    const reservation = reserveFood(reserving.id, amount);
    if (reservation) {
      setReserving(null);
      router.push("/recipient/reservations");
    }
  };

  const reset = () => {
    setCategory("all");
    setSearch("");
    setSort("expiry");
    setVerifiedOnly(false);
    setExpiringOnly(false);
    setPage(1);
  };

  const totalAvailable = available.reduce((sum, item) => sum + item.availableQty, 0);
  const expiringSoon = available.filter((item) => daysUntil(item.expiresAt) <= 1).length;
  const verified = available.filter((item) => item.verification === "verified").length;

  return (
    <>
      <PageHeader
        title="Available Food"
        description="Browse safely verified food donations and place a provisional reservation."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-caption text-muted">
            <Sparkles className="h-4 w-4 text-secondary" /> AI matches sorted by urgency and expiry
          </span>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Available Listings" value={available.length} icon={UtensilsCrossed} />
        <StatCard label="Total Available" value={`${totalAvailable} kg`} icon={PackageCheck} tone="blue" />
        <StatCard label="Expiring Soon" value={expiringSoon} icon={CalendarClock} tone="amber" hint="Within 24 hours" />
        <StatCard label="Verified Food" value={verified} icon={CheckCircle2} hint="Passed advisory checks" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="space-y-3">
          <Tabs
            options={[
              { value: "all", label: "All food", count: available.length },
              ...categories.map((item) => ({
                value: item,
                label: item,
                count: available.filter((donation) => donation.category === item).length,
              })),
            ]}
            value={category}
            onChange={(value) => { setCategory(value); setPage(1); }}
          />
          <div className="flex flex-col gap-2 lg:flex-row">
            <SearchField
              value={search}
              onChange={(value) => { setSearch(value); setPage(1); }}
              placeholder="Search food, donor, or pickup area..."
              className="flex-1"
              ariaLabel="Search available food"
            />
            <Select value={sort} onChange={(event) => setSort(event.target.value)} className="lg:w-48" aria-label="Sort available food">
              <option value="expiry">Expiring soonest</option>
              <option value="newest">Newest first</option>
              <option value="quantity">Most available</option>
              <option value="name">Name A–Z</option>
            </Select>
            <Button variant="outline" onClick={reset}><Filter className="h-4 w-4" /> Reset</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-caption text-ink">
              <input type="checkbox" checked={verifiedOnly} onChange={(event) => { setVerifiedOnly(event.target.checked); setPage(1); }} className="h-4 w-4 rounded accent-[#245C45]" />
              Verified only
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-caption text-ink">
              <input type="checkbox" checked={expiringOnly} onChange={(event) => { setExpiringOnly(event.target.checked); setPage(1); }} className="h-4 w-4 rounded accent-[#245C45]" />
              Expiring within 2 days
            </label>
            <p className="text-caption text-muted">{filtered.length} listing{filtered.length === 1 ? "" : "s"} found</p>
          </div>
        </div>
      </div>

      {visible.length ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((donation) => (
              <FoodCard
                key={donation.id}
                donation={donation}
                href={`/recipient/food/${donation.id}`}
                action={<Button size="sm" variant="soft" onClick={() => openReserve(donation)}>Reserve</Button>}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="listings" />
            <p className="flex items-center gap-1.5 text-caption text-muted"><Leaf className="h-3.5 w-3.5 text-secondary" /> Reservations hold quantity until confirmed or expired.</p>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={SearchX}
            title="No available food matches"
            description="Try clearing filters or checking back later. New verified donations appear here automatically."
            action={<Button variant="outline" onClick={reset}>Clear filters</Button>}
          />
        </div>
      )}

      <div className="card mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-label font-semibold text-ink">How matching works</p>
          <p className="text-caption text-muted">Recipients are prioritised by urgency, eligibility, match score, and available quantity.</p>
        </div>
        <p className="rounded-lg bg-lightgreen px-3 py-2 text-caption text-primary">Provisional holds reduce available quantity immediately.</p>
      </div>

      <Modal
        open={Boolean(reserving)}
        onClose={() => setReserving(null)}
        title="Reserve food"
        description={reserving ? `${reserving.name} · ${reserving.donor.organization ?? reserving.donor.name}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setReserving(null)}>Cancel</Button>
            <Button onClick={confirmReserve} disabled={!quantity || Number(quantity) <= 0 || Number(quantity) > (reserving?.availableQty ?? 0)}>
              Create provisional hold
            </Button>
          </>
        }
      >
        {reserving ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-page p-3">
                <p className="text-caption text-muted">Available</p>
                <p className="mt-1 text-h3 text-ink">{reserving.availableQty} {reserving.unit}</p>
              </div>
              <div className="rounded-xl bg-page p-3">
                <p className="text-caption text-muted">Expires</p>
                <p className="mt-1 text-h3 text-ink">{daysUntil(reserving.expiresAt) < 0 ? "Expired" : daysUntil(reserving.expiresAt) === 0 ? "Today" : `${daysUntil(reserving.expiresAt)} days`}</p>
              </div>
            </div>
            <Field label={`Quantity (${reserving.unit})`} htmlFor="reserve-quantity" required hint="The quantity is held for you until you confirm or the hold expires.">
              <Input
                id="reserve-quantity"
                type="number"
                min={1}
                max={reserving.availableQty}
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </Field>
            <div className="flex flex-wrap gap-2">
              {[5, 10, reserving.availableQty].filter((value, index, array) => value > 0 && value <= reserving.availableQty && array.indexOf(value) === index).map((value) => (
                <Button key={value} size="sm" variant="outline" onClick={() => setQuantity(String(value))}>
                  {value === reserving.availableQty ? `Max (${value})` : value}
                </Button>
              ))}
            </div>
            <div className="rounded-xl bg-lightgreen p-3 text-caption text-muted">
              After creating this hold, confirm it from your Reservations page to keep the allocation. Unconfirmed holds expire automatically.
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
