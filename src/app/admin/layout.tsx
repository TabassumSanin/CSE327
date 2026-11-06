import { DashboardShell } from "@/components/layout/dashboard-shell";
import { currentAdmin } from "@/data/mock";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      role="admin"
      user={{ name: currentAdmin.name, subtitle: currentAdmin.role, color: "#245C45" }}
    >
      {children}
    </DashboardShell>
  );
}
