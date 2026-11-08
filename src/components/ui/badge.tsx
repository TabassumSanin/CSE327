import { cn } from "@/lib/utils";

export type StatusKey =
  | "approved"
  | "verified"
  | "active"
  | "completed"
  | "confirmed"
  | "available"
  | "reserved"
  | "pending"
  | "awaiting"
  | "provisional"
  | "needs-review"
  | "pending-review"
  | "under-review"
  | "in-progress"
  | "rejected"
  | "declined"
  | "inactive"
  | "expired"
  | "cancelled"
  | "draft"
  | string;

const statusStyles: Record<string, string> = {
  approved: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  verified: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  active: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  completed: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  confirmed: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  available: "bg-softgreen text-primary border-primary/20",
  reserved: "bg-cream text-ink border-line",
  pending: "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  awaiting: "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  provisional: "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  "needs-review": "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  "pending-review": "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  "under-review": "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  "in-progress": "bg-softgreen text-primary border-primary/20",
  rejected: "bg-risk-review-bg text-risk-review border-risk-review/25",
  declined: "bg-risk-review-bg text-risk-review border-risk-review/25",
  inactive: "bg-cream text-muted border-line",
  expired: "bg-cream text-muted border-line",
  cancelled: "bg-cream text-muted border-line",
  draft: "bg-cream text-muted border-line",
};

const statusLabels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  completed: "Completed",
  "pending-review": "Pending review",
  rejected: "Rejected",
  expired: "Expired",
  cancelled: "Cancelled",
  provisional: "Provisional",
  awaiting: "Awaiting confirmation",
  confirmed: "Confirmed",
  declined: "Declined",
  "in-progress": "Collection in progress",
  "needs-review": "Needs review",
  "under-review": "Under review",
  pending: "Pending",
  approved: "Approved",
  active: "Active",
  inactive: "Inactive",
  verified: "Verified",
};

export function StatusBadge({
  status,
  label,
  className,
  showDot = true,
}: {
  status: StatusKey;
  label?: string;
  className?: string;
  showDot?: boolean;
}) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-caption font-medium",
        statusStyles[key] ?? "border-line bg-cream text-muted",
        className
      )}
    >
      {showDot ? <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden /> : null}
      {label ?? statusLabels[key] ?? status}
    </span>
  );
}

export type BadgeTone = "neutral" | "green" | "safe" | "soon" | "review" | "outline";

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-cream text-ink border-line",
  green: "bg-softgreen text-primary border-primary/20",
  safe: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  soon: "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  review: "bg-risk-review-bg text-risk-review border-risk-review/25",
  outline: "bg-white text-muted border-line",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-caption font-medium",
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
