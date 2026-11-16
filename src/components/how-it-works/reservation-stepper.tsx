import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReservationStage = {
  icon: LucideIcon;
  status: string;
  title: string;
  description: string;
};

export function ReservationStepper({
  stages,
  className,
}: {
  stages: ReservationStage[];
  className?: string;
}) {
  return (
    <ol className={cn("relative grid md:grid-cols-4 md:gap-4", className)}>
      <span
        className="absolute left-5 right-5 top-5 hidden h-px bg-line md:block"
        aria-hidden
      />

      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isLast = index === stages.length - 1;

        return (
          <li
            key={stage.title}
            className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 pb-6 last:pb-0 md:block md:pb-0"
          >
            {!isLast ? (
              <span
                className="absolute bottom-0 left-5 top-10 w-px bg-line md:hidden"
                aria-hidden
              />
            ) : null}

            <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-primary shadow-sm">
              <Icon className="h-4 w-4" aria-hidden />
            </span>

            <div className="pt-0.5 md:pt-3">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-caption font-medium",
                  index === 0
                    ? "bg-warning text-[#7A5A0B]"
                    : isLast
                      ? "bg-success text-[#1D6A3E]"
                      : "bg-lightgreen text-primary"
                )}
              >
                {stage.status}
              </span>
              <h3 className="mt-2 text-label font-semibold text-ink">{stage.title}</h3>
              <p className="mt-1 text-caption text-muted">{stage.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
