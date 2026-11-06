"use client";

import { useState } from "react";
import {
  BellRing,
  Check,
  Globe2,
  ImageIcon,
  Leaf,
  LockKeyhole,
  Plus,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  UserCog,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-0">
      <div className="min-w-0">
        <p className="text-label font-medium text-ink">{title}</p>
        {description ? <p className="mt-0.5 text-caption text-muted">{description}</p> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const tabs = [
  { value: "general", label: "General", icon: SlidersHorizontal },
  { value: "language", label: "Language", icon: Globe2 },
  { value: "categories", label: "Food Categories", icon: UtensilsCrossed },
  { value: "safety", label: "Food Safety", icon: ShieldCheck },
  { value: "matching", label: "Matching", icon: Users },
  { value: "notifications", label: "Notifications", icon: BellRing },
  { value: "permissions", label: "Permissions", icon: LockKeyhole },
  { value: "admins", label: "Admin Access", icon: UserCog },
];

export default function AdminSettingsPage() {
  const { notify, language, setLanguage } = useApp();
  const [tab, setTab] = useState("general");
  const [general, setGeneral] = useState({
    name: "Smart Food Exchange",
    email: "hello@smartfoodexchange.org",
    phone: "+880 1700 000 111",
    timezone: "Asia/Dhaka (GMT+6)",
    tagline: "Food Redistribution Platform",
  });
  const [logo, setLogo] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState(language);
  const [englishEnabled, setEnglishEnabled] = useState(true);
  const [bengaliEnabled, setBengaliEnabled] = useState(true);
  const [categories, setCategories] = useState([
    "Prepared Food",
    "Packaged Food",
    "Produce",
    "Bakery",
    "Refrigerated",
    "Frozen",
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [safety, setSafety] = useState({
    expiryCheck: true,
    coldChainTemperature: true,
    allergenRequired: false,
    photoRequired: true,
    manualReview: true,
    maxHoldHours: 4,
  });
  const [matching, setMatching] = useState({
    urgencyWeight: 70,
    maxRecipients: 3,
    holdHours: 2,
    radius: 10,
    autoRelease: true,
  });
  const [prefs, setPrefs] = useState({
    emailNewDonation: true,
    emailReview: true,
    emailReservation: true,
    emailDigest: false,
    pushAll: true,
    smsUrgent: false,
  });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    donorEditApproved: false,
    donorCancelReserved: true,
    recipientViewContact: true,
    recipientMultipleReservations: true,
    adminEditDonations: true,
    adminDeleteUsers: false,
  });
  const [admins, setAdmins] = useState([
    { id: "A-001", name: "Ayesha Rahman", email: "admin@smartfoodexchange.org", role: "Super administrator", twoFactor: true, lastActive: "Today, 9:12 AM" },
    { id: "A-002", name: "Mahmud Karim", email: "mahmud@smartfoodexchange.org", role: "Food safety reviewer", twoFactor: false, lastActive: "Yesterday, 4:40 PM" },
    { id: "A-003", name: "Farzana Islam", email: "farzana@smartfoodexchange.org", role: "Account reviewer", twoFactor: true, lastActive: "Nov 4, 11:20 AM" },
  ]);
  const [newAdmin, setNewAdmin] = useState("");

  const save = (section: string) => {
    notify(`${section} settings saved.`);
    if (section === "General" || section === "Language") setLanguage(defaultLanguage);
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;
    if (categories.includes(newCategory.trim())) {
      notify("That category already exists.", "error");
      return;
    }
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
    notify("Food category added.");
  };

  const addAdmin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin)) {
      notify("Enter a valid administrator email.", "error");
      return;
    }
    setAdmins((prev) => [
      ...prev,
      {
        id: `A-${String(prev.length + 1).padStart(3, "0")}`,
        name: newAdmin.split("@")[0].replace(/[._]/g, " "),
        email: newAdmin,
        role: "Administrator",
        twoFactor: false,
        lastActive: "Invitation sent",
      },
    ]);
    setNewAdmin("");
    notify("Administrator invitation sent.");
  };

  return (
    <>
      <PageHeader
        title="Platform Settings"
        description="Configure platform identity, food safety rules, matching behaviour, and administrator access."
        actions={<Button onClick={() => save(tabs.find((item) => item.value === tab)?.label ?? "Platform")}><Save className="h-4 w-4" /> Save changes</Button>}
      />

      <div className="mt-5 grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="card h-fit p-2">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col scrollbar-thin" aria-label="Settings sections">
            {tabs.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTab(item.value)}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-label transition",
                    tab === item.value ? "bg-primary text-white" : "text-muted hover:bg-lightgreen hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === "general" ? (
            <SectionCard title="General Settings" description="Platform identity and contact details" action={<Button size="sm" onClick={() => save("General")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Platform name" htmlFor="platform-name" required>
                  <Input id="platform-name" value={general.name} onChange={(e) => setGeneral((prev) => ({ ...prev, name: e.target.value }))} />
                </Field>
                <Field label="Tagline" htmlFor="platform-tagline">
                  <Input id="platform-tagline" value={general.tagline} onChange={(e) => setGeneral((prev) => ({ ...prev, tagline: e.target.value }))} />
                </Field>
                <Field label="Support email" htmlFor="platform-email" required>
                  <Input id="platform-email" type="email" value={general.email} onChange={(e) => setGeneral((prev) => ({ ...prev, email: e.target.value }))} />
                </Field>
                <Field label="Support phone" htmlFor="platform-phone">
                  <Input id="platform-phone" value={general.phone} onChange={(e) => setGeneral((prev) => ({ ...prev, phone: e.target.value }))} />
                </Field>
                <Field label="Timezone" htmlFor="platform-timezone">
                  <Select id="platform-timezone" value={general.timezone} onChange={(e) => setGeneral((prev) => ({ ...prev, timezone: e.target.value }))}>
                    <option>Asia/Dhaka (GMT+6)</option>
                    <option>Asia/Kolkata (GMT+5:30)</option>
                    <option>UTC (GMT+0)</option>
                  </Select>
                </Field>
                <Field label="Platform description" htmlFor="platform-desc" className="sm:col-span-2">
                  <Textarea id="platform-desc" rows={3} defaultValue="Reduce food waste by connecting food donors with eligible recipients through verified donations and AI-assisted matching." />
                </Field>
              </div>
              <div className="mt-4 border-t border-line pt-4">
                <p className="text-label font-semibold text-ink">Logo settings</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-line bg-lightgreen text-primary">
                    {logo ? <img src={logo} alt="Platform logo preview" className="h-full w-full object-cover" /> : <Leaf className="h-7 w-7" />}
                  </span>
                  <div>
                    <label htmlFor="logo-upload" className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-caption font-semibold text-ink hover:border-secondary hover:text-primary">
                      <ImageIcon className="h-3.5 w-3.5" /> Upload logo
                    </label>
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          setLogo(URL.createObjectURL(file));
                          notify("Logo updated. Save changes to apply.");
                        }
                      }}
                    />
                    <p className="mt-1 text-caption text-muted">PNG, JPG, or SVG · recommended 512×512</p>
                  </div>
                  {logo ? (
                    <Button size="sm" variant="ghost" onClick={() => setLogo("")}><Trash2 className="h-3.5 w-3.5" /> Remove</Button>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          ) : null}

          {tab === "language" ? (
            <SectionCard title="Language Settings" description="English and Bengali interface support" action={<Button size="sm" onClick={() => save("Language")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-1">
                <SettingRow title="English interface" description="Enable English labels, content, and notifications.">
                  <Toggle checked={englishEnabled} onChange={setEnglishEnabled} label="Enable English" />
                </SettingRow>
                <SettingRow title="Bengali interface" description="Enable Bengali labels, content, and notifications.">
                  <Toggle checked={bengaliEnabled} onChange={setBengaliEnabled} label="Enable Bengali" />
                </SettingRow>
                <SettingRow title="Default language" description="Applied to new accounts and public pages.">
                  <Select value={defaultLanguage} onChange={(event) => setDefaultLanguage(event.target.value as "en" | "bn")} className="w-auto">
                    <option value="en" disabled={!englishEnabled}>English</option>
                    <option value="bn" disabled={!bengaliEnabled}>বাংলা</option>
                  </Select>
                </SettingRow>
              </div>
              <div className="mt-4 rounded-xl bg-lightgreen p-4">
                <p className="text-label font-semibold text-primary">Preview</p>
                <p className={cn("mt-1 text-h3 text-ink", defaultLanguage === "bn" && "font-bangla")}>
                  {defaultLanguage === "bn" ? "স্মার্ট ফুড এক্সচেঞ্জ" : "Smart Food Exchange"}
                </p>
                <p className="text-small text-muted">
                  {defaultLanguage === "bn" ? "খাদ্য পুনর্বণ্টন প্ল্যাটফর্ম" : "Food Redistribution Platform"}
                </p>
                <Button size="sm" variant="outline" className="mt-2" onClick={() => setLanguage(defaultLanguage)}>Apply preview language</Button>
              </div>
            </SectionCard>
          ) : null}

          {tab === "categories" ? (
            <SectionCard title="Food Categories" description="Categories available to donors when creating a donation" action={<Button size="sm" onClick={() => save("Food category")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5">
                    <span className="flex items-center gap-2 text-small text-ink"><UtensilsCrossed className="h-4 w-4 text-secondary" /> {category}</span>
                    <button
                      type="button"
                      onClick={() => { setCategories((prev) => prev.filter((item) => item !== category)); notify(`${category} removed.`); }}
                      className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-error hover:text-[#8C2F27]"
                      aria-label={`Remove ${category}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Add a new food category" aria-label="New food category" />
                <Button onClick={addCategory}><Plus className="h-4 w-4" /> Add category</Button>
              </div>
            </SectionCard>
          ) : null}

          {tab === "safety" ? (
            <SectionCard title="Food Safety Rules" description="Automated verification rules applied before matching" action={<Button size="sm" onClick={() => save("Food safety")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-1">
                <SettingRow title="Expiry validation" description="Reject donations already past their expiry time."><Toggle checked={safety.expiryCheck} onChange={(value) => setSafety((prev) => ({ ...prev, expiryCheck: value }))} label="Expiry validation" /></SettingRow>
                <SettingRow title="Cold chain temperature required" description="Require temperature details for refrigerated and frozen food."><Toggle checked={safety.coldChainTemperature} onChange={(value) => setSafety((prev) => ({ ...prev, coldChainTemperature: value }))} label="Cold chain temperature" /></SettingRow>
                <SettingRow title="Allergen declaration required" description="Flag donations with no allergen information for review."><Toggle checked={safety.allergenRequired} onChange={(value) => setSafety((prev) => ({ ...prev, allergenRequired: value }))} label="Allergen declaration" /></SettingRow>
                <SettingRow title="Food photographs required" description="At least one photo is needed before review."><Toggle checked={safety.photoRequired} onChange={(value) => setSafety((prev) => ({ ...prev, photoRequired: value }))} label="Food photographs required" /></SettingRow>
                <SettingRow title="Manual review for flagged items" description="Flagged donations always require administrator approval."><Toggle checked={safety.manualReview} onChange={(value) => setSafety((prev) => ({ ...prev, manualReview: value }))} label="Manual review" /></SettingRow>
                <SettingRow title="Maximum holding time (hours)" description="Prepared food exceeding this hold time is flagged.">
                  <Input type="number" min={1} max={24} value={safety.maxHoldHours} onChange={(event) => setSafety((prev) => ({ ...prev, maxHoldHours: Number(event.target.value) }))} className="w-20" />
                </SettingRow>
              </div>
              <div className="mt-4 rounded-xl border border-[#F0DFA8] bg-warning/60 p-3 text-caption text-[#7A5A0B]">
                Automated verification is advisory. A passed check does not guarantee food safety.
              </div>
            </SectionCard>
          ) : null}

          {tab === "matching" ? (
            <SectionCard title="Matching Configuration" description="Control how AI prioritises and holds food for recipients" action={<Button size="sm" onClick={() => save("Matching")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-label">
                    <span className="text-ink">Urgency weight</span>
                    <span className="font-semibold text-primary">{matching.urgencyWeight}%</span>
                  </div>
                  <input type="range" min={0} max={100} value={matching.urgencyWeight} onChange={(event) => setMatching((prev) => ({ ...prev, urgencyWeight: Number(event.target.value) }))} className="mt-2 w-full accent-[#245C45]" aria-label="Urgency weight" />
                  <p className="mt-1 text-caption text-muted">Remaining weight is allocated to match score ({100 - matching.urgencyWeight}%).</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Maximum recipients per donation" htmlFor="max-recipients">
                    <Select id="max-recipients" value={matching.maxRecipients} onChange={(event) => setMatching((prev) => ({ ...prev, maxRecipients: Number(event.target.value) }))}>
                      <option value={1}>1 recipient</option>
                      <option value={2}>2 recipients</option>
                      <option value={3}>3 recipients</option>
                      <option value={5}>5 recipients</option>
                    </Select>
                  </Field>
                  <Field label="Provisional hold duration" htmlFor="hold-hours">
                    <Select id="hold-hours" value={matching.holdHours} onChange={(event) => setMatching((prev) => ({ ...prev, holdHours: Number(event.target.value) }))}>
                      <option value={1}>1 hour</option>
                      <option value={2}>2 hours</option>
                      <option value={4}>4 hours</option>
                      <option value={8}>8 hours</option>
                    </Select>
                  </Field>
                  <Field label="Matching radius (km)" htmlFor="radius">
                    <Input id="radius" type="number" min={1} value={matching.radius} onChange={(event) => setMatching((prev) => ({ ...prev, radius: Number(event.target.value) }))} />
                  </Field>
                  <div className="flex items-end">
                    <SettingRow title="Auto-release expired holds" description="Return held quantity to available stock.">
                      <Toggle checked={matching.autoRelease} onChange={(value) => setMatching((prev) => ({ ...prev, autoRelease: value }))} label="Auto-release expired holds" />
                    </SettingRow>
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {tab === "notifications" ? (
            <SectionCard title="Notification Preferences" description="Platform-wide notification channels and triggers" action={<Button size="sm" onClick={() => save("Notification")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-1">
                <SettingRow title="New donation alerts" description="Notify administrators when a donation is submitted."><Toggle checked={prefs.emailNewDonation} onChange={(value) => setPrefs((prev) => ({ ...prev, emailNewDonation: value }))} label="New donation alerts" /></SettingRow>
                <SettingRow title="Verification outcomes" description="Email donors when food is approved, rejected, or flagged."><Toggle checked={prefs.emailReview} onChange={(value) => setPrefs((prev) => ({ ...prev, emailReview: value }))} label="Verification outcomes" /></SettingRow>
                <SettingRow title="Reservation updates" description="Notify both parties about confirmations, declines, and collections."><Toggle checked={prefs.emailReservation} onChange={(value) => setPrefs((prev) => ({ ...prev, emailReservation: value }))} label="Reservation updates" /></SettingRow>
                <SettingRow title="Daily digest" description="Send administrators a daily summary of platform activity."><Toggle checked={prefs.emailDigest} onChange={(value) => setPrefs((prev) => ({ ...prev, emailDigest: value }))} label="Daily digest" /></SettingRow>
                <SettingRow title="In-app notifications" description="Show all platform notifications in the notification center."><Toggle checked={prefs.pushAll} onChange={(value) => setPrefs((prev) => ({ ...prev, pushAll: value }))} label="In-app notifications" /></SettingRow>
                <SettingRow title="Urgent SMS alerts" description="Send SMS for expiring reservations and urgent food safety issues."><Toggle checked={prefs.smsUrgent} onChange={(value) => setPrefs((prev) => ({ ...prev, smsUrgent: value }))} label="Urgent SMS alerts" /></SettingRow>
              </div>
            </SectionCard>
          ) : null}

          {tab === "permissions" ? (
            <SectionCard title="User Permissions" description="Control what each role can do" action={<Button size="sm" onClick={() => save("Permission")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-1">
                {[
                  ["donorEditApproved", "Donors can edit approved donations", "Allow donors to change quantity or details after verification."],
                  ["donorCancelReserved", "Donors can cancel reserved donations", "Cancelling releases any held quantity back to the platform."],
                  ["recipientViewContact", "Recipients can view donor contact details", "Only for confirmed reservations."],
                  ["recipientMultipleReservations", "Recipients can hold multiple reservations", "Subject to eligibility and availability rules."],
                  ["adminEditDonations", "Administrators can edit donation quantities", "Required for resolving discrepancies."],
                  ["adminDeleteUsers", "Administrators can permanently delete users", "Deactivated accounts are recommended instead."],
                ].map(([key, title, description]) => (
                  <SettingRow key={key} title={title} description={description}>
                    <Toggle checked={permissions[key]} onChange={(value) => setPermissions((prev) => ({ ...prev, [key]: value }))} label={title} />
                  </SettingRow>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {tab === "admins" ? (
            <SectionCard title="Administrator Access" description="Manage administrator accounts and security" action={<Button size="sm" onClick={() => save("Administrator access")}><Save className="h-3.5 w-3.5" /> Save</Button>}>
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-small font-semibold text-white">
                      {admin.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-label font-semibold text-ink">{admin.name}</p>
                      <p className="truncate text-caption text-muted">{admin.email} · {admin.role}</p>
                      <p className="text-caption text-muted">Last active: {admin.lastActive}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption", admin.twoFactor ? "bg-success text-[#1D6A3E]" : "bg-warning text-[#7A5A0B]")}>
                        {admin.twoFactor ? <Check className="h-3 w-3" /> : null} 2FA {admin.twoFactor ? "on" : "off"}
                      </span>
                      <Toggle
                        checked={admin.twoFactor}
                        onChange={(value) => {
                          setAdmins((prev) => prev.map((item) => (item.id === admin.id ? { ...item, twoFactor: value } : item)));
                          notify(`Two-factor authentication ${value ? "enabled" : "disabled"} for ${admin.name}.`);
                        }}
                        label={`Toggle two-factor for ${admin.name}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Input value={newAdmin} onChange={(event) => setNewAdmin(event.target.value)} placeholder="new.admin@smartfoodexchange.org" aria-label="New administrator email" />
                <Button onClick={addAdmin}><Plus className="h-4 w-4" /> Invite administrator</Button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Field label="Session timeout" htmlFor="session-timeout">
                  <Select id="session-timeout" defaultValue="30">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="240">4 hours</option>
                  </Select>
                </Field>
                <Field label="Minimum password length" htmlFor="password-length">
                  <Select id="password-length" defaultValue="10">
                    <option value="8">8 characters</option>
                    <option value="10">10 characters</option>
                    <option value="12">12 characters</option>
                  </Select>
                </Field>
              </div>
            </SectionCard>
          ) : null}
        </div>
      </div>
    </>
  );
}
