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

const styles: Record<string, string> = {
  approved: "bg-success text-[#1D6A3E] border-[#B9E3C7]",
  verified: "bg-success text-[#1D6A3E] border-[#B9E3C7]",
  active: "bg-success text-[#1D6A3E] border-[#B9E3C7]",
  completed: "bg-success text-[#1D6A3E] border-[#B9E3C7]",
  confirmed: "bg-success text-[#1D6A3E] border-[#B9E3C7]",
  available: "bg-lightgreen text-primary border-[#C6DFD0]",
  reserved: "bg-info text-[#23548C] border-[#C6DAF4]",
  pending: "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  awaiting: "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  provisional: "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  "needs-review": "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  "pending-review": "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  "under-review": "bg-warning text-[#7A5A0B] border-[#F0DFA8]",
  "in-progress": "bg-info text-[#23548C] border-[#C6DAF4]",
  rejected: "bg-error text-[#8C2F27] border-[#F2C5C1]",
  declined: "bg-error text-[#8C2F27] border-[#F2C5C1]",
  inactive: "bg-[#EEF1EF] text-[#59655E] border-[#DDE5DF]",
  expired: "bg-[#EEF1EF] text-[#59655E] border-[#DDE5DF]",
  cancelled: "bg-[#EEF1EF] text-[#59655E] border-[#DDE5DF]",
  draft: "bg-[#EEF1EF] text-[#59655E] border-[#DDE5DF]",
};

const labels: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  completed: "Completed",
  "pending-review": "Pending Review",
  rejected: "Rejected",
  expired: "Expired",
  cancelled: "Cancelled",
  provisional: "Provisional",
  awaiting: "Awaiting Confirmation",
  confirmed: "Confirmed",
  declined: "Declined",
  "in-progress": "Collection in Progress",
  "needs-review": "Needs Review",
  "under-review": "Under Review",
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
}: {
  status: StatusKey;
  label?: string;
  className?: string;
}) {
  const key = status.toLowerCase();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-medium whitespace-nowrap",
        styles[key] ?? "bg-[#EEF1EF] text-[#59655E] border-line",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label ?? labels[key] ?? status}
    </span>
  );
}
