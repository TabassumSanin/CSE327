import Link from "next/link";
import { CalendarClock, MapPin, Package } from "lucide-react";
import type { Donation } from "@/types";
import { daysUntil, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/badge";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { RiskBadge, type RiskLevel } from "@/components/ui/risk-badge";

export function FoodCard({
  donation,
  href,
  action,
  risk,
}: {
  donation: Donation;
  href: string;
  action?: React.ReactNode;
  /** Risk agent result. Pass it from the page so the reason stays specific. */
  risk?: { level: RiskLevel; reason: string };
}) {
  const days = daysUntil(donation.expiresAt);
  const expiryText =
    days < 0 ? "Expired" : days === 0 ? "Expires today" : days === 1 ? "1 day left" : `${days} days left`;
  const lowStock = donation.availableQty > 0 && donation.availableQty <= 10;
  const needsReview = donation.verification === "needs-review";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-card transition-shadow hover:shadow-soft">
      <div className="relative">
        <PhotoPlaceholder
          alt={`${donation.name} from ${donation.donor.organization ?? donation.donor.name}, ${donation.pickupLocation}`}
          label={donation.name}
          aspect="card"
          framed={false}
          className="rounded-none"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-lg border border-line bg-white/95 px-2.5 py-1 text-caption font-medium text-ink">
          {donation.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display line-clamp-1 text-h3 text-ink">{donation.name}</h3>
          {needsReview ? <StatusBadge status="needs-review" /> : null}
        </div>
        <p className="mt-1 line-clamp-2 text-small text-muted">{donation.description}</p>

        {risk ? <RiskBadge level={risk.level} reason={risk.reason} className="mt-3" /> : null}

        <dl className="mt-3 grid grid-cols-2 gap-2 text-caption">
          <div className="rounded-lg bg-page px-2.5 py-2">
            <dt className="flex items-center gap-1 text-muted">
              <Package className="h-3.5 w-3.5" aria-hidden /> Available
            </dt>
            <dd className={`mt-0.5 font-semibold ${lowStock ? "text-risk-soon" : "text-ink"}`}>
              {donation.availableQty} {donation.unit}
            </dd>
          </div>
          <div className="rounded-lg bg-page px-2.5 py-2">
            <dt className="flex items-center gap-1 text-muted">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden /> Expiry
            </dt>
            <dd className={`mt-0.5 font-semibold ${days <= 1 ? "text-risk-soon" : "text-ink"}`}>
              {expiryText}
            </dd>
          </div>
        </dl>

        <p className="mt-3 flex items-start gap-1.5 text-caption text-muted">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
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
            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-line bg-white px-3 text-caption font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          >
            View details
          </Link>
          {action}
        </div>
      </div>
    </article>
  );
}
