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
    green: "bg-lightgreen text-primary",
    blue: "bg-info text-[#23548C]",
    amber: "bg-warning text-[#7A5A0B]",
    rose: "bg-error text-[#8C2F27]",
  };
  return (
    <div className="card p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-label text-muted">{label}</p>
          <p className="mt-2 text-[26px] font-bold leading-none tracking-tight text-ink md:text-[30px]">
            {value}
          </p>
          {change ? (
            <p className="mt-3 flex items-center gap-1 text-caption">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
                  change.positive === false
                    ? "bg-error text-[#8C2F27]"
                    : "bg-success text-[#1D6A3E]"
                )}
              >
                {change.positive === false ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <ArrowUpRight className="h-3 w-3" />
                )}
                {change.value}
              </span>
              <span className="text-muted">{hint ?? "vs last month"}</span>
            </p>
          ) : hint ? (
            <p className="mt-3 text-caption text-muted">{hint}</p>
          ) : null}
        </div>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl md:h-12 md:w-12", tones[tone])}>
          <Icon className="h-5 w-5 md:h-[22px] md:w-[22px]" />
        </span>
      </div>
    </div>
  );
}
