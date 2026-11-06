"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  Search,
  UserCheck,
  UserX,
  Clock,
  ShieldCheck,
  Eye,
  Building2,
  User,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SearchField } from "@/components/ui/search-field";
import { Field, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { TableWrap, Th, Td, Tr, Avatar, InfoRow } from "@/components/ui/table";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import type { AppUser } from "@/types";
import { formatDate } from "@/lib/utils";

const PER_PAGE = 5;
type Decision = { user: AppUser; action: "approve" | "reject" } | null;

export default function AdminApprovalsPage() {
  const { users, updateUserStatus, notify } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AppUser | null>(null);
  const [decision, setDecision] = useState<Decision>(null);

  const applicants = useMemo(
    () => users.filter((user) => user.role !== "admin"),
    [users]
  );
  const pending = applicants.filter((user) => user.status === "pending").length;
  const approved = applicants.filter((user) => user.status === "active").length;
  const rejected = applicants.filter((user) => user.status === "rejected").length;
  const review = applicants.filter((user) => user.status === "under-review").length;

  const filtered = useMemo(
    () =>
      applicants.filter((user) => {
        const matchesSearch = [user.name, user.email, user.organization ?? "", user.id]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || user.status === statusFilter;
        const matchesType = typeFilter === "all" || user.accountType === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
      }),
    [applicants, search, statusFilter, typeFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const confirmDecision = () => {
    if (!decision) return;
    if (decision.action === "approve") {
      updateUserStatus(decision.user.id, "active");
      notify(`${decision.user.name} approved and notified.`);
    } else {
      updateUserStatus(decision.user.id, "rejected");
      notify(`${decision.user.name} application rejected.`, "info");
    }
    setDecision(null);
    setViewing(null);
  };

  return (
    <>
      <PageHeader
        title="Account Approvals"
        description="Review applications and approve eligible donors and recipients. Individual recipient accounts always require administrator approval."
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pending Applications" value={pending} icon={Clock} tone="amber" />
        <StatCard label="Approved Accounts" value={approved} icon={UserCheck} />
        <StatCard label="Rejected Applications" value={rejected} icon={UserX} tone="rose" />
        <StatCard label="Under Review" value={review} icon={ShieldCheck} tone="blue" />
      </div>

      <div className="mt-4 rounded-2xl border border-[#F0DFA8] bg-warning/60 p-3.5 text-caption text-[#7A5A0B]">
        <span className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Verify organization registration and identity documents before approving. Individual
          recipient applications require supporting documents and manual approval.
        </span>
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search applicants by name, email, organization..." ariaLabel="Search applicants" />
          <Select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="md:w-44" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under review</option>
            <option value="active">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
          <Select value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }} className="md:w-44" aria-label="Filter by account type">
            <option value="all">All account types</option>
            <option value="Individual">Individual</option>
            <option value="Organization">Organization</option>
          </Select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No applications found" description="Try changing the status, account type, or search term." icon={Search} />
        </div>
      ) : (
        <>
          <div className="mt-4 hidden lg:block">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Applicant</Th>
                  <Th>Applying as</Th>
                  <Th>Account type</Th>
                  <Th>Contact</Th>
                  <Th>Location</Th>
                  <Th>Documents</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={user.name} color={user.avatarColor} size="sm" />
                        <div>
                          <p className="font-medium text-ink">{user.name}</p>
                          <p className="text-caption text-muted">{user.organization ?? user.id}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="capitalize">{user.applicantType ?? user.role}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5">
                        {user.accountType === "Organization" ? <Building2 className="h-3.5 w-3.5 text-muted" /> : <User className="h-3.5 w-3.5 text-muted" />}
                        {user.accountType}
                      </span>
                    </Td>
                    <Td>
                      <p>{user.email}</p>
                      <p className="text-caption text-muted">{user.phone}</p>
                    </Td>
                    <Td>{user.location}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1 text-caption text-muted">
                        <FileText className="h-3.5 w-3.5" /> {user.documents.length} files
                      </span>
                    </Td>
                    <Td><StatusBadge status={user.status === "active" ? "approved" : user.status} /></Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setViewing(user)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`View ${user.name}`} title="View details">
                          <Eye className="h-4 w-4" />
                        </button>
                        {user.status !== "active" ? (
                          <>
                            <button type="button" onClick={() => setDecision({ user, action: "approve" })} className="grid h-8 w-8 place-items-center rounded-lg border border-[#B9E3C7] bg-success text-[#1D6A3E] hover:bg-[#CDEBD7]" aria-label={`Approve ${user.name}`} title="Approve">
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            {user.status !== "rejected" ? (
                              <button type="button" onClick={() => setDecision({ user, action: "reject" })} className="grid h-8 w-8 place-items-center rounded-lg border border-[#F2C5C1] bg-error text-[#8C2F27] hover:bg-[#F9D5D2]" aria-label={`Reject ${user.name}`} title="Reject">
                                <UserX className="h-4 w-4" />
                              </button>
                            ) : null}
                          </>
                        ) : null}
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:hidden">
            {rows.map((user) => (
              <div key={user.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <Avatar name={user.name} color={user.avatarColor} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-caption text-muted">{user.organization ?? user.accountType}</p>
                  </div>
                  <StatusBadge status={user.status === "active" ? "approved" : user.status} />
                </div>
                <div className="mt-2 grid gap-1 text-caption text-muted">
                  <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {user.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {user.phone}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {user.location}</p>
                </div>
                <p className="mt-2 text-caption text-muted">Submitted {formatDate(user.joinedAt)} · {user.documents.length} documents</p>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewing(user)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                  {user.status !== "active" ? (
                    <>
                      <Button size="sm" className="flex-1" onClick={() => setDecision({ user, action: "approve" })}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDecision({ user, action: "reject" })} aria-label="Reject">
                        <UserX className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="applications" />
          </div>
        </>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Application details"
        description={viewing ? `${viewing.id} · Submitted ${formatDate(viewing.joinedAt)}` : ""}
        size="lg"
        footer={
          viewing ? (
            <>
              <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
              {viewing.status !== "active" ? (
                <>
                  <Button variant="danger" onClick={() => setDecision({ user: viewing, action: "reject" })}>
                    <UserX className="h-4 w-4" /> Reject
                  </Button>
                  <Button onClick={() => setDecision({ user: viewing, action: "approve" })}>
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </Button>
                </>
              ) : null}
            </>
          ) : null
        }
      >
        {viewing ? (
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <Avatar name={viewing.name} color={viewing.avatarColor} size="lg" />
                <div>
                  <h3 className="text-h3 text-ink">{viewing.name}</h3>
                  <p className="text-small text-muted">{viewing.organization ?? viewing.accountType}</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    <StatusBadge status={viewing.status === "active" ? "approved" : viewing.status} />
                    <span className="rounded-full bg-lightgreen px-2.5 py-0.5 text-caption capitalize text-primary">
                      {viewing.applicantType ?? viewing.role}
                    </span>
                  </div>
                </div>
              </div>
              <dl className="mt-4">
                <InfoRow label="Applicant ID" value={viewing.id} />
                <InfoRow label="Account type" value={viewing.accountType} />
                <InfoRow label="Email" value={viewing.email} />
                <InfoRow label="Phone" value={viewing.phone} />
                <InfoRow label="Location" value={viewing.location} />
                <InfoRow label="Submitted" value={formatDate(viewing.joinedAt)} />
              </dl>
            </div>
            <div>
              <p className="text-label font-semibold text-ink">Submitted documents</p>
              {viewing.documents.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {viewing.documents.map((doc) => (
                    <li key={doc} className="flex items-center justify-between gap-2 rounded-xl border border-line bg-page px-3 py-2.5">
                      <span className="flex items-center gap-2 text-small text-ink">
                        <FileText className="h-4 w-4 text-secondary" /> {doc}
                      </span>
                      <button
                        type="button"
                        onClick={() => notify(`${doc} preview opened (demo).`, "info")}
                        className="text-caption font-semibold text-primary hover:underline"
                      >
                        Preview
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-caption text-muted">No documents submitted.</p>
              )}

              <div className="mt-4 rounded-xl border border-line bg-page p-3">
                <p className="text-label font-semibold text-ink">Approval checklist</p>
                <ul className="mt-2 space-y-1.5 text-caption text-muted">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Identity or organization registration verified</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Contact details reachable</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Location within service area</li>
                </ul>
              </div>
              <div className="mt-3 rounded-xl border border-[#F0DFA8] bg-warning/60 p-3 text-caption text-[#7A5A0B]">
                <Field label="Reviewer notes" htmlFor="approval-notes">
                  <textarea id="approval-notes" className="field min-h-[70px]" placeholder="Optional notes for the audit log..." />
                </Field>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(decision)}
        onClose={() => setDecision(null)}
        onConfirm={confirmDecision}
        title={decision?.action === "approve" ? "Approve application" : "Reject application"}
        description={
          decision
            ? decision.action === "approve"
              ? `Approve ${decision.user.name}? They will receive access to the ${decision.user.role} dashboard and a confirmation notification.`
              : `Reject ${decision.user.name}? They will be notified and cannot access the platform. This action can be reversed later by an administrator.`
            : ""
        }
        confirmLabel={decision?.action === "approve" ? "Approve account" : "Reject application"}
        variant={decision?.action === "approve" ? "primary" : "danger"}
        icon={
          decision?.action === "approve" ? (
            <CheckCircle2 className="h-6 w-6 text-secondary" />
          ) : (
            <AlertCircle className="h-6 w-6 text-[#B4473D]" />
          )
        }
      />
    </>
  );
}
