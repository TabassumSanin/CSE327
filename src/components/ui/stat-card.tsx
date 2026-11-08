import { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  tone = "green",
  hint,
}: {
  label: string;
  value: string | number;
  change?: { value: string; positive?: boolean };
  icon: LucideIcon;
  tone?: "green" | "blue" | "amber" | "rose";
  hint?: string;
}) {
  const tones = {
    green: "text-primary",
    blue: "text-muted",
    amber: "text-risk-soon",
    rose: "text-risk-review",
  };
  return (
    <div className="card p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label text-muted">{label}</p>
          <p className="mt-2 font-display text-[26px] leading-none text-ink md:text-[30px]">
            {value}
          </p>
          {change ? (
            <p className="mt-3 flex items-center gap-1 text-caption">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
                  change.positive === false
                    ? "bg-risk-review-bg text-risk-review"
                    : "bg-risk-safe-bg text-risk-safe"
                )}
              >
                {change.positive === false ? (
                  <ArrowDownRight className="h-3 w-3" aria-hidden />
                ) : (
                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                )}
                {change.value}
              </span>
              <span className="text-muted">{hint ?? "vs last month"}</span>
            </p>
          ) : hint ? (
            <p className="mt-3 text-caption text-muted">{hint}</p>
          ) : null}
        </div>
        <span className={cn("shrink-0 pt-1", tones[tone])}>
          <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" aria-hidden />
        </span>
      </div>
    </div>
  );
}
