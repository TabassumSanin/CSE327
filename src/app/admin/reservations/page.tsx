"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  PackageCheck,
  Search,
  Truck,
  User,
  Activity,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { TableWrap, Th, Td, Tr, InfoRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Timeline } from "@/components/ui/timeline";
import { ProgressBar } from "@/components/ui/charts";
import type { Reservation } from "@/types";
import { formatDate } from "@/lib/utils";

const PER_PAGE = 6;

function progressFor(status: Reservation["status"]) {
  switch (status) {
    case "provisional": return 10;
    case "awaiting": return 25;
    case "confirmed": return 50;
    case "in-progress": return 75;
    case "completed": return 100;
    default: return 0;
  }
}

function confirmationFor(status: Reservation["status"]) {
  if (["confirmed", "in-progress", "completed"].includes(status)) return "Confirmed";
  if (status === "declined") return "Declined";
  if (status === "expired") return "Expired";
  return "Pending";
}

export default function AdminReservationsPage() {
  const { reservations, updateReservation } = useApp();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Reservation | null>(null);
  const [tracking, setTracking] = useState<Reservation | null>(null);

  const filtered = useMemo(
    () =>
      reservations.filter((item) => {
        const matchesSearch = [item.id, item.foodName, item.donorName, item.recipientName]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === "all" || item.status === status;
        return matchesSearch && matchesStatus;
      }),
    [reservations, search, status]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <PageHeader
        title="Monitor Reservations"
        description="Track provisional holds, confirmations, transport coordination, and collections."
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Reservations" value={reservations.length} icon={CalendarCheck} />
        <StatCard label="Awaiting Confirmation" value={reservations.filter((item) => ["provisional", "awaiting"].includes(item.status)).length} icon={Clock} tone="amber" />
        <StatCard label="Confirmed Reservations" value={reservations.filter((item) => item.status === "confirmed").length} icon={CheckCircle2} tone="blue" />
        <StatCard label="Collection Completed" value={reservations.filter((item) => item.status === "completed").length} icon={PackageCheck} />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search reservation, food, donor, or recipient..." ariaLabel="Search reservations" />
          <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="md:w-56" aria-label="Filter by reservation status">
            <option value="all">All statuses</option>
            <option value="provisional">Provisional reservation</option>
            <option value="awaiting">Awaiting confirmation</option>
            <option value="confirmed">Confirmed</option>
            <option value="declined">Declined</option>
            <option value="expired">Expired</option>
            <option value="in-progress">Collection in progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No reservations found" description="Try adjusting the status filter or search term." icon={Search} />
        </div>
      ) : (
        <>
          <div className="mt-4 hidden xl:block">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Reservation</Th>
                  <Th>Donation</Th>
                  <Th>Recipient</Th>
                  <Th>Quantity</Th>
                  <Th>Reserved</Th>
                  <Th>Transport</Th>
                  <Th>Confirmation</Th>
                  <Th>Progress</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <Tr key={item.id}>
                    <Td><p className="font-medium text-ink">{item.id}</p><p className="text-caption text-muted">{formatDate(item.createdAt)}</p></Td>
                    <Td><p>{item.foodName}</p><p className="text-caption text-muted">{item.donationId}</p></Td>
                    <Td>{item.recipientName}</Td>
                    <Td>{item.quantity} {item.unit}</Td>
                    <Td className="text-caption text-muted">{formatDate(item.collectionDate ?? item.createdAt)}</Td>
                    <Td className="text-caption">{item.transport}</Td>
                    <Td><span className={confirmationFor(item.status) === "Confirmed" ? "text-[#1D6A3E]" : "text-muted"}>{confirmationFor(item.status)}</span></Td>
                    <Td>
                      <div className="w-24">
                        <ProgressBar value={progressFor(item.status)} showValue />
                      </div>
                    </Td>
                    <Td><StatusBadge status={item.status} /></Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setViewing(item)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`View ${item.id}`} title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setTracking(item)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`Track ${item.id}`} title="Track">
                          <Activity className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:hidden">
            {rows.map((item) => (
              <div key={item.id} className="card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-caption text-muted">{item.id}</p>
                    <p className="truncate text-label font-semibold text-ink">{item.foodName}</p>
                    <p className="truncate text-caption text-muted">{item.donationId}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="mt-2 grid gap-1 text-caption text-muted">
                  <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {item.recipientName}</p>
                  <p className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> {item.transport}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {item.address}</p>
                </div>
                <div className="mt-3">
                  <ProgressBar value={progressFor(item.status)} label={`Collection progress · ${item.quantity} ${item.unit}`} />
                </div>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewing(item)}><Eye className="h-3.5 w-3.5" /> View</Button>
                  <Button size="sm" className="flex-1" onClick={() => setTracking(item)}><Activity className="h-3.5 w-3.5" /> Track</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="reservations" />
          </div>
        </>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Reservation details"
        description={viewing?.id}
        size="lg"
        footer={
          viewing ? (
            <>
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => { setTracking(viewing); setViewing(null); }}><Activity className="h-4 w-4" /> Track reservation</Button>
            </>
          ) : null
        }
      >
        {viewing ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={viewing.status} />
              <span className="rounded-full bg-lightgreen px-2.5 py-0.5 text-caption text-primary">{confirmationFor(viewing.status)} by recipient</span>
            </div>
            <dl className="mt-4">
              <InfoRow label="Reservation ID" value={viewing.id} />
              <InfoRow label="Donation" value={`${viewing.foodName} (${viewing.donationId})`} />
              <InfoRow label="Donor" value={viewing.donorName} />
              <InfoRow label="Recipient" value={viewing.recipientName} />
              <InfoRow label="Reserved quantity" value={`${viewing.quantity} ${viewing.unit}`} />
              <InfoRow label="Reservation date" value={formatDate(viewing.createdAt)} />
              <InfoRow label="Confirmation date" value={viewing.confirmationDate ? formatDate(viewing.confirmationDate) : "Not yet confirmed"} />
              <InfoRow label="Transportation" value={viewing.transport} />
              <InfoRow label="Collection schedule" value={`${formatDate(viewing.collectionDate ?? viewing.createdAt)} · ${viewing.collectionWindow}`} />
              <InfoRow label="Collection address" value={viewing.address} />
              <InfoRow label="Instructions" value={viewing.instructions} />
              <InfoRow label="Collected quantity" value={viewing.collectedQty !== undefined ? `${viewing.collectedQty} ${viewing.unit}` : "Not confirmed"} />
            </dl>
            <div className="mt-4">
              <ProgressBar value={progressFor(viewing.status)} label="Collection progress" />
            </div>
            <div className="mt-5">
              <p className="mb-3 text-label font-semibold text-ink">Reservation timeline</p>
              <Timeline events={viewing.timeline} />
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(tracking)}
        onClose={() => setTracking(null)}
        title="Track reservation"
        description={tracking ? `${tracking.id} · ${tracking.foodName}` : ""}
        size="lg"
        footer={
          tracking ? (
            <>
              <Button variant="outline" onClick={() => setTracking(null)}>Close</Button>
              {tracking.status === "confirmed" ? (
                <Button onClick={() => { updateReservation(tracking.id, "in-progress"); setTracking({ ...tracking, status: "in-progress" }); }}>
                  <Truck className="h-4 w-4" /> Mark collection in progress
                </Button>
              ) : tracking.status === "in-progress" ? (
                <Button onClick={() => { updateReservation(tracking.id, "completed", tracking.quantity); setTracking(null); }}>
                  <CheckCircle2 className="h-4 w-4" /> Mark collection completed
                </Button>
              ) : null}
            </>
          ) : null
        }
      >
        {tracking ? (
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Status", confirmationFor(tracking.status)],
                ["Held", `${tracking.quantity} ${tracking.unit}`],
                ["Recipient", tracking.recipientName],
                ["Transport", tracking.transport],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-page p-2.5">
                  <p className="text-caption text-muted">{label}</p>
                  <p className="truncate text-caption font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <ProgressBar value={progressFor(tracking.status)} label="Collection progress" />
            </div>
            <div className="mt-5">
              <p className="mb-3 text-label font-semibold text-ink">Timeline</p>
              <Timeline events={tracking.timeline} />
            </div>
            <div className="mt-4 rounded-xl bg-page p-3 text-caption text-muted">
              <strong className="text-ink">Collection schedule:</strong> {formatDate(tracking.collectionDate ?? tracking.createdAt)} · {tracking.collectionWindow}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
