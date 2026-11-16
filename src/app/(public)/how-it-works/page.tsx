import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  ClipboardCheck,
  HeartHandshake,
  PackageCheck,
  Sparkles,
  Truck,
  UserCheck,
} from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import {
  ProcessTimeline,
  type ProcessStep,
} from "@/components/how-it-works/process-timeline";
import {
  ReservationStepper,
  type ReservationStage,
} from "@/components/how-it-works/reservation-stepper";

export const metadata = { title: "How It Works | Smart Food Exchange" };

const steps: ProcessStep[] = [
  {
    icon: HeartHandshake,
    stage: "Donation",
    title: "Donors share surplus food",
    description:
      "A donor creates a donation with food details, quantity, preparation and expiry times, storage conditions, allergens, photos, and pickup instructions.",
    details: ["Food and quantity details", "Photos and storage information", "Pickup instructions"],
  },
  {
    icon: ClipboardCheck,
    stage: "Safety",
    title: "Platform verifies food information",
    description:
      "Automated checks compare the donation against food safety rules for expiry, storage temperature, packaging, and allergen completeness.",
    details: ["Expiry and preparation checks", "Temperature and storage checks", "Flagged items require manual review"],
  },
  {
    icon: Sparkles,
    stage: "Matching",
    title: "AI matches eligible recipients",
    description:
      "Approved donations are matched only with eligible recipients. Urgency is prioritised, followed by match score, and a provisional reservation is created.",
    details: ["Eligibility filtering", "Urgency-first prioritisation", "Provisional reservation and notification"],
  },
  {
    icon: Truck,
    stage: "Collection",
    title: "Recipients confirm and collect",
    description:
      "Recipients confirm or decline. Confirmed reservations move to transport coordination. After collection, recipients confirm the actual quantity collected.",
    details: ["Recipient confirmation window", "Transport coordination", "Collected quantity confirmation"],
  },
];

const reservationStages: ReservationStage[] = [
  {
    icon: Sparkles,
    status: "Provisional",
    title: "Provisional reservation",
    description: "AI places a time-limited hold for a selected eligible recipient.",
  },
  {
    icon: BellRing,
    status: "Awaiting reply",
    title: "Awaiting confirmation",
    description: "The recipient confirms or declines within the confirmation window.",
  },
  {
    icon: Truck,
    status: "In progress",
    title: "Confirmed & in progress",
    description: "Transport is coordinated and collection begins.",
  },
  {
    icon: PackageCheck,
    status: "Completed",
    title: "Completed",
    description:
      "The recipient confirms the collected quantity, which counts as redistribution.",
  },
];

const roles = [
  {
    icon: UserCheck,
    title: "For donors",
    description:
      "Share surplus food, track verification, follow reservations, and measure your contribution.",
  },
  {
    icon: HeartHandshake,
    title: "For recipients",
    description:
      "Browse eligible food, receive AI matches, manage reservations, and confirm collections.",
  },
  {
    icon: ClipboardCheck,
    title: "For administrators",
    description:
      "Review flagged food, approve accounts, monitor reservations, and export impact reports.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-line bg-white">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="text-caption font-semibold text-secondary">How it works</p>
            <h1 className="mt-3 text-[36px] font-bold leading-[1.1] tracking-tight text-ink sm:text-[46px] lg:text-[52px]">
              From surplus food to a confirmed collection.
            </h1>
            <p className="mt-4 max-w-2xl text-body text-muted">
              Every donation follows a clear verification and matching process. Recipients only see
              eligible, available food, and only confirmed collected quantities count as redistributed.
            </p>
            <Link href="/register" className={buttonStyles("primary", "lg", "mt-7")}>
              Create an account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol
            className="mt-10 grid gap-3 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4"
            aria-label="Process stages"
          >
            {steps.map((step, index) => (
              <li key={step.stage} className="flex items-center gap-3">
                <span className="text-caption font-semibold text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-label font-medium text-ink">{step.stage}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-9 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-caption font-semibold text-secondary">The donation journey</p>
            <h2 className="mt-1 text-h1 text-ink">Four checks before a collection</h2>
            <p className="mt-2 text-small text-muted">
              Each stage keeps food safety, recipient eligibility, and collection status visible to
              everyone involved.
            </p>
          </div>

          <ProcessTimeline steps={steps} />
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="text-caption font-semibold text-secondary">Reservation flow</p>
            <h2 className="mt-1 text-h1 text-ink">A hold is not a guarantee</h2>
            <p className="mt-2 text-small text-muted">
              The platform tracks reservations independently from donations. Quantities held by active
              provisional reservations are excluded from available stock.
            </p>
          </div>

          <ReservationStepper stages={reservationStages} className="mt-8" />

          <div className="mt-6 rounded-2xl border border-[#F0DFA8] bg-warning/50 p-4 text-small text-[#6F530C] md:p-5">
            <strong className="font-semibold text-[#7A5A0B]">Declined or expired?</strong> The held
            quantity is released for future eligible matching if the donation is still valid. A single
            donation can be split across multiple recipients, each tracked independently.
          </div>
        </div>
      </section>

      <section className="container-page py-12 md:py-16">
        <div className="max-w-2xl">
          <p className="text-caption font-semibold text-secondary">Responsibilities</p>
          <h2 className="mt-1 text-h1 text-ink">Who does what</h2>
          <p className="mt-2 text-small text-muted">
            Each participant has a clear role in keeping the exchange safe, fair, and accountable.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-card">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className={`grid gap-3 px-5 py-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-start ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-lightgreen text-primary">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <h3 className="text-h3 text-ink">{role.title}</h3>
                </div>
                <p className="text-small text-muted">{role.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
