import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  ClipboardCheck,
  HeartHandshake,
  PackageCheck,
  Sparkles,
  Truck,
  UserCheck,
} from "lucide-react";

export const metadata = { title: "How It Works | Smart Food Exchange" };

const steps = [
  {
    icon: HeartHandshake,
    title: "Donors share surplus food",
    description:
      "A donor creates a donation with food details, quantity, preparation and expiry times, storage conditions, allergens, photos, and pickup instructions.",
    details: ["Food and quantity details", "Photos and storage information", "Pickup instructions"],
  },
  {
    icon: ClipboardCheck,
    title: "Platform verifies food information",
    description:
      "Automated checks compare the donation against food safety rules for expiry, storage temperature, packaging, and allergen completeness.",
    details: ["Expiry and preparation checks", "Temperature and storage checks", "Flagged items require manual review"],
  },
  {
    icon: Sparkles,
    title: "AI matches eligible recipients",
    description:
      "Approved donations are matched only with eligible recipients. Urgency is prioritised, followed by match score, and a provisional reservation is created.",
    details: ["Eligibility filtering", "Urgency-first prioritisation", "Provisional reservation and notification"],
  },
  {
    icon: Truck,
    title: "Recipients confirm and collect",
    description:
      "Recipients confirm or decline. Confirmed reservations move to transport coordination. After collection, recipients confirm the actual quantity collected.",
    details: ["Recipient confirmation window", "Transport coordination", "Collected quantity confirmation"],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="hero-glow border-b border-line">
        <div className="container-page py-10 md:py-16">
          <span className="text-caption font-semibold uppercase tracking-wider text-secondary">How it works</span>
          <h1 className="mt-2 max-w-3xl text-[32px] font-bold leading-tight text-ink md:text-[44px]">
            From surplus food to a confirmed collection.
          </h1>
          <p className="mt-3 max-w-2xl text-body text-muted">
            Every donation follows a clear verification and matching process. Recipients only see
            eligible, available food, and only confirmed collected quantities count as redistributed.
          </p>
          <Link href="/register" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-btn text-white hover:bg-[#1d4c39]">
            Create an account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="card relative p-5">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-lightgreen text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[28px] font-bold leading-none text-lightgreen">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-3 text-h3 text-ink">{step.title}</h2>
                <p className="mt-1.5 text-small text-muted">{step.description}</p>
                <ul className="mt-3 space-y-1.5 border-t border-line pt-3">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-1.5 text-caption text-muted">
                      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" /> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page py-10 md:py-14">
          <div className="max-w-2xl">
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary">Reservation flow</span>
            <h2 className="mt-1 text-h1 text-ink">A hold is not a guarantee</h2>
            <p className="mt-1 text-small text-muted">
              The platform tracks reservations independently from donations. Quantities held by active
              provisional reservations are excluded from available stock.
            </p>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Provisional reservation", text: "AI places a time-limited hold for a selected eligible recipient.", icon: Sparkles },
              { title: "Awaiting confirmation", text: "The recipient confirms or declines within the confirmation window.", icon: BellRing },
              { title: "Confirmed & in progress", text: "Transport is coordinated and collection begins.", icon: Truck },
              { title: "Completed", text: "The recipient confirms the collected quantity, which counts as redistribution.", icon: PackageCheck },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-2xl border border-line bg-page/60 p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-label font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-caption text-muted">{item.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-2xl border border-[#C6DAF4] bg-info/70 p-4 text-small text-[#23548C]">
            <strong className="font-semibold">Declined or expired?</strong> The held quantity is released
            for future eligible matching if the donation is still valid. A single donation can be split
            across multiple recipients, each tracked independently.
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card p-5">
            <UserCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-h3 text-ink">For donors</h2>
            <p className="mt-1.5 text-small text-muted">
              Share surplus food, track verification, follow reservations, and measure your contribution.
            </p>
            <Link href="/donor/dashboard" className="mt-3 inline-flex items-center gap-1.5 text-label font-semibold text-primary hover:underline">
              Open donor dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="card p-5">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-h3 text-ink">For recipients</h2>
            <p className="mt-1.5 text-small text-muted">
              Browse eligible food, receive AI matches, manage reservations, and confirm collections.
            </p>
            <Link href="/recipient/dashboard" className="mt-3 inline-flex items-center gap-1.5 text-label font-semibold text-primary hover:underline">
              Open recipient dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="card p-5">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-3 text-h3 text-ink">For administrators</h2>
            <p className="mt-1.5 text-small text-muted">
              Review flagged food, approve accounts, monitor reservations, and export impact reports.
            </p>
            <Link href="/admin/dashboard" className="mt-3 inline-flex items-center gap-1.5 text-label font-semibold text-primary hover:underline">
              Open admin dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
