import { cn } from "@/lib/utils";

export type RiskLevel = "safe" | "soon" | "review";

const riskMeta: Record<RiskLevel, { label: string; className: string }> = {
  safe: {
    label: "Safe",
    className: "bg-risk-safe-bg text-risk-safe border-risk-safe/25",
  },
  soon: {
    label: "Use soon",
    className: "bg-risk-soon-bg text-risk-soon border-risk-soon/25",
  },
  review: {
    label: "Needs review",
    className: "bg-risk-review-bg text-risk-review border-risk-review/25",
  },
};

export interface RiskBadgeProps {
  level: RiskLevel;
  /** One short, concrete sentence explaining the flag. */
  reason?: string;
  /** Override the default label, for example in Bangla. */
  label?: string;
  className?: string;
  reasonClassName?: string;
}

/**
 * The food-safety signal used on every donation card. The badge is always
 * paired with a plain-language reason so the label is never a bare score.
 */
export function RiskBadge({
  level,
  reason,
  label,
  className,
  reasonClassName,
}: RiskBadgeProps) {
  const meta = riskMeta[level];
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-1", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-caption font-semibold",
          meta.className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        {label ?? meta.label}
      </span>
      {reason ? (
        <span className={cn("text-caption leading-snug text-muted", reasonClassName)}>{reason}</span>
      ) : null}
    </p>
  );
}

export { riskMeta };
