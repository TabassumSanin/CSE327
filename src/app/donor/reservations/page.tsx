"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Clock,
  PackageCheck,
  SearchX,
  Truck,
  XCircle,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/form";
import { Timeline } from "@/components/ui/timeline";
import { InfoRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { currentDonor } from "@/data/mock";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Reservation } from "@/types";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Declined / Expired" },
];

function matchesTab(reservation: Reservation, tab: string) {
  if (tab === "all") return true;
  if (tab === "pending") return ["provisional", "awaiting"].includes(reservation.status);
  if (tab === "closed") return ["declined", "expired", "cancelled"].includes(reservation.status);
  return reservation.status === tab;
}

export default function DonorReservationsPage() {
  const { donations, reservations, updateReservation, notify } = useApp();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Reservation | null>(null);
  const [declining, setDeclining] = useState<Reservation | null>(null);
  const [completing, setCompleting] = useState<Reservation | null>(null);
  const [collectedQty, setCollectedQty] = useState("");

  const myDonationIds = useMemo(
    () => new Set(donations.filter((item) => item.donor.id === currentDonor.id).map((item) => item.id)),
    [donations]
  );
  const mine = reservations.filter((item) => myDonationIds.has(item.donationId));

  const filtered = mine.filter((item) => {
    if (!matchesTab(item, tab)) return false;
    if (search) {
      const haystack = `${item.id} ${item.recipientName} ${item.foodName}`.toLowerCase();
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

  const confirmReservation = (reservation: Reservation) => {
    updateReservation(reservation.id, "confirmed");
    setDetail(null);
  };

  const startCollection = (reservation: Reservation) => {
    updateReservation(reservation.id, "in-progress");
    setDetail(null);
  };

  const openComplete = (reservation: Reservation) => {
    setCompleting(reservation);
    setCollectedQty(String(reservation.quantity));
    setDetail(null);
  };

  const completeCollection = () => {
    if (!completing) return;
    const quantity = Number(collectedQty);
    if (!quantity || quantity <= 0) {
      notify("Enter the confirmed collected quantity.", "error");
      return;
    }
    if (quantity > completing.quantity) {
      notify("Collected quantity cannot exceed the reserved quantity.", "error");
      return;
    }
    updateReservation(completing.id, "completed", quantity);
    setCompleting(null);
  };

  const decline = () => {
    if (!declining) return;
    updateReservation(declining.id, "declined");
    setDeclining(null);
  };

  return (
    <>
      <PageHeader
        title="Reservations"
        description="Confirm recipient reservations, coordinate collection, and confirm collected quantities."
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pending Confirmation" value={counts.pending} icon={Clock} tone="amber" />
        <StatCard label="Confirmed" value={counts.confirmed} icon={CalendarCheck} />
        <StatCard label="In Progress" value={counts.progress} icon={Truck} tone="blue" />
        <StatCard label="Completed" value={counts.completed} icon={PackageCheck} hint="Confirmed collections" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <Tabs
            options={tabs.map((item) => ({ ...item, count: mine.filter((reservation) => matchesTab(reservation, item.value)).length }))}
            value={tab}
            onChange={setTab}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchField value={search} onChange={setSearch} placeholder="Search by recipient, food, or reservation ID..." className="flex-1" ariaLabel="Search reservations" />
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
                      {["Recipient", "Food", "Quantity", "Collection", "Status", "Actions"].map((heading) => (
                        <th key={heading} className="border-b border-line bg-[#F8FAF8] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((reservation) => (
                      <tr key={reservation.id} className="border-b border-line/70 last:border-0 hover:bg-[#FAFCFA]">
                        <td className="px-4 py-3">
                          <p className="text-small font-semibold text-ink">{reservation.recipientName}</p>
                          <p className="text-caption text-muted">{reservation.id}</p>
                        </td>
                        <td className="px-4 py-3 text-small text-ink">{reservation.foodName}</td>
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
                              <Button size="sm" onClick={() => startCollection(reservation)}>Start collection</Button>
                            ) : null}
                            {reservation.status === "in-progress" ? (
                              <Button size="sm" onClick={() => openComplete(reservation)}>Mark collected</Button>
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
                    <p className="truncate text-label font-semibold text-ink">{reservation.recipientName}</p>
                    <p className="truncate text-caption text-muted">{reservation.id} · {reservation.foodName}</p>
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
                  {reservation.status === "confirmed" ? <Button size="sm" onClick={() => startCollection(reservation)}>Start collection</Button> : null}
                  {reservation.status === "in-progress" ? <Button size="sm" onClick={() => openComplete(reservation)}>Mark collected</Button> : null}
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
            description="Try another status tab or search term. New reservations will appear here when recipients reserve your food."
            action={<Button variant="outline" onClick={() => { setTab("all"); setSearch(""); }}>Clear filters</Button>}
          />
        </div>
      )}

      <SectionCard className="mt-4" title="How reservations work" bodyClassName="p-4 md:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["1. Provisional hold", "A recipient is matched and the quantity is held. Confirm or decline the request."],
            ["2. Coordinate collection", "Confirm pickup timing and transport instructions with the recipient."],
            ["3. Confirm collection", "Only the confirmed collected quantity counts as redistributed food."],
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
        title={detail ? `${detail.recipientName}` : "Reservation details"}
        description={detail ? `${detail.id} · ${detail.foodName}` : ""}
        size="lg"
        footer={
          detail ? (
            <>
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
              {["provisional", "awaiting"].includes(detail.status) ? (
                <>
                  <Button variant="danger" onClick={() => { setDeclining(detail); setDetail(null); }}><XCircle className="h-4 w-4" /> Decline</Button>
                  <Button onClick={() => confirmReservation(detail)}><CheckCircle2 className="h-4 w-4" /> Confirm reservation</Button>
                </>
              ) : null}
              {detail.status === "confirmed" ? <Button onClick={() => startCollection(detail)}><Truck className="h-4 w-4" /> Start collection</Button> : null}
              {detail.status === "in-progress" ? <Button onClick={() => openComplete(detail)}><PackageCheck className="h-4 w-4" /> Mark collected</Button> : null}
            </>
          ) : null
        }
      >
        {detail ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={detail.status} />
              <span className="rounded-full bg-page px-2.5 py-0.5 text-caption text-muted">{detail.transport}</span>
            </div>
            <dl className="grid gap-x-6 sm:grid-cols-2">
              <InfoRow label="Recipient" value={detail.recipientName} />
              <InfoRow label="Food" value={detail.foodName} />
              <InfoRow label="Reserved quantity" value={`${detail.quantity} ${detail.unit}`} />
              <InfoRow label="Collected quantity" value={detail.collectedQty ? `${detail.collectedQty} ${detail.unit}` : "Not confirmed"} />
              <InfoRow label="Created" value={formatDateTime(detail.createdAt)} />
              <InfoRow label="Collection date" value={detail.collectionDate ? formatDate(detail.collectionDate) : "To be coordinated"} />
              <InfoRow label="Collection window" value={detail.collectionWindow} />
              <InfoRow label="Transport" value={detail.transport} />
            </dl>
            <div className="rounded-xl bg-page p-3">
              <p className="flex items-center gap-1.5 text-caption font-semibold text-ink"><ClipboardList className="h-3.5 w-3.5 text-secondary" /> Pickup instructions</p>
              <p className="mt-1 text-small text-muted">{detail.address}</p>
              <p className="mt-1 text-caption text-muted">{detail.instructions}</p>
            </div>
            <div>
              <p className="mb-2 text-label font-semibold text-ink">Reservation timeline</p>
              <Timeline events={detail.timeline} />
            </div>
            {["provisional", "awaiting"].includes(detail.status) ? (
              <p className="rounded-lg bg-warning/60 p-2.5 text-caption text-[#7A5A0B]">
                Declining or letting this hold expire releases the reserved quantity back to the donation pool.
              </p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(completing)}
        onClose={() => setCompleting(null)}
        title="Confirm collected quantity"
        description={completing ? `${completing.id} · ${completing.recipientName}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button onClick={completeCollection}><CheckCircle2 className="h-4 w-4" /> Confirm collection</Button>
          </>
        }
      >
        {completing ? (
          <div className="space-y-3">
            <p className="text-small text-muted">Enter the quantity actually collected. Only this amount is counted as redistributed food.</p>
            <Field label={`Collected quantity (${completing.unit})`} htmlFor="collected-qty" required hint={`Reserved: ${completing.quantity} ${completing.unit}`}>
              <Input id="collected-qty" type="number" min={1} max={completing.quantity} value={collectedQty} onChange={(event) => setCollectedQty(event.target.value)} />
            </Field>
            <div className="rounded-lg bg-page p-2.5 text-caption text-muted">
              Any uncollected difference is released and will not count toward your redistribution impact.
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(declining)}
        onClose={() => setDeclining(null)}
        onConfirm={decline}
        variant="danger"
        title="Decline this reservation?"
        description={declining ? `${declining.recipientName}'s hold for ${declining.quantity} ${declining.unit} of ${declining.foodName} will be released immediately.` : ""}
        confirmLabel="Decline reservation"
        cancelLabel="Keep reservation"
        icon={<XCircle className="h-5 w-5 text-[#8C2F27]" />}
      />
    </>
  );
}
