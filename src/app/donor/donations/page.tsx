"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HeartHandshake, PackageCheck, Plus, SearchX, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Tabs } from "@/components/ui/tabs";
import { Button, buttonStyles } from "@/components/ui/button";
import { FoodCard } from "@/components/ui/food-card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { currentDonor } from "@/data/mock";

const statusOptions = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "pending-review", label: "Pending Review" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "expired", label: "Expired" },
];

const PAGE_SIZE = 6;

export default function DonorDonationsPage() {
  const { donations } = useApp();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const mine = donations.filter((item) => item.donor.id === currentDonor.id);

  const filtered = useMemo(() => {
    return mine.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (category !== "all" && item.category !== category) return false;
      if (search) {
        const haystack = `${item.name} ${item.id} ${item.category} ${item.description}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [mine, status, category, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    total: mine.length,
    active: mine.filter((item) => item.status === "available" || item.status === "reserved").length,
    review: mine.filter((item) => item.status === "pending-review").length,
    collected: mine.reduce((sum, item) => sum + item.collectedQty, 0),
  };

  const categories = Array.from(new Set(mine.map((item) => item.category)));

  const reset = () => {
    setStatus("all");
    setCategory("all");
    setSearch("");
    setPage(1);
  };

  return (
    <>
      <PageHeader
        title="My Donations"
        description="Manage every food listing you have shared with the exchange."
        actions={
          <Link href="/donor/add-donation" className={buttonStyles()}>
            <Plus className="h-4 w-4" /> Add donation
          </Link>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Donations" value={stats.total} icon={HeartHandshake} />
        <StatCard label="Active Listings" value={stats.active} icon={Sparkles} tone="blue" hint="Available or reserved" />
        <StatCard label="Awaiting Review" value={stats.review} icon={PackageCheck} tone="amber" />
        <StatCard label="Collected" value={`${stats.collected} kg`} icon={PackageCheck} hint="Confirmed by recipients" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <Tabs
            options={statusOptions.map((option) => ({
              ...option,
              count: option.value === "all" ? mine.length : mine.filter((item) => item.status === option.value).length,
            }))}
            value={status}
            onChange={(value) => { setStatus(value); setPage(1); }}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <SearchField
              value={search}
              onChange={(value) => { setSearch(value); setPage(1); }}
              placeholder="Search your donations by name or ID..."
              className="flex-1"
              ariaLabel="Search donations"
            />
            <Select
              value={category}
              onChange={(event) => { setCategory(event.target.value); setPage(1); }}
              className="sm:w-52"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
            <Button variant="outline" onClick={reset}>Reset</Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-small text-muted">
          {filtered.length} donation{filtered.length === 1 ? "" : "s"} found
        </p>
        <p className="text-caption text-muted">Only confirmed collected quantities count toward redistribution.</p>
      </div>

      {visible.length ? (
        <>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((donation) => (
              <FoodCard
                key={donation.id}
                donation={donation}
                href={`/donor/donations/${donation.id}`}
                action={<StatusBadge status={donation.status} />}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="donations" />
            <Link href="/donor/add-donation" className={buttonStyles("soft", "sm")}>
              <Plus className="h-3.5 w-3.5" /> Donate more food
            </Link>
          </div>
        </>
      ) : (
        <div className="mt-3">
          <EmptyState
            icon={SearchX}
            title={mine.length ? "No donations match your filters" : "You have not added any donations yet"}
            description={mine.length ? "Try a different status, category, or search term." : "Share surplus food with verified recipients and track its impact here."}
            action={
              mine.length ? (
                <Button variant="outline" onClick={reset}>Clear filters</Button>
              ) : (
                <Link href="/donor/add-donation" className={buttonStyles()}>
                  <Plus className="h-4 w-4" /> Add your first donation
                </Link>
              )
            }
          />
        </div>
      )}
    </>
  );
}
