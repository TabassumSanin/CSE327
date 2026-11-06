"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  Copy,
  HeartHandshake,
  Leaf,
  MapPin,
  Package,
  Pencil,
  Share2,
  ShieldCheck,
  ThermometerSnowflake,
  Truck,
  XCircle,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Timeline } from "@/components/ui/timeline";
import { EmptyState } from "@/components/ui/empty-state";
import { InfoRow } from "@/components/ui/table";
import { currentDonor } from "@/data/mock";
import { categorySlug, daysUntil, formatDate, formatDateTime } from "@/lib/utils";
import type { Donation } from "@/types";

export default function DonorDonationDetailPage() {
  const params = useParams<{ id: string }>();
  const { donations, reservations, updateDonation, updateDonationStatus, notify } = useApp();
  const donation = donations.find((item) => item.id === params.id);
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    description: "",
    quantity: 0,
    expiresAt: "",
    pickupLocation: "",
    pickupInstructions: "",
  });

  const linkedReservations = useMemo(
    () => reservations.filter((item) => item.donationId === params.id),
    [reservations, params.id]
  );

  if (!donation || donation.donor.id !== currentDonor.id) {
    return (
      <EmptyState
        icon={Package}
        title="Donation not found"
        description="This donation does not exist or does not belong to your donor account."
        action={<Link href="/donor/donations" className={buttonStyles()}>Back to my donations</Link>}
      />
    );
  }

  const days = daysUntil(donation.expiresAt);
  const remaining = Math.max(0, donation.availableQty);
  const canEdit = ["available", "reserved", "pending-review", "expired"].includes(donation.status);
  const canCancel = ["available", "pending-review"].includes(donation.status) && donation.reservedQty === 0;

  const openEdit = () => {
    setDraft({
      name: donation.name,
      description: donation.description,
      quantity: donation.quantity,
      expiresAt: donation.expiresAt.slice(0, 16),
      pickupLocation: donation.pickupLocation,
      pickupInstructions: donation.pickupInstructions,
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (draft.name.trim().length < 3) {
      notify("Enter a food name of at least 3 characters.", "error");
      return;
    }
    if (draft.description.trim().length < 20) {
      notify("Description must be at least 20 characters.", "error");
      return;
    }
    if (draft.quantity < donation.reservedQty + donation.collectedQty) {
      notify("Quantity cannot be less than reserved and collected amounts.", "error");
      return;
    }
    if (new Date(draft.expiresAt) <= new Date(donation.preparedAt)) {
      notify("Expiry must be after the preparation time.", "error");
      return;
    }
    updateDonation(donation.id, {
      name: draft.name.trim(),
      description: draft.description.trim(),
      quantity: draft.quantity,
      availableQty: draft.quantity - donation.reservedQty - donation.collectedQty,
      expiresAt: draft.expiresAt,
      pickupLocation: draft.pickupLocation.trim(),
      pickupInstructions: draft.pickupInstructions.trim(),
      status: donation.status === "expired" ? "available" : donation.status,
    });
    setEditOpen(false);
  };

  const cancelDonation = () => {
    if (donation.reservedQty > 0) {
      notify("Cancel or complete active reservations before cancelling this donation.", "error");
      setCancelOpen(false);
      return;
    }
    updateDonationStatus(donation.id, "cancelled", "Cancelled by the donor.");
    setCancelOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      notify("Donation link copied to clipboard.");
    } catch {
      notify("Unable to copy the link in this browser.", "error");
    }
  };

  const timeline = [
    {
      title: "Donation submitted",
      description: `${donation.donor.organization ?? donation.donor.name} submitted ${donation.quantity} ${donation.unit}.`,
      time: formatDateTime(donation.createdAt),
      done: true,
    },
    {
      title:
        donation.verification === "verified"
          ? "Automated verification passed"
          : donation.verification === "rejected"
          ? "Rejected by safety review"
          : "Awaiting administrator review",
      description:
        donation.verification === "verified"
          ? "Safety details and expiry window passed automated checks."
          : donation.verification === "rejected"
          ? donation.reviewNotes ?? "The donation did not meet food safety requirements."
          : donation.reviewNotes ?? "A flagged donation requires manual approval.",
      time: donation.verification === "needs-review" ? "Pending" : formatDate(donation.createdAt),
      done: donation.verification !== "needs-review",
    },
    {
      title: "Recipient reservation",
      description: donation.reservedQty
        ? `${donation.reservedQty} ${donation.unit} held for verified recipients.`
        : "No active reservations yet.",
      time: donation.reservedQty ? "Active" : "Pending",
      done: donation.reservedQty > 0 || donation.collectedQty > 0,
    },
    {
      title: "Collection completed",
      description:
        donation.collectedQty > 0
          ? `${donation.collectedQty} ${donation.unit} confirmed collected.`
          : "Confirmed collected quantity will appear here.",
      time: donation.collectedQty > 0 ? "Completed" : "Pending",
      done: donation.collectedQty > 0,
    },
  ];

  return (
    <>
      <Breadcrumbs items={[{ label: "My Donations", href: "/donor/donations" }, { label: donation.name }]} />

      <PageHeader
        className="mt-2"
        eyebrow={donation.id}
        title={donation.name}
        description={`${donation.category} · listed ${formatDate(donation.createdAt)} by ${donation.donor.organization ?? donation.donor.name}`}
        actions={
          <>
            <Link href="/donor/donations" className={buttonStyles("outline")}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
            <Button variant="outline" onClick={copyLink}><Copy className="h-4 w-4" /> Copy link</Button>
            {canEdit ? <Button onClick={openEdit}><Pencil className="h-4 w-4" /> Edit</Button> : null}
          </>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={donation.status} />
        <StatusBadge status={donation.verification} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-caption text-muted">
          <CalendarClock className="h-3.5 w-3.5" />
          {days < 0 ? "Expired" : days === 0 ? "Expires today" : days === 1 ? "1 day left" : `${days} days left`}
        </span>
        {donation.flags.length ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning px-2.5 py-0.5 text-caption text-[#7A5A0B]">
            <AlertTriangle className="h-3.5 w-3.5" /> {donation.flags.length} safety flag{donation.flags.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <SectionCard bodyClassName="p-0 md:p-0">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-lightgreen">
              <Image
                src={`/images/food-${categorySlug(donation.category)}.svg`}
                alt={`${donation.name} illustration`}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 60vw"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-[#1B2C23]/70 to-transparent p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-caption font-medium text-ink">
                  <Leaf className="h-3.5 w-3.5 text-primary" /> {donation.category}
                </span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-caption text-muted">{donation.photos} photo{donation.photos === 1 ? "" : "s"} on file</span>
              </div>
            </div>
            {donation.photos > 1 ? (
              <div className="flex gap-2 overflow-x-auto p-3">
                {Array.from({ length: Math.min(donation.photos, 4) }).map((_, index) => (
                  <div key={index} className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-line">
                    <Image src={`/images/food-${categorySlug(donation.category)}.svg`} alt={`${donation.name} photo ${index + 1}`} fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            ) : null}
          </SectionCard>

          <SectionCard title="About this donation">
            <p className="text-small leading-relaxed text-muted">{donation.description}</p>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <InfoRow label="Category" value={donation.category} />
              <InfoRow label="Total quantity" value={`${donation.quantity} ${donation.unit}`} />
              <InfoRow label="Prepared" value={formatDateTime(donation.preparedAt)} />
              <InfoRow label="Safe until" value={formatDateTime(donation.expiresAt)} />
              <InfoRow label="Storage" value={donation.storage} />
              <InfoRow label="Temperature" value={donation.temperature ?? "Not applicable"} />
              <InfoRow label="Allergens" value={donation.allergens.length ? donation.allergens.join(", ") : "None declared"} />
              <InfoRow label="Transportation" value={donation.transportation} />
            </dl>
          </SectionCard>

          <SectionCard title="Food Safety Review" description="Automated verification is advisory; administrators review flagged food">
            <div className={`flex items-start gap-3 rounded-xl p-3 ${donation.verification === "verified" ? "bg-success" : donation.verification === "rejected" ? "bg-error" : "bg-warning"}`}>
              {donation.verification === "verified" ? (
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1D6A3E]" />
              ) : donation.verification === "rejected" ? (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#8C2F27]" />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#7A5A0B]" />
              )}
              <div>
                <p className="text-label font-semibold text-ink">
                  {donation.verification === "verified"
                    ? "Passed automated verification"
                    : donation.verification === "rejected"
                    ? "Rejected by food safety review"
                    : "Waiting for administrator review"}
                </p>
                <p className="mt-0.5 text-caption text-muted">
                  {donation.verification === "verified"
                    ? "The expiry window, storage details, and allergen declaration met advisory checks."
                    : donation.verification === "rejected"
                    ? donation.reviewNotes ?? "This donation cannot be redistributed."
                    : donation.reviewNotes ?? "A flagged donation needs manual approval before matching."}
                </p>
              </div>
            </div>
            {donation.flags.length ? (
              <ul className="mt-3 space-y-2">
                {donation.flags.map((flag) => (
                  <li key={flag} className="flex items-start gap-2 rounded-lg border border-[#F0DFA8] bg-warning/50 p-2.5 text-caption text-[#7A5A0B]">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {flag}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p className="flex items-center gap-1.5 rounded-lg bg-page p-2.5 text-caption text-muted"><ThermometerSnowflake className="h-3.5 w-3.5 text-secondary" /> {donation.storage}</p>
              <p className="flex items-center gap-1.5 rounded-lg bg-page p-2.5 text-caption text-muted"><Clock className="h-3.5 w-3.5 text-secondary" /> Reviewed {formatDate(donation.createdAt)}</p>
            </div>
          </SectionCard>

          <SectionCard title="Pickup Details" description="Shared with confirmed recipients">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <div>
                <p className="text-label font-medium text-ink">{donation.pickupLocation}</p>
                <p className="mt-1 text-small text-muted">{donation.pickupInstructions}</p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-caption text-muted">
              <Truck className="h-4 w-4 text-secondary" /> {donation.transportation}
            </p>
          </SectionCard>

          <SectionCard
            title="Reservations"
            description={`${linkedReservations.length} reservation${linkedReservations.length === 1 ? "" : "s"} linked to this donation`}
            action={<Link href="/donor/reservations" className="text-caption font-semibold text-primary hover:underline">Manage reservations</Link>}
            bodyClassName="p-0 md:p-0"
          >
            {linkedReservations.length ? (
              <ul className="divide-y divide-line">
                {linkedReservations.map((reservation) => (
                  <li key={reservation.id} className="flex flex-wrap items-center gap-3 p-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-label font-semibold text-ink">{reservation.recipientName}</p>
                      <p className="text-caption text-muted">{reservation.id} · {reservation.quantity} {reservation.unit} · {reservation.collectionWindow}</p>
                    </div>
                    <StatusBadge status={reservation.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-6 text-center text-small text-muted">No recipients have reserved this donation yet.</p>
            )}
          </SectionCard>
        </div>

        <aside className="space-y-4">
          <SectionCard title="Quantity Summary">
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["Available", donation.availableQty, "#245C45"],
                ["Reserved", donation.reservedQty, "#3B8062"],
                ["Collected", donation.collectedQty, "#A3C9B4"],
              ].map(([label, value, color]) => (
                <div key={String(label)} className="rounded-xl bg-page p-2">
                  <p className="text-caption text-muted">{label}</p>
                  <p className="mt-1 text-h3" style={{ color: String(color) }}>{value}</p>
                  <p className="text-caption text-muted">{donation.unit}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-caption text-muted">
                <span>Still available</span>
                <span>{remaining} of {donation.quantity} {donation.unit}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8EEEA]">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((remaining / Math.max(1, donation.quantity)) * 100)}%` }} />
              </div>
            </div>
            {remaining === 0 && donation.status !== "completed" ? (
              <p className="mt-3 rounded-lg bg-warning/60 p-2.5 text-caption text-[#7A5A0B]">All quantity is held or collected. Cancel a reservation to release food.</p>
            ) : null}
          </SectionCard>

          <SectionCard title="Donation Timeline">
            <Timeline events={timeline} />
          </SectionCard>

          <SectionCard title="Actions">
            <div className="grid gap-2">
              <Button variant="outline" onClick={copyLink}><Share2 className="h-4 w-4" /> Copy shareable link</Button>
              {canEdit ? <Button variant="soft" onClick={openEdit}><Pencil className="h-4 w-4" /> Edit donation details</Button> : null}
              {canCancel ? <Button variant="danger" onClick={() => setCancelOpen(true)}><XCircle className="h-4 w-4" /> Cancel donation</Button> : null}
              {!canCancel && donation.status !== "completed" ? (
                <p className="text-caption text-muted">Cancellation is unavailable while quantity is reserved.</p>
              ) : null}
              <Link href="/donor/add-donation" className={buttonStyles("outline")}><HeartHandshake className="h-4 w-4" /> Add another donation</Link>
            </div>
          </SectionCard>

          <SectionCard title="Donor">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-small font-semibold text-white">NJ</span>
              <div className="min-w-0">
                <p className="truncate text-label font-semibold text-ink">{donation.donor.organization ?? donation.donor.name}</p>
                <p className="truncate text-caption text-muted">{donation.donor.email}</p>
                <p className="text-caption text-muted">{donation.donor.phone}</p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-caption text-muted"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Verified donor account</p>
          </SectionCard>
        </aside>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit donation"
        description={`${donation.id} · update details before collection`}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Food name" htmlFor="edit-name" required className="sm:col-span-2">
            <Input id="edit-name" value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} />
          </Field>
          <Field label="Description" htmlFor="edit-description" required className="sm:col-span-2">
            <Textarea id="edit-description" rows={3} value={draft.description} onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))} />
          </Field>
          <Field label="Total quantity" htmlFor="edit-quantity" required hint={`Reserved + collected: ${donation.reservedQty + donation.collectedQty} ${donation.unit}`}>
            <Input id="edit-quantity" type="number" min={1} value={draft.quantity} onChange={(event) => setDraft((prev) => ({ ...prev, quantity: Number(event.target.value) }))} />
          </Field>
          <Field label="Safe until" htmlFor="edit-expires" required>
            <Input id="edit-expires" type="datetime-local" value={draft.expiresAt} onChange={(event) => setDraft((prev) => ({ ...prev, expiresAt: event.target.value }))} />
          </Field>
          <Field label="Pickup location" htmlFor="edit-location" className="sm:col-span-2">
            <Input id="edit-location" value={draft.pickupLocation} onChange={(event) => setDraft((prev) => ({ ...prev, pickupLocation: event.target.value }))} />
          </Field>
          <Field label="Pickup instructions" htmlFor="edit-instructions" className="sm:col-span-2">
            <Textarea id="edit-instructions" rows={2} value={draft.pickupInstructions} onChange={(event) => setDraft((prev) => ({ ...prev, pickupInstructions: event.target.value }))} />
          </Field>
        </div>
        <p className="mt-3 rounded-lg bg-page p-2.5 text-caption text-muted">
          Changing safety details may require administrator review before new reservations are accepted.
        </p>
      </Modal>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={cancelDonation}
        variant="danger"
        title="Cancel this donation?"
        description="The listing will be removed from recipient matching. This cannot be undone. No quantity is currently reserved."
        confirmLabel="Cancel donation"
        cancelLabel="Keep donation"
        icon={<AlertTriangle className="h-5 w-5 text-[#8C2F27]" />}
      />
    </>
  );
}
