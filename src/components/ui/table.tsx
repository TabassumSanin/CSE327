import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function TableWrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-line bg-white", className)}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[760px] border-collapse text-left">{children}</table>
      </div>
    </div>
  );
}

export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn(
        "whitespace-nowrap border-b border-line bg-[#F8FAF8] px-4 py-3 text-caption font-semibold uppercase tracking-wide text-muted",
        className
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-line/70 px-4 py-3 text-small text-ink", className)}>{children}</td>;
}

export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn("transition hover:bg-[#FAFCFA]", className)}>{children}</tr>;
}

export function Avatar({
  name,
  color = "#245C45",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-caption",
    md: "h-10 w-10 text-small",
    lg: "h-14 w-14 text-h3",
  };
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full font-semibold text-white", sizes[size])}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

export function InfoRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5 border-b border-line/70 py-2.5 last:border-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6", className)}>
      <dt className="shrink-0 text-caption text-muted">{label}</dt>
      <dd className="text-small font-medium text-ink sm:text-right">{value}</dd>
    </div>
  );
}
