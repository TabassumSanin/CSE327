import Image from "next/image";
import Link from "next/link";
import { CalendarClock, MapPin, Package, ShieldCheck } from "lucide-react";
import type { Donation } from "@/types";
import { categorySlug, daysUntil, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";

export function FoodCard({
  donation,
  href,
  action,
  showVerification = true,
}: {
  donation: Donation;
  href: string;
  action?: React.ReactNode;
  showVerification?: boolean;
}) {
  const days = daysUntil(donation.expiresAt);
  const expiryText =
    days < 0 ? "Expired" : days === 0 ? "Expires today" : days === 1 ? "1 day left" : `${days} days left`;
  const lowStock = donation.availableQty > 0 && donation.availableQty <= 10;

  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-lightgreen">
        <Image
          src={`/images/food-${categorySlug(donation.category)}.svg`}
          alt={`${donation.name} illustration`}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-caption font-medium text-ink backdrop-blur">
            {donation.category}
          </span>
          {showVerification && donation.verification === "verified" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-caption font-medium text-primary backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified
            </span>
          ) : donation.verification === "needs-review" ? (
            <StatusBadge status="needs-review" />
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-h3 text-ink">{donation.name}</h3>
          <span className="shrink-0 text-caption font-medium text-primary">
            {donation.unit === "kg" ? "per kg" : donation.unit}
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-small text-muted">{donation.description}</p>

        <dl className="mt-3 grid grid-cols-2 gap-2 text-caption">
          <div className="rounded-lg bg-page px-2.5 py-2">
            <dt className="flex items-center gap-1 text-muted">
              <Package className="h-3.5 w-3.5" /> Available
            </dt>
            <dd className={`mt-0.5 font-semibold ${lowStock ? "text-[#A66A0B]" : "text-ink"}`}>
              {donation.availableQty} {donation.unit}
            </dd>
          </div>
          <div className="rounded-lg bg-page px-2.5 py-2">
            <dt className="flex items-center gap-1 text-muted">
              <CalendarClock className="h-3.5 w-3.5" /> Expiry
            </dt>
            <dd className={`mt-0.5 font-semibold ${days <= 1 ? "text-[#A66A0B]" : "text-ink"}`}>
              {expiryText}
            </dd>
          </div>
        </dl>

        <p className="mt-3 flex items-start gap-1.5 text-caption text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{donation.pickupLocation}</span>
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <span className="min-w-0 truncate text-caption text-muted">
            {donation.donor.organization ?? donation.donor.name}
          </span>
          <span className="text-caption text-muted">{formatDate(donation.expiresAt)}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={href}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-line bg-white px-3 text-caption font-semibold text-ink transition hover:border-secondary hover:text-primary"
          >
            View Details
          </Link>
          {action}
        </div>
      </div>
    </article>
  );
}
