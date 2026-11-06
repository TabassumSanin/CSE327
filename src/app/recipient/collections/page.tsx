"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Copy,
  MapPin,
  MessageSquare,
  Package,
  PackageCheck,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs } from "@/components/ui/tabs";
import { Button, buttonStyles } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { EmptyState } from "@/components/ui/empty-state";
import { currentRecipient } from "@/data/mock";
import { cn, formatDate } from "@/lib/utils";
import type { Reservation } from "@/types";

const tabs = [
  { value: "upcoming", label: "Upcoming" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const issueTypes = ["Quantity mismatch", "Food not as described", "Food safety concern", "Donor unreachable", "Collection point closed", "Other"];

export default function RecipientCollectionsPage() {
  const { donations, reservations, updateReservation, notify } = useApp();
  const [tab, setTab] = useState("upcoming");
  const [completing, setCompleting] = useState<Reservation | null>(null);
  const [collectedQty, setCollectedQty] = useState("");
  const [issueFor, setIssueFor] = useState<Reservation | null>(null);
  const [issueType, setIssueType] = useState(issueTypes[0]);
  const [issueDetails, setIssueDetails] = useState("");
  const [feedbackFor, setFeedbackFor] = useState<Reservation | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const mine = reservations.filter((item) => item.recipientName === currentRecipient.organization);
  const upcoming = mine.filter((item) => item.status === "confirmed");
  const inProgress = mine.filter((item) => item.status === "in-progress");
  const completed = mine.filter((item) => item.status === "completed");
  const received = completed.reduce((sum, item) => sum + (item.collectedQty ?? item.quantity), 0);

  const visible = tab === "upcoming" ? upcoming : tab === "in-progress" ? inProgress : completed;
  const donorFor = (reservation: Reservation) => donations.find((item) => item.id === reservation.donationId)?.donor;

  const startCollection = (reservation: Reservation) => {
    updateReservation(reservation.id, "in-progress");
    setTab("in-progress");
  };

  const openComplete = (reservation: Reservation) => {
    setCompleting(reservation);
    setCollectedQty(String(reservation.quantity));
  };

  const complete = () => {
    if (!completing) return;
    const quantity = Number(collectedQty);
    if (!quantity || quantity <= 0) {
      notify("Enter the quantity you actually collected.", "error");
      return;
    }
    if (quantity > completing.quantity) {
      notify("Collected quantity cannot exceed the reserved quantity.", "error");
      return;
    }
    updateReservation(completing.id, "completed", quantity);
    setCompleting(null);
    setTab("completed");
  };

  const copyAddress = async (reservation: Reservation) => {
    try {
      await navigator.clipboard.writeText(`${reservation.address}\n${reservation.collectionWindow}`);
      notify("Pickup details copied.");
    } catch {
      notify("Unable to copy in this browser.", "error");
    }
  };

  const submitIssue = () => {
    if (!issueFor) return;
    if (issueDetails.trim().length < 10) {
      notify("Describe the issue in at least 10 characters.", "error");
      return;
    }
    notify(`Issue reported for ${issueFor.id}. Support will review it.`, "info");
    setIssueFor(null);
    setIssueType(issueTypes[0]);
    setIssueDetails("");
  };

  const submitFeedback = () => {
    if (!feedbackFor) return;
    notify(`Thank you — ${rating}-star feedback submitted for ${feedbackFor.id}.`);
    setFeedbackFor(null);
    setFeedback("");
    setRating(5);
  };

  const progress = (status: string) => (status === "completed" ? 100 : status === "in-progress" ? 66 : 33);

  return (
    <>
      <PageHeader
        title="Collections"
        description="Coordinate pickups, confirm collected quantities, and report collection issues."
        actions={<Link href="/recipient/reservations" className={buttonStyles("outline")}><CalendarCheck className="h-4 w-4" /> All reservations</Link>}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ready for Pickup" value={upcoming.length} icon={CalendarCheck} tone="amber" hint="Confirmed reservations" />
        <StatCard label="In Progress" value={inProgress.length} icon={Truck} tone="blue" hint="Collection underway" />
        <StatCard label="Completed" value={completed.length} icon={PackageCheck} hint="Confirmed collected" />
        <StatCard label="Food Received" value={`${received} kg`} icon={Package} />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <Tabs
          options={[
            { value: "upcoming", label: "Upcoming", count: upcoming.length },
            { value: "in-progress", label: "In Progress", count: inProgress.length },
            { value: "completed", label: "Completed", count: completed.length },
          ]}
          value={tab}
          onChange={setTab}
        />
        <p className="mt-2 text-caption text-muted">Only the confirmed collected quantity counts as redistributed food.</p>
      </div>

      {visible.length ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {visible.map((reservation) => {
            const donor = donorFor(reservation);
            const required = [
              "Bring clean containers or crates",
              "Arrive within the collection window",
              "Inspect packaging and temperature",
              "Confirm the collected quantity",
            ];
            const completedChecks = required.filter((item) => checked[`${reservation.id}-${item}`]).length;
            return (
              <article key={reservation.id} className="card overflow-hidden">
                <div className="border-b border-line bg-page/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-h3 text-ink">{reservation.foodName}</p>
                      <p className="truncate text-caption text-muted">{reservation.donorName} · {reservation.id}</p>
                    </div>
                    <StatusBadge status={reservation.status} />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {["Confirmed", "In progress", "Collected"].map((step, index) => {
                      const active = progress(reservation.status) >= (index + 1) * 33;
                      return (
                        <div key={step} className="flex flex-1 items-center gap-2">
                          <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-semibold", active ? "bg-primary text-white" : "bg-line text-muted")}>
                            {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                          </span>
                          <span className={cn("hidden text-caption sm:block", active ? "text-primary" : "text-muted")}>{step}</span>
                          {index < 2 ? <span className={cn("h-px flex-1", active ? "bg-secondary/50" : "bg-line")} /> : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-caption">
                    <div className="rounded-lg bg-page p-2.5">
                      <p className="text-muted">Quantity</p>
                      <p className="mt-0.5 font-semibold text-ink">{reservation.quantity} {reservation.unit}</p>
                    </div>
                    <div className="rounded-lg bg-page p-2.5">
                      <p className="text-muted">Collected</p>
                      <p className="mt-0.5 font-semibold text-ink">{reservation.collectedQty ? `${reservation.collectedQty} ${reservation.unit}` : "Pending"}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <div className="min-w-0">
                      <p className="text-caption font-medium text-ink">{reservation.collectionDate ? formatDate(reservation.collectionDate) : "To be coordinated"} · {reservation.collectionWindow}</p>
                      <p className="text-caption text-muted">{reservation.transport}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <div className="min-w-0 flex-1">
                      <p className="text-caption font-medium text-ink">{reservation.address}</p>
                      <p className="mt-0.5 line-clamp-2 text-caption text-muted">{reservation.instructions}</p>
                    </div>
                    <button type="button" onClick={() => copyAddress(reservation)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line text-muted transition hover:text-primary" aria-label="Copy pickup address">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {tab !== "completed" ? (
                    <div className="mt-3 rounded-xl border border-line p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="flex items-center gap-1.5 text-caption font-semibold text-ink"><ClipboardCheck className="h-3.5 w-3.5 text-secondary" /> Collection checklist</p>
                        <span className="text-caption text-muted">{completedChecks}/{required.length}</span>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {required.map((item) => {
                          const key = `${reservation.id}-${item}`;
                          return (
                            <li key={item}>
                              <label className="flex items-start gap-2 text-caption text-muted">
                                <input
                                  type="checkbox"
                                  checked={Boolean(checked[key])}
                                  onChange={(event) => setChecked((prev) => ({ ...prev, [key]: event.target.checked }))}
                                  className="mt-0.5 h-3.5 w-3.5 rounded accent-[#245C45]"
                                />
                                {item}
                              </label>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : null}

                  {donor ? (
                    <p className="mt-3 text-caption text-muted">Contact: {donor.name} · {donor.phone}</p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
                    {reservation.status === "confirmed" ? (
                      <>
                        <Button size="sm" onClick={() => startCollection(reservation)}><Truck className="h-3.5 w-3.5" /> Start collection</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIssueFor(reservation); setIssueDetails(""); }}><AlertTriangle className="h-3.5 w-3.5" /> Report issue</Button>
                      </>
                    ) : null}
                    {reservation.status === "in-progress" ? (
                      <>
                        <Button size="sm" onClick={() => openComplete(reservation)}><PackageCheck className="h-3.5 w-3.5" /> Confirm collection</Button>
                        <Button size="sm" variant="outline" onClick={() => { setIssueFor(reservation); setIssueDetails(""); }}><AlertTriangle className="h-3.5 w-3.5" /> Report issue</Button>
                      </>
                    ) : null}
                    {reservation.status === "completed" ? (
                      <>
                        <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-success px-3 text-caption font-semibold text-[#1D6A3E]"><CheckCircle2 className="h-3.5 w-3.5" /> Collected {reservation.collectedQty} {reservation.unit}</span>
                        <Button size="sm" variant="outline" onClick={() => { setFeedbackFor(reservation); setFeedback(""); setRating(5); }}><Star className="h-3.5 w-3.5" /> Leave feedback</Button>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-4">
          <EmptyState
            icon={tab === "completed" ? PackageCheck : CalendarCheck}
            title={tab === "upcoming" ? "No confirmed collections" : tab === "in-progress" ? "No collections in progress" : "No completed collections yet"}
            description={
              tab === "upcoming"
                ? "Confirm a reservation first and its collection details will appear here."
                : tab === "in-progress"
                ? "Start a collection from the Upcoming tab when you are on the way."
                : "Completed and confirmed collections will appear here."
            }
            action={<Link href="/recipient/reservations" className={buttonStyles()}>View reservations</Link>}
          />
        </div>
      )}

      <SectionCard className="mt-4" title="Collection safety reminders">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Check the food", "Inspect packaging, labels, and temperature before accepting food."],
            ["Confirm the quantity", "Enter the actual collected amount; only that quantity counts as your impact."],
            ["Report concerns", "Use Report issue for safety concerns, mismatches, or an unreachable donor."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-xl bg-page p-3">
              <p className="text-label font-semibold text-ink">{title}</p>
              <p className="mt-1 text-caption text-muted">{description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <Modal
        open={Boolean(completing)}
        onClose={() => setCompleting(null)}
        title="Confirm collected quantity"
        description={completing ? `${completing.id} · ${completing.foodName}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button onClick={complete}><CheckCircle2 className="h-4 w-4" /> Confirm collection</Button>
          </>
        }
      >
        {completing ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-page p-3 text-caption text-muted">
              Reserved: <strong className="text-ink">{completing.quantity} {completing.unit}</strong> · Donor: <strong className="text-ink">{completing.donorName}</strong>
            </div>
            <Field label={`Collected quantity (${completing.unit})`} htmlFor="collection-qty" required hint="Enter the actual quantity received.">
              <Input id="collection-qty" type="number" min={1} max={completing.quantity} value={collectedQty} onChange={(event) => setCollectedQty(event.target.value)} />
            </Field>
            <p className="rounded-lg bg-lightgreen p-2.5 text-caption text-muted">
              Only confirmed collected quantities count toward redistribution. Any difference is recorded and released.
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(issueFor)}
        onClose={() => setIssueFor(null)}
        title="Report collection issue"
        description={issueFor ? `${issueFor.id} · ${issueFor.foodName}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setIssueFor(null)}>Cancel</Button>
            <Button onClick={submitIssue}><MessageSquare className="h-4 w-4" /> Submit report</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Field label="Issue type" htmlFor="issue-type" required>
            <Select id="issue-type" value={issueType} onChange={(event) => setIssueType(event.target.value)}>
              {issueTypes.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
          </Field>
          <Field label="Describe the issue" htmlFor="issue-details" required hint="At least 10 characters. Administrators will review the report.">
            <Textarea id="issue-details" rows={4} value={issueDetails} onChange={(event) => setIssueDetails(event.target.value)} placeholder="What happened at the collection point?" />
          </Field>
          <p className="flex items-start gap-2 rounded-lg border border-[#F0DFA8] bg-warning/60 p-2.5 text-caption text-[#7A5A0B]">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> If food appears unsafe, do not accept it. Record the concern here and discard unsafe food.
          </p>
        </div>
      </Modal>

      <Modal
        open={Boolean(feedbackFor)}
        onClose={() => setFeedbackFor(null)}
        title="Leave feedback"
        description={feedbackFor ? `${feedbackFor.id} · ${feedbackFor.donorName}` : ""}
        footer={
          <>
            <Button variant="outline" onClick={() => setFeedbackFor(null)}>Cancel</Button>
            <Button onClick={submitFeedback}>Submit feedback</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <p className="label">Your rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} className="rounded p-1">
                  <Star className={cn("h-6 w-6", value <= rating ? "fill-[#D9A441] text-[#D9A441]" : "text-line")} />
                </button>
              ))}
            </div>
          </div>
          <Field label="Comments (optional)" htmlFor="feedback-comments">
            <Textarea id="feedback-comments" rows={3} value={feedback} onChange={(event) => setFeedback(event.target.value)} placeholder="How was the collection and food quality?" />
          </Field>
          <p className="flex items-center gap-1.5 text-caption text-muted"><XCircle className="h-3.5 w-3.5" /> Feedback does not affect your eligibility.</p>
        </div>
      </Modal>
    </>
  );
}
