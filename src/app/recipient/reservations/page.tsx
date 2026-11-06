"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  Mail,
  Package,
  PackageCheck,
  Phone,
  SearchX,
  Truck,
  XCircle,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Tabs } from "@/components/ui/tabs";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Timeline } from "@/components/ui/timeline";
import { InfoRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { currentRecipient } from "@/data/mock";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Reservation } from "@/types";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Needs Confirmation" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

function matchesTab(reservation: Reservation, tab: string) {
  if (tab === "all") return true;
  if (tab === "pending") return ["provisional", "awaiting"].includes(reservation.status);
  if (tab === "closed") return ["declined", "expired", "cancelled"].includes(reservation.status);
  return reservation.status === tab;
}

export default function RecipientReservationsPage() {
  const { donations, reservations, updateReservation, notify } = useApp();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [decision, setDecision] = useState<{ reservation: Reservation; action: "decline" | "cancel" } | null>(null);

  const mine = reservations.filter((item) => item.recipientName === currentRecipient.organization);

  const filtered = mine.filter((item) => {
    if (!matchesTab(item, tab)) return false;
    if (search) {
      const haystack = `${item.id} ${item.foodName} ${item.donorName}`.toLowerCase();
      if (!haystack.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const counts = {
    pending: mine.filter((item) => ["provisional", "awaiting"].includes(item.status)).length,
    confirmed: mine.filter((item) => item.status === "confirmed").length,
    progress: mine.filter((item) => item.status === "in-progress").length,
    completed: mine.filter((item) => item.status === "completed").length,
  };

  const donorFor = (reservation: Reservation) => donations.find((item) => item.id === reservation.donationId)?.donor;

  const confirmReservation = (reservation: Reservation) => {
    updateReservation(reservation.id, "confirmed");
    setDetail(null);
  };

  const decide = () => {
    if (!decision) return;
    updateReservation(decision.reservation.id, decision.action === "decline" ? "declined" : "cancelled");
    setDetail(null);
    setDecision(null);
  };

  const copyAddress = async (reservation: Reservation) => {
    try {
      await navigator.clipboard.writeText(`${reservation.address}\n${reservation.collectionWindow}`);
      notify("Pickup address copied.");
    } catch {
      notify("Unable to copy the address in this browser.", "error");
    }
  };

  const contactRevealed = (status: string) => ["confirmed", "in-progress", "completed"].includes(status);

  return (
    <>
      <PageHeader
        title="My Reservations"
        description="Confirm provisional holds, review pickups, and manage your reserved food."
        actions={<Link href="/recipient/available-food" className={buttonStyles()}><Package className="h-4 w-4" /> Find more food</Link>}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Needs Confirmation" value={counts.pending} icon={Clock} tone="amber" hint="Confirm before the hold expires" />
        <StatCard label="Confirmed" value={counts.confirmed} icon={CalendarCheck} />
        <StatCard label="In Progress" value={counts.progress} icon={Truck} tone="blue" />
        <StatCard label="Completed" value={counts.completed} icon={PackageCheck} hint="Confirmed collected" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <Tabs
            options={tabs.map((item) => ({ ...item, count: mine.filter((reservation) => matchesTab(reservation, item.value)).length }))}
            value={tab}
            onChange={setTab}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchField value={search} onChange={setSearch} placeholder="Search by food, donor, or reservation ID..." className="flex-1" ariaLabel="Search reservations" />
            <p className="text-caption text-muted">{filtered.length} reservation{filtered.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <>
          <div className="mt-4 hidden md:block">
            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full min-w-[860px] text-left">
                  <thead>
                    <tr>
                      {["Food & Donor", "Quantity", "Collection", "Status", "Actions"].map((heading) => (
                        <th key={heading} className="border-b border-line bg-[#F8FAF8] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((reservation) => (
                      <tr key={reservation.id} className="border-b border-line/70 last:border-0 hover:bg-[#FAFCFA]">
                        <td className="px-4 py-3">
                          <p className="text-small font-semibold text-ink">{reservation.foodName}</p>
                          <p className="text-caption text-muted">{reservation.donorName} · {reservation.id}</p>
                        </td>
                        <td className="px-4 py-3 text-small text-ink">{reservation.quantity} {reservation.unit}</td>
                        <td className="px-4 py-3">
                          <p className="text-small text-ink">{reservation.collectionDate ? formatDate(reservation.collectionDate) : "TBC"}</p>
                          <p className="text-caption text-muted">{reservation.collectionWindow}</p>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={reservation.status} /></td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Button size="sm" variant="outline" onClick={() => setDetail(reservation)}>View</Button>
                            {["provisional", "awaiting"].includes(reservation.status) ? (
                              <Button size="sm" onClick={() => confirmReservation(reservation)}>Confirm</Button>
                            ) : null}
                            {reservation.status === "confirmed" ? (
                              <Link href="/recipient/collections" className={buttonStyles("soft", "sm")}>Collection</Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((reservation) => (
              <article key={reservation.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-label font-semibold text-ink">{reservation.foodName}</p>
                    <p className="truncate text-caption text-muted">{reservation.donorName} · {reservation.id}</p>
                  </div>
                  <StatusBadge status={reservation.status} />
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-caption text-muted">
                  <p>Quantity: <span className="font-medium text-ink">{reservation.quantity} {reservation.unit}</span></p>
                  <p>Collection: <span className="font-medium text-ink">{reservation.collectionDate ? formatDate(reservation.collectionDate) : "TBC"}</span></p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" onClick={() => setDetail(reservation)}>View details</Button>
                  {["provisional", "awaiting"].includes(reservation.status) ? <Button size="sm" onClick={() => confirmReservation(reservation)}>Confirm</Button> : null}
                  {reservation.status === "confirmed" ? <Link href="/recipient/collections" className={buttonStyles("soft", "sm")}>Collection</Link> : null}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={SearchX}
            title="No reservations match"
            description="Try another tab or search term. Reserve verified food to see it here."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => { setTab("all"); setSearch(""); }}>Clear filters</Button>
                <Link href="/recipient/available-food" className={buttonStyles()}>Browse food</Link>
              </div>
            }
          />
        </div>
      )}

      <SectionCard className="mt-4" title="Confirmation rules">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Provisional hold", "Held quantity is reserved for you for a limited time. Confirm to keep it."],
            ["Confirmation", "Confirming shares donor contact details and moves the reservation to collection coordination."],
            ["Decline or expire", "Declining or missing the window releases the quantity for other eligible recipients."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-xl bg-page p-3">
              <p className="text-label font-semibold text-ink">{title}</p>
              <p className="mt-1 text-caption text-muted">{description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.foodName ?? "Reservation details"}
        description={detail ? `${detail.id} · ${detail.donorName}` : ""}
        size="lg"
        footer={
          detail ? (
            <>
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
              {["provisional", "awaiting"].includes(detail.status) ? (
                <>
                  <Button variant="danger" onClick={() => setDecision({ reservation: detail, action: "decline" })}><XCircle className="h-4 w-4" /> Decline</Button>
                  <Button onClick={() => confirmReservation(detail)}><CheckCircle2 className="h-4 w-4" /> Confirm reservation</Button>
                </>
              ) : null}
              {detail.status === "confirmed" ? (
                <>
                  <Button variant="danger" onClick={() => setDecision({ reservation: detail, action: "cancel" })}>Cancel</Button>
                  <Link href="/recipient/collections" className={buttonStyles()}>Go to collections</Link>
                </>
              ) : null}
              {detail.status === "in-progress" ? <Link href="/recipient/collections" className={buttonStyles()}>Manage collection</Link> : null}
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={detail.status} />
              <span className="rounded-full bg-page px-2.5 py-0.5 text-caption text-muted">Match score 92%</span>
              <span className="rounded-full bg-page px-2.5 py-0.5 text-caption text-muted">{detail.transport}</span>
            </div>
            <dl className="grid gap-x-6 sm:grid-cols-2">
              <InfoRow label="Donor" value={detail.donorName} />
              <InfoRow label="Reserved quantity" value={`${detail.quantity} ${detail.unit}`} />
              <InfoRow label="Collected quantity" value={detail.collectedQty ? `${detail.collectedQty} ${detail.unit}` : "Not confirmed"} />
              <InfoRow label="Created" value={formatDateTime(detail.createdAt)} />
              <InfoRow label="Collection date" value={detail.collectionDate ? formatDate(detail.collectionDate) : "To be coordinated"} />
              <InfoRow label="Collection window" value={detail.collectionWindow} />
            </dl>
            <div className="rounded-xl bg-page p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-1.5 text-caption font-semibold text-ink"><ClipboardList className="h-3.5 w-3.5 text-secondary" /> Pickup address</p>
                  <p className="mt-1 text-small text-muted">{detail.address}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => copyAddress(detail)}><Copy className="h-3.5 w-3.5" /> Copy</Button>
              </div>
              <p className="mt-1 text-caption text-muted">{detail.instructions}</p>
            </div>
            <div>
              <p className="mb-2 text-label font-semibold text-ink">Reservation timeline</p>
              <Timeline events={detail.timeline} />
            </div>
            {contactRevealed(detail.status) ? (
              <div className="rounded-xl border border-line p-3">
                <p className="text-caption font-semibold text-ink">Donor contact</p>
                <div className="mt-2 flex flex-wrap gap-3 text-caption">
                  <a href={`mailto:${donorFor(detail)?.email ?? ""}`} className="inline-flex items-center gap-1.5 text-primary hover:underline"><Mail className="h-3.5 w-3.5" /> {donorFor(detail)?.email ?? "Unavailable"}</a>
                  <a href={`tel:${donorFor(detail)?.phone ?? ""}`} className="inline-flex items-center gap-1.5 text-primary hover:underline"><Phone className="h-3.5 w-3.5" /> {donorFor(detail)?.phone ?? "Unavailable"}</a>
                </div>
              </div>
            ) : (
              <p className="rounded-lg bg-warning/60 p-2.5 text-caption text-[#7A5A0B]">Donor contact details are revealed after confirmation.</p>
            )}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={decide}
        variant="danger"
        title={decision?.action === "decline" ? "Decline this reservation?" : "Cancel this reservation?"}
        description={
          decision
            ? decision.action === "decline"
              ? `The hold for ${decision.reservation.quantity} ${decision.reservation.unit} of ${decision.reservation.foodName} will be released immediately.`
              : `Cancelling ${decision.reservation.id} releases ${decision.reservation.quantity} ${decision.reservation.unit} back to the donation. This cannot be undone.`
            : ""
        }
        confirmLabel={decision?.action === "decline" ? "Decline reservation" : "Cancel reservation"}
        cancelLabel="Keep reservation"
        icon={<CalendarDays className="h-5 w-5 text-[#8C2F27]" />}
      />
    </>
  );
}
