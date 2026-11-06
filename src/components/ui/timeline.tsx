import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReservationEvent } from "@/types";

export function Timeline({
  events,
  className,
}: {
  events: ReservationEvent[];
  className?: string;
}) {
  return (
    <ol className={cn("relative space-y-5", className)}>
      {events.map((event, index) => (
        <li key={`${event.title}-${index}`} className="relative flex gap-3">
          {index !== events.length - 1 ? (
            <span
              className={cn(
                "absolute left-[11px] top-6 h-[calc(100%+4px)] w-px",
                event.done ? "bg-secondary/40" : "bg-line"
              )}
            />
          ) : null}
          <span
            className={cn(
              "relative z-10 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border",
              event.done
                ? "border-secondary bg-secondary text-white"
                : "border-line bg-white text-muted"
            )}
          >
            {event.done ? <Check className="h-3.5 w-3.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
          </span>
          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className={cn("text-label", event.done ? "text-ink" : "text-muted")}>{event.title}</p>
              <span className="text-caption text-muted">· {event.time}</span>
            </div>
            <p className="mt-0.5 text-caption text-muted">{event.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
