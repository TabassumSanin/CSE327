"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Power, Search, ShieldCheck, UserCheck, Users, Mail, Phone, MapPin, FileText } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import { Field, Input, Select } from "@/components/ui/form";
import { StatusBadge } from "@/components/ui/badge";
import { TableWrap, Th, Td, Tr, Avatar, InfoRow } from "@/components/ui/table";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import type { AppUser } from "@/types";
import { formatDate } from "@/lib/utils";

const PER_PAGE = 6;

export default function AdminUsersPage() {
  const { users, updateUserStatus, updateUser, notify } = useApp();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AppUser | null>(null);
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [draft, setDraft] = useState<Partial<AppUser>>({});
  const [confirming, setConfirming] = useState<AppUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = [user.name, user.email, user.organization ?? "", user.id]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || user.status === status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const nextStatus = confirming?.status === "active" ? "inactive" : "active";

  const openEdit = (user: AppUser) => {
    setEditing(user);
    setDraft({
      name: user.name,
      email: user.email,
      phone: user.phone,
      organization: user.organization,
      location: user.location,
      accountType: user.accountType,
    });
  };

  const saveEdit = () => {
    if (!editing) return;
    if (!draft.name?.trim() || !draft.email?.trim()) {
      notify("Name and email are required.", "error");
      return;
    }
    updateUser(editing.id, draft);
    setEditing(null);
  };

  return (
    <>
      <PageHeader
        title="Manage Users"
        description="Search, review, and manage donor, recipient, and administrator accounts."
        actions={
          <Link href="/admin/approvals" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-btn text-ink transition hover:border-secondary hover:text-primary">
            <UserCheck className="h-4 w-4" /> Account approvals
          </Link>
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={Users} />
        <StatCard label="Donors" value={users.filter((user) => user.role === "donor").length} icon={UserCheck} tone="green" />
        <StatCard label="Recipients" value={users.filter((user) => user.role === "recipient").length} icon={Users} tone="blue" />
        <StatCard label="Administrators" value={users.filter((user) => user.role === "admin").length} icon={ShieldCheck} tone="amber" />
      </div>

      <div className="card mt-4 p-3 md:p-4">
        <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
          <SearchField value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search by name, email, organization, or ID..." ariaLabel="Search users" />
          <Select value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }} aria-label="Filter by role" className="md:w-44">
            <option value="all">All roles</option>
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
            <option value="admin">Administrator</option>
          </Select>
          <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} aria-label="Filter by status" className="md:w-44">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
            <option value="under-review">Under review</option>
            <option value="rejected">Rejected</option>
          </Select>
        </div>
        <p className="mt-2 text-caption text-muted">
          Showing {rows.length} of {filtered.length} users
          {search ? ` for “${search}”` : ""}.
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No users found" description="Try adjusting your search term or role/status filters." icon={Search} />
        </div>
      ) : (
        <>
          <div className="mt-4 hidden lg:block">
            <TableWrap>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Account type</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
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
                          <p className="text-caption text-muted">{user.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="capitalize">{user.role}</Td>
                    <Td>
                      <p>{user.accountType}</p>
                      {user.organization ? <p className="text-caption text-muted">{user.organization}</p> : null}
                    </Td>
                    <Td>{user.location}</Td>
                    <Td><StatusBadge status={user.status} /></Td>
                    <Td className="text-caption text-muted">{formatDate(user.joinedAt)}</Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setViewing(user)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`View ${user.name}`} title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => openEdit(user)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`Edit ${user.name}`} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        {user.role !== "admin" ? (
                          <button type="button" onClick={() => setConfirming(user)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-secondary hover:text-primary" aria-label={`${user.status === "active" ? "Deactivate" : "Activate"} ${user.name}`} title={user.status === "active" ? "Deactivate" : "Activate"}>
                            <Power className="h-4 w-4" />
                          </button>
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
                    <p className="truncate text-caption text-muted">{user.email}</p>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-caption">
                  <div className="rounded-lg bg-page px-2.5 py-2">
                    <p className="text-muted">Role</p>
                    <p className="font-medium capitalize text-ink">{user.role}</p>
                  </div>
                  <div className="rounded-lg bg-page px-2.5 py-2">
                    <p className="text-muted">Type</p>
                    <p className="font-medium text-ink">{user.accountType}</p>
                  </div>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-caption text-muted"><MapPin className="h-3.5 w-3.5" /> {user.location}</p>
                <div className="mt-3 flex gap-2 border-t border-line pt-3">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setViewing(user)}><Eye className="h-3.5 w-3.5" /> View</Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(user)}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                  {user.role !== "admin" ? (
                    <Button size="sm" variant={user.status === "active" ? "danger" : "primary"} onClick={() => setConfirming(user)}>
                      <Power className="h-3.5 w-3.5" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} label="users" />
          </div>
        </>
      )}

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="User profile"
        description={viewing?.id}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>
            {viewing ? (
              <Button onClick={() => { openEdit(viewing); setViewing(null); }}>
                <Pencil className="h-4 w-4" /> Edit profile
              </Button>
            ) : null}
          </>
        }
      >
        {viewing ? (
          <div>
            <div className="flex items-center gap-3">
              <Avatar name={viewing.name} color={viewing.avatarColor} size="lg" />
              <div>
                <h3 className="text-h3 text-ink">{viewing.name}</h3>
                <p className="text-small text-muted">{viewing.organization ?? viewing.accountType}</p>
                <div className="mt-1 flex gap-2">
                  <StatusBadge status={viewing.status} />
                  <span className="rounded-full bg-lightgreen px-2.5 py-0.5 text-caption capitalize text-primary">{viewing.role}</span>
                </div>
              </div>
            </div>
            <dl className="mt-4">
              <InfoRow label="User ID" value={viewing.id} />
              <InfoRow label="Account type" value={viewing.accountType} />
              <InfoRow label="Email" value={<span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted" />{viewing.email}</span>} />
              <InfoRow label="Phone" value={<span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-muted" />{viewing.phone}</span>} />
              <InfoRow label="Location" value={viewing.location} />
              <InfoRow label="Joined" value={formatDate(viewing.joinedAt)} />
            </dl>
            <div className="mt-4">
              <p className="text-label font-semibold text-ink">Documents on file</p>
              {viewing.documents.length > 0 ? (
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {viewing.documents.map((doc) => (
                    <li key={doc} className="flex items-center gap-2 rounded-lg border border-line bg-page px-2.5 py-2 text-caption text-ink">
                      <FileText className="h-3.5 w-3.5 text-secondary" /> {doc}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-caption text-muted">No documents stored for this account.</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit user"
        description="Update profile and contact details."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save changes</Button>
          </>
        }
      >
        {editing ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" htmlFor="edit-name" required>
              <Input id="edit-name" value={draft.name ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))} />
            </Field>
            <Field label="Email" htmlFor="edit-email" required>
              <Input id="edit-email" type="email" value={draft.email ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, email: e.target.value }))} />
            </Field>
            <Field label="Phone" htmlFor="edit-phone">
              <Input id="edit-phone" value={draft.phone ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))} />
            </Field>
            <Field label="Account type" htmlFor="edit-type">
              <Select id="edit-type" value={draft.accountType ?? "Individual"} onChange={(e) => setDraft((prev) => ({ ...prev, accountType: e.target.value as AppUser["accountType"] }))}>
                <option>Individual</option>
                <option>Organization</option>
              </Select>
            </Field>
            <Field label="Organization" htmlFor="edit-org">
              <Input id="edit-org" value={draft.organization ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, organization: e.target.value }))} />
            </Field>
            <Field label="Location" htmlFor="edit-location">
              <Input id="edit-location" value={draft.location ?? ""} onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))} />
            </Field>
            <div className="sm:col-span-2 rounded-lg bg-page px-3 py-2 text-caption text-muted">
              Role changes must be requested through administrator access settings.
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        onConfirm={() => {
          if (!confirming) return;
          updateUserStatus(confirming.id, nextStatus);
          setConfirming(null);
        }}
        title={nextStatus === "active" ? "Activate account" : "Deactivate account"}
        description={
          confirming
            ? nextStatus === "active"
              ? `Reactivate ${confirming.name}? They will regain access to their dashboard immediately.`
              : `Deactivate ${confirming.name}? They will lose access to the platform until reactivated.`
            : ""
        }
        confirmLabel={nextStatus === "active" ? "Activate" : "Deactivate"}
        variant={nextStatus === "active" ? "primary" : "danger"}
      />
    </>
  );
}
