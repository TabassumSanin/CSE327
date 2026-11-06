"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, Package, Pencil, Search, CalendarClock, CheckCircle2, Clock, Layers } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { TableWrap, Th, Td, Tr, InfoRow } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { Donation } from "@/types";
import { categorySlug, formatDate, formatDateTime } from "@/lib/utils";

const PER_PAGE = 6;

export default function AdminDonationsPage() {
  const { donations, updateDonation, notify } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<Donation | null>(null);
  const [editing, setEditing] = useState<Donation | null>(null);
  const [draft, setDraft] = useState({ quantity: 0, availableQty: 0, expiresAt: "", status: "available" as Donation["status"] });

  const filtered = useMemo(
    () =>
      donations.filter((item) => {
        const matchesSearch = [item.name, item.id, item.donor.organization ?? "", item.donor.name]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesCategory = category === "all" || item.category === category;
        const matchesStatus = status === "all" || item.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [donations, search, category, status]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const openEdit = (donation: Donation) => {
    setEditing(donation);
    setDraft({
      quantity: donation.quantity,
      availableQty: donation.availableQty,
      expiresAt: donation.expiresAt.slice(0, 16),
      status: donation.status,
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    if (draft.availableQty + editing.reservedQty + editing.collectedQty > draft.quantity) {
      notify("Total quantity cannot be less than available, reserved, and collected quantities combined.", "error");
      return;
    }
    if (draft.availableQty < 0) {
      notify("Available quantity cannot be negative.", "error");
      return;
    }
    updateDonation(editing.id, {
      quantity: draft.quantity,
      availableQty: draft.availableQty,
      expiresAt: draft.expiresAt,
      status: draft.status,
    });
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="Manage Donations"
        description="Review quantities, statuses, and donor records across the platform."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-caption text-muted">
            <Layers className="h-4 w-4 text-secondary" /> {donations.length} total records
          </span>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Donations" value={donations.length} icon={Package} />
        <StatCard label="Available Donations" value={donations.filter((item) => item.status === "available").length} icon={CheckCircle2} />
        <StatCard label="Reserved Donations" value={donations.filter((item) => item.status === "reserved").length} icon={Clock} tone="blue" />
        <StatCard label="Completed Donations" value={donations.filter((item) => item.status === "completed").length} icon={CalendarClock} tone="amber" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search donation, food, or donor..." ariaLabel="Search donations" />
          <Select value={category} onChange={(event) => { setCategory(event.target.value); setPage(1); }} className="md:w-48" aria-label="Filter by category">
            <option value="all">All categories</option>
            <option>Prepared Food</option>
            <option>Packaged Food</option>
            <option>Produce</option>
            <option>Bakery</option>
            <option>Refrigerated</option>
            <option>Frozen</option>
          </Select>
          <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="md:w-44" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="completed">Completed</option>
            <option value="pending-review">Pending review</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No donations found" description="Try adjusting your search or filters." icon={Search} />
        </div>
      ) : (
        <>
          <div className="mt-4 hidden xl:block">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Donation</Th>
                  <Th>Donor</Th>
                  <Th>Category</Th>
                  <Th>Total</Th>
                  <Th>Available</Th>
                  <Th>Reserved</Th>
                  <Th>Collected</Th>
                  <Th>Expiry</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((donation) => (
                  <Tr key={donation.id}>
                    <Td>
                      <p className="font-medium text-ink">{donation.name}</p>
                      <p className="text-caption text-muted">{donation.id}</p>
                    </Td>
                    <Td>
                      <p>{donation.donor.organization}</p>
                      <p className="text-caption text-muted">{donation.donor.name}</p>
                    </Td>
                    <Td>{donation.category}</Td>
                    <Td>{donation.quantity} {donation.unit}</Td>
                    <Td className="font-medium text-primary">{donation.availableQty}</Td>
                    <Td>{donation.reservedQty}</Td>
                    <Td>{donation.collectedQty}</Td>
                    <Td className="text-caption text-muted">{formatDate(donation.expiresAt)}</Td>
                    <Td><StatusBadge status={donation.status} /></Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setViewing(donation)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`View ${donation.name}`} title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => openEdit(donation)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`Edit ${donation.name}`} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:hidden">
            {rows.map((donation) => (
              <div key={donation.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-lightgreen">
                    <Image src={`/images/food-${categorySlug(donation.category)}.svg`} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label font-semibold text-ink">{donation.name}</p>
                    <p className="text-caption text-muted">{donation.id} · {donation.donor.organization}</p>
                  </div>
                  <StatusBadge status={donation.status} />
                </div>
                <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-caption">
                  {[
                    ["Total", donation.quantity],
                    ["Avail.", donation.availableQty],
                    ["Res.", donation.reservedQty],
                    ["Coll.", donation.collectedQty],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-page py-1.5">
                      <p className="text-muted">{label}</p>
                      <p className="font-semibold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between text-caption text-muted">
                  <span>{donation.category}</span>
                  <span>Expires {formatDate(donation.expiresAt)}</span>
                </div>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewing(donation)}><Eye className="h-3.5 w-3.5" /> View details</Button>
                  <Button size="sm" className="flex-1" onClick={() => openEdit(donation)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="donations" />
          </div>
        </>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? "Donation details"}
        description={viewing?.id}
        size="lg"
        footer={
          viewing ? (
            <>
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              <Button onClick={() => { openEdit(viewing); setViewing(null); }}><Pencil className="h-4 w-4" /> Edit donation</Button>
            </>
          ) : null
        }
      >
        {viewing ? (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={viewing.status} />
              <StatusBadge status={viewing.verification} label={`Verification: ${viewing.verification.replace("-", " ")}`} />
              <span className="rounded-full bg-lightgreen px-2.5 py-0.5 text-caption text-primary">{viewing.category}</span>
            </div>
            <p className="mt-3 text-small text-muted">{viewing.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Total", `${viewing.quantity} ${viewing.unit}`],
                ["Available", `${viewing.availableQty} ${viewing.unit}`],
                ["Reserved", `${viewing.reservedQty} ${viewing.unit}`],
                ["Collected", `${viewing.collectedQty} ${viewing.unit}`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-page px-3 py-2">
                  <p className="text-caption text-muted">{label}</p>
                  <p className="text-label font-semibold text-ink">{value}</p>
                </div>
              ))}
            </div>
            <dl className="mt-4">
              <InfoRow label="Donor" value={viewing.donor.organization ?? viewing.donor.name} />
              <InfoRow label="Donor contact" value={`${viewing.donor.email} · ${viewing.donor.phone}`} />
              <InfoRow label="Prepared" value={formatDateTime(viewing.preparedAt)} />
              <InfoRow label="Expires" value={formatDateTime(viewing.expiresAt)} />
              <InfoRow label="Storage" value={viewing.storage} />
              <InfoRow label="Temperature" value={viewing.temperature ?? "Not applicable"} />
              <InfoRow label="Allergens" value={viewing.allergens.length ? viewing.allergens.join(", ") : "None declared"} />
              <InfoRow label="Pickup location" value={viewing.pickupLocation} />
              <InfoRow label="Pickup instructions" value={viewing.pickupInstructions} />
              <InfoRow label="Transportation" value={viewing.transportation} />
              <InfoRow label="Review notes" value={viewing.reviewNotes ?? "—"} />
            </dl>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit donation"
        description={editing ? `${editing.id} · ${editing.donor.organization}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </>
        }
      >
        {editing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Total quantity" htmlFor="edit-total" required>
              <Input id="edit-total" type="number" min={0} value={draft.quantity} onChange={(e) => setDraft((prev) => ({ ...prev, quantity: Number(e.target.value) }))} />
            </Field>
            <Field label="Available quantity" htmlFor="edit-available" required hint={`Reserved: ${editing.reservedQty} · Collected: ${editing.collectedQty}`}>
              <Input id="edit-available" type="number" min={0} value={draft.availableQty} onChange={(e) => setDraft((prev) => ({ ...prev, availableQty: Number(e.target.value) }))} />
            </Field>
            <Field label="Expiry date and time" htmlFor="edit-expiry" required>
              <Input id="edit-expiry" type="datetime-local" value={draft.expiresAt} onChange={(e) => setDraft((prev) => ({ ...prev, expiresAt: e.target.value }))} />
            </Field>
            <Field label="Status" htmlFor="edit-status" required>
              <Select id="edit-status" value={draft.status} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as Donation["status"] }))}>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="completed">Completed</option>
                <option value="pending-review">Pending review</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Field>
            <div className="sm:col-span-2 rounded-xl border border-[#C6DAF4] bg-info/60 p-3 text-caption text-[#23548C]">
              Available quantity excludes amounts held by active provisional reservations. Editing
              quantities affects future matching immediately.
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
