"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  ImageIcon,
  Info,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Snowflake,
  Thermometer,
  User,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import type { Donation } from "@/types";
import { categorySlug, formatDateTime } from "@/lib/utils";

type Decision = { donation: Donation; action: "approve" | "reject" } | null;

export default function FoodReviewsPage() {
  const { donations, updateDonationStatus, updateDonation, notify } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [tab, setTab] = useState("needs");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [detail, setDetail] = useState<Donation | null>(null);
  const [decision, setDecision] = useState<Decision>(null);
  const [infoRequest, setInfoRequest] = useState<Donation | null>(null);
  const [infoMessage, setInfoMessage] = useState("");

  const pending = donations.filter((item) => item.status === "pending-review");
  const flagged = donations.filter((item) => item.verification === "needs-review");
  const rejected = donations.filter((item) => item.status === "rejected");
  const approvedToday = donations.filter(
    (item) => item.verification === "verified" && ["available", "reserved", "completed"].includes(item.status)
  ).length;

  const list = useMemo(() => {
    const base =
      tab === "needs"
        ? pending
        : tab === "approved"
        ? donations.filter((item) => item.verification === "verified" && item.status !== "expired")
        : tab === "flagged"
        ? flagged
        : rejected;
    return base.filter((item) => {
      const matchesSearch = [item.name, item.id, item.donor.organization ?? "", item.donor.name]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "all" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [tab, pending, donations, flagged, rejected, search, category]);

  const confirmDecision = () => {
    if (!decision) return;
    const note = notes[decision.donation.id];
    if (decision.action === "approve") {
      updateDonation(decision.donation.id, {
        status: "available",
        verification: "verified",
        availableQty:
          decision.donation.availableQty > 0 ? decision.donation.availableQty : decision.donation.quantity,
        flags: [],
        reviewNotes: note || "Approved after manual review.",
      });
      notify(`${decision.donation.id} approved and released for matching.`);
    } else {
      updateDonationStatus(decision.donation.id, "rejected", note || "Rejected after manual safety review.");
      notify(`${decision.donation.id} rejected. Donor notified.`, "info");
    }
    setDecision(null);
  };

  const submitInfoRequest = () => {
    if (!infoRequest) return;
    if (infoMessage.trim().length < 10) {
      notify("Please write a clear request for more information.", "error");
      return;
    }
    updateDonation(infoRequest.id, { reviewNotes: `More information requested: ${infoMessage}` });
    notify(`Information request sent to ${infoRequest.donor.organization ?? infoRequest.donor.name}.`, "info");
    setInfoRequest(null);
    setInfoMessage("");
  };

  return (
    <>
      <PageHeader
        title="Food Reviews"
        description="Review flagged donations before they become available for recipient matching."
        actions={
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#F0DFA8] bg-warning/60 px-3 py-2 text-caption font-medium text-[#7A5A0B]">
            <ShieldCheck className="h-4 w-4" /> Manual review required for flagged food
          </span>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pending Reviews" value={pending.length} icon={ClipboardCheck} tone="amber" />
        <StatCard label="Approved Today" value={approvedToday} icon={CheckCircle2} />
        <StatCard label="Flagged Donations" value={flagged.length} icon={AlertTriangle} tone="rose" />
        <StatCard label="Rejected Donations" value={rejected.length} icon={Ban} tone="rose" />
      </div>

      <div className="mt-4 rounded-2xl border border-[#C6DAF4] bg-info/70 p-3.5 text-caption text-[#23548C]">
        <span className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Automated verification does not guarantee food safety. Always inspect photos, storage,
          temperature, and allergen information before approving a flagged donation.
        </span>
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: "needs", label: "Pending Review", count: pending.length },
            { value: "approved", label: "Approved", count: approvedToday },
            { value: "flagged", label: "Flagged", count: flagged.length },
            { value: "rejected", label: "Rejected", count: rejected.length },
          ]}
          className="mb-3"
        />
        <div className="grid gap-2 md:grid-cols-[1fr_auto]">
          <SearchField value={search} onChange={setSearch} placeholder="Search food, donation ID, or donor..." ariaLabel="Search food reviews" />
          <Select value={category} onChange={(event) => setCategory(event.target.value)} className="md:w-52" aria-label="Filter by category">
            <option value="all">All categories</option>
            <option>Prepared Food</option>
            <option>Packaged Food</option>
            <option>Produce</option>
            <option>Bakery</option>
            <option>Refrigerated</option>
            <option>Frozen</option>
          </Select>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No donations in this queue" description="Try another tab, category, or search term." icon={Search} />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {list.map((donation) => (
            <article key={donation.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                <div className="min-w-0">
                  <p className="text-caption text-muted">{donation.id}</p>
                  <h2 className="truncate text-h3 text-ink">{donation.name}</h2>
                </div>
                <StatusBadge status={donation.status} />
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-[140px_1fr]">
                <div>
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-lightgreen">
                    <Image src={`/images/food-${categorySlug(donation.category)}.svg`} alt="" fill className="object-cover" sizes="140px" />
                    <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-medium text-ink">
                      {donation.photos} photos
                    </span>
                  </div>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {[0, 1, 2].map((index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setDetail(donation)}
                        className="grid h-9 place-items-center rounded-md border border-line bg-page text-caption text-muted hover:border-secondary"
                        aria-label={`View photo ${index + 1}`}
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-caption text-muted">
                    <User className="h-3.5 w-3.5" /> {donation.donor.organization ?? donation.donor.name} · {donation.donor.email}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-caption">
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="text-muted">Category</p>
                      <p className="font-medium text-ink">{donation.category}</p>
                    </div>
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="text-muted">Quantity</p>
                      <p className="font-medium text-ink">{donation.quantity} {donation.unit}</p>
                    </div>
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="text-muted">Prepared</p>
                      <p className="font-medium text-ink">{formatDateTime(donation.preparedAt)}</p>
                    </div>
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="text-muted">Expires</p>
                      <p className="font-medium text-ink">{formatDateTime(donation.expiresAt)}</p>
                    </div>
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="flex items-center gap-1 text-muted"><Snowflake className="h-3 w-3" /> Storage</p>
                      <p className="font-medium text-ink">{donation.storage}</p>
                    </div>
                    <div className="rounded-lg bg-page px-2.5 py-2">
                      <p className="flex items-center gap-1 text-muted"><Thermometer className="h-3 w-3" /> Temperature</p>
                      <p className="font-medium text-ink">{donation.temperature ?? "Not applicable"}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-caption text-muted">
                    <span className="font-medium text-ink">Allergens:</span>{" "}
                    {donation.allergens.length ? donation.allergens.join(", ") : "None declared"}
                  </p>
                  <p className="mt-1 flex items-start gap-1 text-caption text-muted">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {donation.pickupLocation}
                  </p>
                </div>
              </div>

              <div className="mx-4 mb-4 rounded-xl border border-line bg-page/60 p-3">
                <p className="flex items-center gap-1.5 text-label font-semibold text-ink">
                  <ClipboardCheck className="h-4 w-4 text-secondary" /> Automated verification
                </p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {[
                    { label: "Expiry window", ok: donation.expiresAt > "2026-11-06" },
                    { label: "Preparation date", ok: true },
                    { label: "Storage conditions provided", ok: Boolean(donation.storage) },
                    { label: "Temperature logged", ok: Boolean(donation.temperature) || !["Frozen", "Refrigerated"].includes(donation.category) },
                    { label: "Allergen declaration", ok: donation.allergens.length > 0 },
                    { label: "Packaging condition", ok: !donation.flags.some((flag) => flag.toLowerCase().includes("packaging")) },
                  ].map((check) => (
                    <li key={check.label} className={`flex items-center gap-1.5 text-caption ${check.ok ? "text-muted" : "text-[#8C2F27]"}`}>
                      {check.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-[#1D6A3E]" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {check.label}: {check.ok ? "passed" : "flagged"}
                    </li>
                  ))}
                </ul>
                {donation.flags.length > 0 ? (
                  <div className="mt-2 rounded-lg border border-[#F2C5C1] bg-error px-2.5 py-2 text-caption text-[#8C2F27]">
                    <p className="font-semibold">Flagged reasons</p>
                    <ul className="mt-0.5 list-disc pl-4">
                      {donation.flags.map((flag) => <li key={flag}>{flag}</li>)}
                    </ul>
                  </div>
                ) : null}
                {donation.reviewNotes ? (
                  <p className="mt-2 text-caption text-muted"><span className="font-medium text-ink">Review notes:</span> {donation.reviewNotes}</p>
                ) : null}
              </div>

              <div className="border-t border-line p-4">
                <label className="label" htmlFor={`notes-${donation.id}`}>Administrator review notes</label>
                <Textarea
                  id={`notes-${donation.id}`}
                  rows={2}
                  value={notes[donation.id] ?? donation.reviewNotes ?? ""}
                  onChange={(event) => setNotes((prev) => ({ ...prev, [donation.id]: event.target.value }))}
                  placeholder="Add notes for the audit trail..."
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setDetail(donation)}>
                    <Eye className="h-3.5 w-3.5" /> Full details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setInfoRequest(donation); setInfoMessage(""); }}>
                    <MessageSquare className="h-3.5 w-3.5" /> Request info
                  </Button>
                  {donation.status !== "rejected" ? (
                    <>
                      <Button size="sm" variant="danger" onClick={() => setDecision({ donation, action: "reject" })}>
                        <Ban className="h-3.5 w-3.5" /> Reject
                      </Button>
                      <Button size="sm" className="ml-auto" onClick={() => setDecision({ donation, action: "approve" })}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve donation
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.name ?? "Donation details"}
        description={detail?.id}
        size="lg"
        footer={<Button variant="outline" onClick={() => setDetail(null)}>Close</Button>}
      >
        {detail ? (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-xl bg-lightgreen">
                  <Image src={`/images/food-${categorySlug(detail.category)}.svg`} alt={`${detail.name} photo ${index + 1}`} fill className="object-cover" sizes="200px" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-small text-muted">{detail.description}</p>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              {[
                ["Donor", detail.donor.organization ?? detail.donor.name],
                ["Donor contact", `${detail.donor.email} · ${detail.donor.phone}`],
                ["Category", detail.category],
                ["Quantity", `${detail.quantity} ${detail.unit}`],
                ["Prepared", formatDateTime(detail.preparedAt)],
                ["Expires", formatDateTime(detail.expiresAt)],
                ["Storage", detail.storage],
                ["Temperature", detail.temperature ?? "Not applicable"],
                ["Allergens", detail.allergens.length ? detail.allergens.join(", ") : "None declared"],
                ["Pickup location", detail.pickupLocation],
                ["Pickup instructions", detail.pickupInstructions],
                ["Transportation", detail.transportation],
              ].map(([label, value]) => (
                <div key={label} className="border-b border-line py-2">
                  <dt className="text-caption text-muted">{label}</dt>
                  <dd className="text-small font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-page p-3 text-caption text-muted">
              <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
              Verification status: <strong className="text-ink">{detail.verification.replace("-", " ")}</strong>. Automated checks are advisory only.
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(infoRequest)}
        onClose={() => setInfoRequest(null)}
        title="Request more information"
        description={infoRequest ? `${infoRequest.id} · ${infoRequest.name}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setInfoRequest(null)}>Cancel</Button>
            <Button onClick={submitInfoRequest}>Send request</Button>
          </>
        }
      >
        <label className="label" htmlFor="info-message">Message to donor</label>
        <textarea
          id="info-message"
          className="field min-h-[110px]"
          value={infoMessage}
          onChange={(event) => setInfoMessage(event.target.value)}
          placeholder="Explain what information or documentation is needed..."
        />
        <p className="mt-1 text-caption text-muted">The donation remains in the review queue until the donor responds.</p>
      </Modal>

      <ConfirmDialog
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={confirmDecision}
        title={decision?.action === "approve" ? "Approve donation" : "Reject donation"}
        description={
          decision
            ? decision.action === "approve"
              ? `Approve ${decision.donation.name} (${decision.donation.quantity} ${decision.donation.unit})? It will become available for eligible recipient matching.`
              : `Reject ${decision.donation.name}? It will no longer be available for matching and the donor will be notified.`
            : ""
        }
        confirmLabel={decision?.action === "approve" ? "Approve donation" : "Reject donation"}
        variant={decision?.action === "approve" ? "primary" : "danger"}
      />
    </>
  );
}
