"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  Camera,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Globe2,
  HeartHandshake,
  KeyRound,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Smartphone,
  Trash2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { currentRecipient } from "@/data/mock";
import { cn, formatDate } from "@/lib/utils";
import type { AppUser } from "@/types";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-primary" : "bg-[#CBD5CF]")}
    >
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}

function SettingRow({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-label font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-caption text-muted">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function RecipientProfilePage() {
  const { users, reservations, updateUser, notify, language, setLanguage } = useApp();
  const profileUser = users.find((item) => item.id === currentRecipient.id);
  const [profile, setProfile] = useState(() => ({
    name: profileUser?.name ?? currentRecipient.name,
    organization: profileUser?.organization ?? currentRecipient.organization,
    email: profileUser?.email ?? currentRecipient.email,
    phone: profileUser?.phone ?? currentRecipient.phone,
    location: profileUser?.location ?? currentRecipient.location,
    accountType: (profileUser?.accountType ?? "Organization") as AppUser["accountType"],
    recipientType: currentRecipient.recipientType,
    serviceArea: "Mirpur, Mohammadpur, Dhanmondi, and nearby areas",
    peopleServed: "250",
    about: "Hope Community Kitchen serves daily meals to low-income families, children, and elderly residents in Mirpur.",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<{ name: string; uploaded: string; status: string }[]>(
    () => (profileUser?.documents ?? []).map((name) => ({ name, uploaded: "Mar 25, 2025", status: "verified" }))
  );
  const [viewDoc, setViewDoc] = useState<{ name: string; uploaded: string; status: string } | null>(null);
  const [prefs, setPrefs] = useState({ match: true, reservation: true, collection: true, status: true, push: true, sms: false });
  const [twoFactor, setTwoFactor] = useState(true);
  const [password, setPassword] = useState({ current: "", next: "", confirm: "" });
  const [passwordError, setPasswordError] = useState("");
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivated, setDeactivated] = useState(profileUser?.status === "inactive");
  const [sessions, setSessions] = useState([
    { id: "s1", device: "Chrome on Windows", location: "Dhaka, Bangladesh", lastActive: "Now · current session", current: true },
    { id: "s2", device: "Android · Hope Kitchen tablet", location: "Mirpur, Dhaka", lastActive: "2 hours ago", current: false },
  ]);

  const myReservations = reservations.filter((item) => item.recipientName === currentRecipient.organization);
  const completed = myReservations.filter((item) => item.status === "completed");
  const received = completed.reduce((sum, item) => sum + (item.collectedQty ?? item.quantity), 0);
  const donors = new Set(completed.map((item) => item.donorName));
  const memberSince = formatDate(profileUser?.joinedAt ?? "2025-03-25");
  const documentSummary = useMemo(
    () => ({ verified: docs.filter((item) => item.status === "verified").length, pending: docs.filter((item) => item.status !== "verified").length }),
    [docs]
  );

  const saveProfile = () => {
    const next: Record<string, string> = {};
    if (profile.name.trim().length < 3) next.name = "Enter your full name.";
    if (!profile.organization.trim()) next.organization = "Organization name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) next.email = "Enter a valid email address.";
    if (profile.phone.replace(/\D/g, "").length < 10) next.phone = "Enter a valid phone number.";
    if (!profile.location.trim()) next.location = "Add your organization address.";
    if (!profile.serviceArea.trim()) next.serviceArea = "Describe the area you serve.";
    const people = Number(profile.peopleServed);
    if (!people || people <= 0) next.peopleServed = "Enter the number of people you serve.";
    setErrors(next);
    if (Object.keys(next).length) {
      notify("Please fix the highlighted profile fields.", "error");
      return;
    }
    updateUser(currentRecipient.id, {
      name: profile.name.trim(),
      organization: profile.organization.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      accountType: profile.accountType,
    });
  };

  const uploadDocument = (file: File | undefined) => {
    if (!file) return;
    setDocs((prev) => [...prev, { name: file.name, uploaded: formatDate(new Date().toISOString()), status: "under-review" }]);
    notify(`${file.name} uploaded and queued for review.`);
  };

  const changePassword = () => {
    setPasswordError("");
    if (!password.current) return setPasswordError("Enter your current password.");
    if (password.next.length < 8) return setPasswordError("New password must be at least 8 characters.");
    if (password.next === password.current) return setPasswordError("New password must be different from the current password.");
    if (password.next !== password.confirm) return setPasswordError("New passwords do not match.");
    setPassword({ current: "", next: "", confirm: "" });
    notify("Password updated successfully.");
  };

  const signOutOthers = () => {
    setSessions((prev) => prev.filter((item) => item.current));
    notify("All other sessions signed out.", "info");
  };

  const deactivate = () => {
    updateUser(currentRecipient.id, { status: "inactive" });
    setDeactivated(true);
    setDeactivateOpen(false);
  };

  const reactivate = () => {
    updateUser(currentRecipient.id, { status: "active" });
    setDeactivated(false);
  };

  return (
    <>
      <PageHeader
        title="Organization Profile"
        description="Manage your recipient account, eligibility, documents, and account security."
        actions={<Button variant="outline" onClick={saveProfile}><CheckCircle2 className="h-4 w-4" /> Save profile</Button>}
      />

      {deactivated ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#F2C5C1] bg-error p-3 text-small text-[#8C2F27]">
          <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Your account is inactive. New reservations are paused.</span>
          <Button size="sm" onClick={reactivate}>Reactivate account</Button>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <SectionCard>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative">
                <span className="grid h-20 w-20 place-items-center rounded-2xl bg-[#2F6B5A] text-h1 font-bold text-white">IH</span>
                <button
                  type="button"
                  onClick={() => notify("Profile photo upload is simulated for this demo.")}
                  className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border border-line bg-white text-primary shadow-sm"
                  aria-label="Change profile photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-h2 text-ink">{profile.organization}</h2>
                  <StatusBadge status={deactivated ? "inactive" : "approved"} label={deactivated ? "Inactive" : "Approved"} />
                </div>
                <p className="mt-0.5 text-small text-muted">{profile.name} · {profile.recipientType}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-muted">
                  <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {profile.email}</span>
                  <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {profile.phone}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {profile.location}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4 text-center sm:grid-cols-4">
              <div><p className="text-h3 text-ink">{completed.length}</p><p className="text-caption text-muted">Collections</p></div>
              <div><p className="text-h3 text-ink">{received} kg</p><p className="text-caption text-muted">Received</p></div>
              <div><p className="text-h3 text-ink">{donors.size}</p><p className="text-caption text-muted">Donors</p></div>
              <div><p className="text-h3 text-ink">{memberSince}</p><p className="text-caption text-muted">Member since</p></div>
            </div>
          </SectionCard>

          <SectionCard title="Organization Details" description="Used for matching, eligibility, and donor coordination">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact name" htmlFor="recipient-name" required error={errors.name}>
                <Input id="recipient-name" value={profile.name} onChange={(event) => { setProfile((prev) => ({ ...prev, name: event.target.value })); setErrors((prev) => ({ ...prev, name: "" })); }} />
              </Field>
              <Field label="Organization name" htmlFor="recipient-org" required error={errors.organization}>
                <Input id="recipient-org" value={profile.organization} onChange={(event) => { setProfile((prev) => ({ ...prev, organization: event.target.value })); setErrors((prev) => ({ ...prev, organization: "" })); }} />
              </Field>
              <Field label="Email address" htmlFor="recipient-email" required error={errors.email}>
                <Input id="recipient-email" type="email" value={profile.email} onChange={(event) => { setProfile((prev) => ({ ...prev, email: event.target.value })); setErrors((prev) => ({ ...prev, email: "" })); }} />
              </Field>
              <Field label="Phone number" htmlFor="recipient-phone" required error={errors.phone}>
                <Input id="recipient-phone" value={profile.phone} onChange={(event) => { setProfile((prev) => ({ ...prev, phone: event.target.value })); setErrors((prev) => ({ ...prev, phone: "" })); }} />
              </Field>
              <Field label="Recipient type" htmlFor="recipient-type">
                <Select id="recipient-type" value={profile.recipientType} onChange={(event) => setProfile((prev) => ({ ...prev, recipientType: event.target.value }))}>
                  <option>Community Organization</option>
                  <option>School</option>
                  <option>Shelter</option>
                  <option>Individual</option>
                  <option>Religious Institution</option>
                </Select>
              </Field>
              <Field label="Account type" htmlFor="recipient-account">
                <Select id="recipient-account" value={profile.accountType} onChange={(event) => setProfile((prev) => ({ ...prev, accountType: event.target.value as AppUser["accountType"] }))}>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                </Select>
              </Field>
              <Field label="Address" htmlFor="recipient-location" required error={errors.location}>
                <Input id="recipient-location" value={profile.location} onChange={(event) => { setProfile((prev) => ({ ...prev, location: event.target.value })); setErrors((prev) => ({ ...prev, location: "" })); }} />
              </Field>
              <Field label="People served per day" htmlFor="recipient-people" required error={errors.peopleServed}>
                <Input id="recipient-people" type="number" min={1} value={profile.peopleServed} onChange={(event) => { setProfile((prev) => ({ ...prev, peopleServed: event.target.value })); setErrors((prev) => ({ ...prev, peopleServed: "" })); }} />
              </Field>
              <Field label="Service area" htmlFor="recipient-area" required error={errors.serviceArea} className="sm:col-span-2">
                <Input id="recipient-area" value={profile.serviceArea} onChange={(event) => { setProfile((prev) => ({ ...prev, serviceArea: event.target.value })); setErrors((prev) => ({ ...prev, serviceArea: "" })); }} />
              </Field>
              <Field label="About your organization" htmlFor="recipient-about" className="sm:col-span-2">
                <Textarea id="recipient-about" rows={3} value={profile.about} onChange={(event) => setProfile((prev) => ({ ...prev, about: event.target.value }))} />
              </Field>
            </div>
            <div className="mt-4 flex justify-end"><Button onClick={saveProfile}>Save changes</Button></div>
          </SectionCard>

          <SectionCard
            title="Verification Documents"
            description={`${documentSummary.verified} verified · ${documentSummary.pending} under review`}
            action={
              <label htmlFor="recipient-document-upload" className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl bg-lightgreen px-3 text-caption font-semibold text-primary transition hover:bg-[#d8e9de]">
                <Plus className="h-3.5 w-3.5" /> Upload document
                <input id="recipient-document-upload" type="file" accept="image/png,image/jpeg,application/pdf" className="sr-only" onChange={(event) => uploadDocument(event.target.files?.[0])} />
              </label>
            }
            bodyClassName="p-0 md:p-0"
          >
            <ul className="divide-y divide-line">
              {docs.map((doc) => (
                <li key={`${doc.name}-${doc.uploaded}`} className="flex flex-wrap items-center gap-3 p-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lightgreen text-primary"><FileText className="h-4 w-4" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-label font-medium text-ink">{doc.name}</p>
                    <p className="text-caption text-muted">Uploaded {doc.uploaded}</p>
                  </div>
                  <StatusBadge status={doc.status} />
                  <button type="button" onClick={() => setViewDoc(doc)} className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition hover:text-primary" aria-label={`View ${doc.name}`}>
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setDocs((prev) => prev.filter((item) => item !== doc)); notify(`${doc.name} removed.`); }}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition hover:border-error hover:bg-error hover:text-[#8C2F27]"
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
              {docs.length === 0 ? <li className="p-6 text-center text-small text-muted">No documents uploaded yet.</li> : null}
            </ul>
            <div className="border-t border-line p-4 text-caption text-muted">
              Eligibility depends on verified documents. Uploading new documents may require administrator review.
            </div>
          </SectionCard>
        </div>

        <aside className="space-y-4">
          <SectionCard title="Eligibility & Approval">
            <div className="flex items-start gap-2 rounded-xl bg-success p-3">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1D6A3E]" />
              <div>
                <p className="text-label font-semibold text-ink">Approved recipient</p>
                <p className="mt-0.5 text-caption text-muted">Eligible to reserve verified food and receive AI matches.</p>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-caption">
              <li className="flex items-center gap-1.5 text-muted"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Identity and organization verified</li>
              <li className="flex items-center gap-1.5 text-muted"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Service area eligible for matching</li>
              <li className="flex items-center gap-1.5 text-muted"><CheckCircle2 className="h-3.5 w-3.5 text-secondary" /> Urgency priority: high</li>
            </ul>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => notify("Eligibility review requested. An administrator will follow up.")}>
              <HeartHandshake className="h-3.5 w-3.5" /> Request eligibility review
            </Button>
            <p className="mt-2 flex items-center gap-1.5 text-caption text-muted"><UtensilsCrossed className="h-3.5 w-3.5 text-secondary" /> Serving about {profile.peopleServed} people daily</p>
          </SectionCard>

          <SectionCard title="Notification Preferences">
            <div className="space-y-1">
              <SettingRow title="New AI food matches" description="Alerts when eligible food is matched to you."><Toggle checked={prefs.match} onChange={(value) => setPrefs((prev) => ({ ...prev, match: value }))} label="Match alerts" /></SettingRow>
              <SettingRow title="Reservation reminders" description="Confirmation deadlines and hold expiries."><Toggle checked={prefs.reservation} onChange={(value) => setPrefs((prev) => ({ ...prev, reservation: value }))} label="Reservation reminders" /></SettingRow>
              <SettingRow title="Collection reminders" description="Upcoming pickups and collection windows."><Toggle checked={prefs.collection} onChange={(value) => setPrefs((prev) => ({ ...prev, collection: value }))} label="Collection reminders" /></SettingRow>
              <SettingRow title="Status updates" description="Donation approvals, declines, and changes."><Toggle checked={prefs.status} onChange={(value) => setPrefs((prev) => ({ ...prev, status: value }))} label="Status updates" /></SettingRow>
              <SettingRow title="In-app notifications" description="Show alerts in the notification center."><Toggle checked={prefs.push} onChange={(value) => setPrefs((prev) => ({ ...prev, push: value }))} label="In-app notifications" /></SettingRow>
              <SettingRow title="Urgent SMS alerts" description="SMS for urgent collection changes."><Toggle checked={prefs.sms} onChange={(value) => setPrefs((prev) => ({ ...prev, sms: value }))} label="Urgent SMS alerts" /></SettingRow>
            </div>
            <Button size="sm" className="mt-3 w-full" onClick={() => notify("Notification preferences saved.")}>Save preferences</Button>
          </SectionCard>

          <SectionCard title="Language">
            <Field label="Interface language" htmlFor="recipient-language" hint="Applies to labels and page navigation.">
              <Select id="recipient-language" value={language} onChange={(event) => setLanguage(event.target.value as "en" | "bn")}>
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
              </Select>
            </Field>
            <p className="mt-2 flex items-center gap-1.5 text-caption text-muted"><Globe2 className="h-3.5 w-3.5 text-secondary" /> Changes apply immediately.</p>
          </SectionCard>

          <SectionCard title="Security">
            <SettingRow title="Two-factor authentication" description="Require a verification code at sign-in.">
              <Toggle checked={twoFactor} onChange={(value) => { setTwoFactor(value); notify(`Two-factor authentication ${value ? "enabled" : "disabled"}.`); }} label="Two-factor authentication" />
            </SettingRow>
            <div className="mt-3 space-y-3 border-t border-line pt-3">
              <p className="flex items-center gap-1.5 text-label font-semibold text-ink"><KeyRound className="h-4 w-4 text-secondary" /> Change password</p>
              <Field label="Current password" htmlFor="recipient-current-password">
                <Input id="recipient-current-password" type="password" value={password.current} onChange={(event) => setPassword((prev) => ({ ...prev, current: event.target.value }))} />
              </Field>
              <Field label="New password" htmlFor="recipient-new-password">
                <Input id="recipient-new-password" type="password" value={password.next} onChange={(event) => setPassword((prev) => ({ ...prev, next: event.target.value }))} />
              </Field>
              <Field label="Confirm new password" htmlFor="recipient-confirm-password" error={passwordError}>
                <Input id="recipient-confirm-password" type="password" value={password.confirm} onChange={(event) => setPassword((prev) => ({ ...prev, confirm: event.target.value }))} />
              </Field>
              <Button size="sm" variant="outline" className="w-full" onClick={changePassword}>Update password</Button>
            </div>
          </SectionCard>

          <SectionCard title="Active Sessions">
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id} className="flex items-start gap-2 rounded-xl border border-line p-2.5">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-caption font-medium text-ink">{session.device}</p>
                    <p className="text-caption text-muted">{session.location} · {session.lastActive}</p>
                  </div>
                  {session.current ? <span className="rounded-full bg-success px-2 py-0.5 text-caption text-[#1D6A3E]">Current</span> : null}
                </li>
              ))}
            </ul>
            <Button size="sm" variant="outline" className="mt-3 w-full" onClick={signOutOthers} disabled={sessions.length <= 1}>
              <LogOut className="h-3.5 w-3.5" /> Sign out other sessions
            </Button>
          </SectionCard>

          <SectionCard title="Account">
            <p className="flex items-center gap-1.5 text-caption text-muted"><Building2 className="h-3.5 w-3.5 text-secondary" /> {profile.accountType} recipient · {memberSince}</p>
            <p className="mt-1 flex items-center gap-1.5 text-caption text-muted"><Users className="h-3.5 w-3.5 text-secondary" /> Approved for food redistribution</p>
            <div className="mt-3 border-t border-line pt-3">
              <p className="text-caption font-semibold uppercase tracking-wide text-[#8C2F27]">Danger zone</p>
              <p className="mt-1 text-caption text-muted">Deactivating pauses new reservations and matching. Your history is retained.</p>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={() => setDeactivateOpen(true)} disabled={deactivated}>
                <AlertTriangle className="h-3.5 w-3.5" /> Deactivate account
              </Button>
            </div>
          </SectionCard>
        </aside>
      </div>

      <Modal
        open={Boolean(viewDoc)}
        onClose={() => setViewDoc(null)}
        title={viewDoc?.name ?? "Document"}
        description={viewDoc ? `Uploaded ${viewDoc.uploaded}` : ""}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewDoc(null)}>Close</Button>
            <Button onClick={() => notify(`${viewDoc?.name} download is simulated for this demo.`)}><Download className="h-4 w-4" /> Download</Button>
          </>
        }
      >
        <div className="grid place-items-center rounded-xl border border-dashed border-line bg-page py-12 text-center">
          <FileText className="h-10 w-10 text-secondary" />
          <p className="mt-2 text-small font-medium text-ink">{viewDoc?.name}</p>
          <p className="text-caption text-muted">Document preview placeholder</p>
          {viewDoc ? <div className="mt-2"><StatusBadge status={viewDoc.status} /></div> : null}
        </div>
        <p className="mt-3 flex items-start gap-2 text-caption text-muted">
          <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
          Documents are stored securely and are only visible to administrators reviewing your eligibility.
        </p>
      </Modal>

      <ConfirmDialog
        open={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        onConfirm={deactivate}
        variant="danger"
        title="Deactivate your account?"
        description="New reservations and AI matching will pause. You can reactivate your account later from this page."
        confirmLabel="Deactivate account"
        cancelLabel="Keep active"
        icon={<AlertTriangle className="h-5 w-5 text-[#8C2F27]" />}
      />
    </>
  );
}
