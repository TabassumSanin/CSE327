import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessStep = {
  icon: LucideIcon;
  stage: string;
  title: string;
  description: string;
  details: string[];
};

export function ProcessTimeline({
  steps,
  className,
}: {
  steps: ProcessStep[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <li
            key={step.title}
            className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 pb-9 last:pb-0 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-x-5"
          >
            {!isLast ? (
              <span
                className="absolute bottom-0 left-5 top-10 w-px bg-line sm:left-6 sm:top-12"
                aria-hidden
              />
            ) : null}

            <span className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-primary shadow-sm sm:h-12 sm:w-12">
              <Icon className="h-5 w-5" aria-hidden />
            </span>

            <div className="min-w-0 pt-0.5 sm:pt-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-caption font-semibold text-secondary">
                  Step {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-1 w-1 rounded-full bg-line" aria-hidden />
                <span className="text-caption text-muted">{step.stage}</span>
              </div>

              <h3 className="mt-1 text-h3 text-ink">{step.title}</h3>
              <p className="mt-1.5 max-w-2xl text-small text-muted">{step.description}</p>

              <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5">
                {step.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-2 text-caption text-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
