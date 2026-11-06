import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "No records found",
  description = "Try adjusting your search or filters.",
  action,
  icon: Icon = Inbox,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-page/60 px-6 py-12 text-center", className)}>
      <span className="grid h-12 w-12 place-items-center rounded-full bg-lightgreen text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-3 text-h3 text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-small text-muted">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-[#F2C5C1] bg-error px-3 py-2 text-caption text-[#8C2F27]">
      {message}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-[#E8EEEA]", className)} />;
}
