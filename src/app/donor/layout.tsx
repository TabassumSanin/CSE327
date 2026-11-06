import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentDonor } from "@/data/mock";

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      role="donor"
      user={{ name: currentDonor.name, subtitle: currentDonor.organization, color: "#245C45" }}
    >
      {children}
    </DashboardShell>
  );
}
