"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  ThermometerSnowflake,
  Truck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { StatusBadge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { InfoRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";
import { currentRecipient } from "@/data/mock";
import { categorySlug, daysUntil, formatDate, formatDateTime } from "@/lib/utils";

export default function RecipientFoodDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { donations, reserveFood, notify } = useApp();
  const donation = donations.find((item) => item.id === params.id);
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  if (!donation || donation.status !== "available" || donation.availableQty <= 0) {
    return (
      <EmptyState
        icon={Package}
        title="This food is no longer available"
        description="The donation may be fully reserved, expired, or under review. Browse other verified food nearby."
        action={<Link href="/recipient/available-food" className={buttonStyles()}>Browse available food</Link>}
      />
    );
  }

  const days = daysUntil(donation.expiresAt);
  const alternatives = donations
    .filter((item) => item.id !== donation.id && item.status === "available" && item.availableQty > 0)
    .slice(0, 3);

  const reserve = () => {
    setError("");
    const amount = Number(quantity);
    if (!amount || amount <= 0) {
      setError("Enter a quantity greater than zero.");
      return;
    }
    if (amount > donation.availableQty) {
      setError(`Only ${donation.availableQty} ${donation.unit} is available.`);
      return;
    }
    const reservation = reserveFood(donation.id, amount);
    if (reservation) {
      notify(`Provisional hold created for ${amount} ${donation.unit}. Confirm it to keep the allocation.`);
      router.push("/recipient/reservations");
    }
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Available Food", href: "/recipient/available-food" }, { label: donation.name }]} />

      <PageHeader
        className="mt-2"
        eyebrow={donation.id}
        title={donation.name}
        description={`${donation.category} · from ${donation.donor.organization ?? donation.donor.name}`}
        actions={
          <Link href="/recipient/available-food" className={buttonStyles("outline")}>
            <ArrowLeft className="h-4 w-4" /> Back to food
          </Link>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StatusBadge status={donation.verification} />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-caption text-muted">
          <CalendarClock className="h-3.5 w-3.5" />
          {days < 0 ? "Expired" : days === 0 ? "Expires today" : days === 1 ? "1 day left" : `${days} days left`}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lightgreen px-2.5 py-0.5 text-caption font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" /> 92% match score
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-0.5 text-caption text-muted">
          <MapPin className="h-3.5 w-3.5" /> {donation.pickupLocation.split(",").slice(-2).join(",").trim()}
        </span>
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
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-t from-[#1B2C23]/70 to-transparent p-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-caption font-medium text-ink">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Automatically verified
                </span>
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-caption text-muted">
                  {donation.availableQty} {donation.unit} available
                </span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="About this food">
            <p className="text-small leading-relaxed text-muted">{donation.description}</p>
            <dl className="mt-4 grid gap-x-6 sm:grid-cols-2">
              <InfoRow label="Category" value={donation.category} />
              <InfoRow label="Available quantity" value={`${donation.availableQty} ${donation.unit}`} />
              <InfoRow label="Prepared" value={formatDateTime(donation.preparedAt)} />
              <InfoRow label="Safe until" value={formatDateTime(donation.expiresAt)} />
              <InfoRow label="Storage" value={donation.storage} />
              <InfoRow label="Temperature" value={donation.temperature ?? "Not applicable"} />
              <InfoRow label="Allergens" value={donation.allergens.length ? donation.allergens.join(", ") : "None declared"} />
              <InfoRow label="Transportation" value={donation.transportation} />
            </dl>
          </SectionCard>

          <SectionCard title="Verification & Food Safety">
            <div className="flex items-start gap-3 rounded-xl bg-success p-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1D6A3E]" />
              <div>
                <p className="text-label font-semibold text-ink">Passed automated verification</p>
                <p className="mt-0.5 text-caption text-muted">
                  Expiry window, storage details, and allergen declarations passed advisory checks. Automated checks do not guarantee food safety.
                </p>
              </div>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <p className="flex items-center gap-1.5 rounded-lg bg-page p-2.5 text-caption text-muted"><ThermometerSnowflake className="h-3.5 w-3.5 text-secondary" /> {donation.storage}</p>
              <p className="flex items-center gap-1.5 rounded-lg bg-page p-2.5 text-caption text-muted"><Clock className="h-3.5 w-3.5 text-secondary" /> Best collected {formatDate(donation.expiresAt)}</p>
            </div>
            {donation.allergens.length ? (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-[#F0DFA8] bg-warning/60 p-2.5 text-caption text-[#7A5A0B]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Declared allergens: {donation.allergens.join(", ")}. Check suitability for your recipients.
              </p>
            ) : null}
          </SectionCard>

          <SectionCard title="Pickup Location">
            <div className="relative overflow-hidden rounded-xl border border-line bg-lightgreen">
              <div className="leaf-grid h-36 w-full opacity-80" />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-xl bg-white/95 px-4 py-3 text-center shadow-soft">
                  <MapPin className="mx-auto h-5 w-5 text-primary" />
                  <p className="mt-1 text-label font-semibold text-ink">{donation.pickupLocation}</p>
                  <p className="text-caption text-muted">Approximate area shown for demo</p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-label font-semibold text-ink">Pickup instructions</p>
              <p className="mt-1 text-small text-muted">{donation.pickupInstructions}</p>
              <p className="mt-2 flex items-center gap-1.5 text-caption text-muted"><Truck className="h-4 w-4 text-secondary" /> {donation.transportation}</p>
            </div>
          </SectionCard>

          <SectionCard title="Donor">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-h3 font-semibold text-white">
                {(donation.donor.organization ?? donation.donor.name).split(" ").map((part) => part[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-label font-semibold text-ink">{donation.donor.organization ?? donation.donor.name}</p>
                <p className="text-caption text-muted">{donation.donor.name} · Verified donor</p>
              </div>
              <StatusBadge status="verified" />
            </div>
            <div className="mt-3 rounded-xl border border-dashed border-line bg-page p-3">
              <p className="flex items-center gap-1.5 text-caption font-semibold text-ink"><Phone className="h-3.5 w-3.5 text-secondary" /> Contact details protected</p>
              <p className="mt-1 text-caption text-muted">The donor's phone number and exact pickup contact are shared after your reservation is confirmed.</p>
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <SectionCard title="Reserve this food" description="Create a provisional hold">
            <div className="rounded-xl bg-lightgreen p-3">
              <p className="text-caption text-muted">Available now</p>
              <p className="mt-1 text-h1 text-primary">{donation.availableQty} <span className="text-h3 font-medium">{donation.unit}</span></p>
              <p className="mt-0.5 text-caption text-muted">Expires {formatDate(donation.expiresAt)}</p>
            </div>
            <div className="mt-3">
              <Field label={`Quantity (${donation.unit})`} htmlFor="food-quantity" required error={error} hint="The quantity is held while you confirm.">
                <Input
                  id="food-quantity"
                  type="number"
                  min={1}
                  max={donation.availableQty}
                  value={quantity}
                  onChange={(event) => { setQuantity(event.target.value); setError(""); }}
                  placeholder={`1 – ${donation.availableQty}`}
                />
              </Field>
              <div className="mt-2 flex flex-wrap gap-2">
                {[5, 10, donation.availableQty].filter((value, index, array) => value > 0 && value <= donation.availableQty && array.indexOf(value) === index).map((value) => (
                  <Button key={value} size="sm" variant="outline" onClick={() => { setQuantity(String(value)); setError(""); }}>
                    {value === donation.availableQty ? `Max (${value})` : value}
                  </Button>
                ))}
              </div>
              <Button className="mt-3 w-full" onClick={reserve}>
                <UtensilsCrossed className="h-4 w-4" /> Create provisional hold
              </Button>
              <p className="mt-2 text-center text-caption text-muted">No payment required. Subject to donor confirmation.</p>
            </div>
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-caption font-semibold text-ink">Eligibility</p>
              <ul className="mt-1.5 space-y-1 text-caption text-muted">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Account approved as {currentRecipient.recipientType}</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Pickup location within your service area</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Quantity available for your request</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Collection">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Compass className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-caption font-semibold text-ink">Pickup area</p>
                  <p className="text-caption text-muted">{donation.pickupLocation}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-caption font-semibold text-ink">Transport</p>
                  <p className="text-caption text-muted">{donation.transportation}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <div>
                  <p className="text-caption font-semibold text-ink">Serving organisation</p>
                  <p className="text-caption text-muted">{currentRecipient.organization}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 rounded-lg bg-page p-2.5 text-caption text-muted">
              Bring containers or crates where required. Confirm the collected quantity after pickup.
            </div>
          </SectionCard>

          <SectionCard title="Other available food">
            {alternatives.length ? (
              <ul className="space-y-2">
                {alternatives.map((item) => (
                  <li key={item.id}>
                    <Link href={`/recipient/food/${item.id}`} className="flex items-center gap-2 rounded-lg border border-line p-2 transition hover:border-secondary hover:bg-lightgreen/40">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lightgreen text-primary"><UtensilsCrossed className="h-4 w-4" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-caption font-medium text-ink">{item.name}</span>
                        <span className="block text-caption text-muted">{item.availableQty} {item.unit} · {daysUntil(item.expiresAt) <= 1 ? "Expiring soon" : `${daysUntil(item.expiresAt)} days left`}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-caption text-muted">No other food is available right now.</p>
            )}
            <Link href="/recipient/available-food" className={buttonStyles("outline", "sm", "mt-3 w-full")}>
              Browse all food
            </Link>
          </SectionCard>
        </aside>
      </div>
    </>
  );
}
