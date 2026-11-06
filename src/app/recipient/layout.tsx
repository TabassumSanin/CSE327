import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentRecipient } from "@/data/mock";

export default function RecipientLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      role="recipient"
      user={{ name: currentRecipient.name, subtitle: currentRecipient.organization, color: "#2F6B5A" }}
    >
      {children}
    </DashboardShell>
  );
}
