"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Info,
  Leaf,
  ShieldCheck,
  Upload,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

type Role = "donor" | "recipient";

function RegisterForm() {
  const params = useSearchParams();
  const initialRole = params.get("role") === "recipient" ? "recipient" : "donor";
  const { notify } = useApp();

  const [role, setRole] = useState<Role>(initialRole);
  const [accountType, setAccountType] = useState<"Individual" | "Organization">("Organization");
  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    phone: "",
    address: "",
    city: "Dhaka",
    password: "",
    confirmPassword: "",
    categories: "",
    bio: "",
    terms: false,
  });
  const [files, setFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your full name.";
    if (accountType === "Organization" && !form.organization.trim())
      next.organization = "Organization name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!/^[+0-9 ()-]{8,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.address.trim()) next.address = "Please enter your address.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (role === "recipient" && files.length === 0)
      next.files = "Recipient accounts require at least one supporting document.";
    if (!form.terms) next.terms = "Please accept the platform terms to continue.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const first = document.querySelector<HTMLElement>("[data-error='true']");
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitted(true);
    notify(
      role === "recipient"
        ? "Application submitted. Administrator approval is required."
        : "Donor account created. You can start adding donations."
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center md:py-16">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success text-[#1D6A3E]">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-4 text-h1 text-ink">
          {role === "recipient" ? "Application submitted" : "Welcome to the exchange"}
        </h1>
        <p className="mt-2 text-small text-muted">
          {role === "recipient"
            ? "Your recipient application is now pending administrator review. Individual recipient accounts always require approval. You will be notified once a decision is made."
            : "Your donor account is ready. You can add your first food donation and track verification from your dashboard."}
        </p>
        <div className="mt-5 rounded-2xl border border-line bg-white p-4 text-left">
          <p className="text-label font-semibold text-ink">What happens next?</p>
          <ol className="mt-2 space-y-2 text-small text-muted">
            {(role === "recipient"
              ? ["Administrator reviews your documents", "Approval decision sent by email", "Access available food once approved"]
              : ["Add your first donation", "Automated verification checks food safety details", "Eligible recipients are matched by AI"]
            ).map((item, index) => (
              <li key={item} className="flex items-start gap-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lightgreen text-caption font-semibold text-primary">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
          <Link
            href={role === "recipient" ? "/login" : "/donor/dashboard"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-btn text-white hover:bg-[#1d4c39]"
          >
            {role === "recipient" ? "Go to login" : "Open donor dashboard"} <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-5 text-btn text-ink hover:border-secondary"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-8 md:py-12">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-lightgreen px-3 py-1 text-caption font-medium text-primary">
          <Leaf className="h-3.5 w-3.5" /> Join Smart Food Exchange
        </span>
        <h1 className="mt-3 text-h1 text-ink">Create your account</h1>
        <p className="mt-1 text-small text-muted">
          Register as a food donor or a verified food recipient.
        </p>
      </div>

      <div className="card mt-6 p-4 md:p-6">
        <div>
          <p className="text-label font-semibold text-ink">I want to join as</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { id: "donor" as Role, title: "Food Donor", desc: "Share surplus food", icon: HeartHandshake },
              { id: "recipient" as Role, title: "Food Recipient", desc: "Receive eligible food", icon: Users },
            ].map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border p-3 text-left transition",
                    role === option.id
                      ? "border-primary bg-lightgreen"
                      : "border-line bg-white hover:border-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                      role === option.id ? "bg-primary text-white" : "bg-lightgreen text-primary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-label font-semibold text-ink">{option.title}</span>
                    <span className="block text-caption text-muted">{option.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {role === "recipient" ? (
            <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-warning/60 px-3 py-2 text-caption text-[#7A5A0B]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Recipient accounts, including individual applicants, require administrator approval before food can be reserved.
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="label">Account type <span className="text-[#B4473D]">*</span></p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "Individual" as const, icon: User },
                  { id: "Organization" as const, icon: Building2 },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setAccountType(option.id)}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-label transition",
                        accountType === option.id
                          ? "border-primary bg-lightgreen text-primary"
                          : "border-line bg-white text-muted hover:border-secondary"
                      )}
                    >
                      <Icon className="h-4 w-4" /> {option.id}
                    </button>
                  );
                })}
              </div>
            </div>

            <Field label="Full name" htmlFor="name" required error={errors.name}>
              <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" />
            </Field>
            {accountType === "Organization" ? (
              <Field label="Organization name" htmlFor="organization" required error={errors.organization}>
                <Input id="organization" value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="Organization or business name" />
              </Field>
            ) : (
              <Field label="District" htmlFor="district" required>
                <Select id="district" value={form.city} onChange={(e) => update("city", e.target.value)}>
                  {["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"].map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </Select>
              </Field>
            )}
            <Field label="Email address" htmlFor="email" required error={errors.email}>
              <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field label="Phone number" htmlFor="phone" required error={errors.phone}>
              <Input id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+880 17xx xxx xxx" />
            </Field>
            <Field label="Address" htmlFor="address" required error={errors.address} className="sm:col-span-2">
              <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, area, city" />
            </Field>
            <Field label="Password" htmlFor="password" required error={errors.password} hint="At least 8 characters">
              <Input id="password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" />
            </Field>
            <Field label="Confirm password" htmlFor="confirmPassword" required error={errors.confirmPassword}>
              <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} autoComplete="new-password" />
            </Field>
            {role === "recipient" ? (
              <Field label="Preferred food categories" htmlFor="categories" className="sm:col-span-2" hint="Optional — helps prioritise AI matches">
                <Input id="categories" value={form.categories} onChange={(e) => update("categories", e.target.value)} placeholder="Prepared food, Produce, Bakery" />
              </Field>
            ) : (
              <Field label="About your food program" htmlFor="bio" className="sm:col-span-2" hint="Optional">
                <Textarea id="bio" rows={3} value={form.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Tell recipients about the food you usually donate." />
              </Field>
            )}

            <Field
              label={role === "recipient" ? "Supporting documents" : "Business or food safety documents"}
              htmlFor="documents"
              required={role === "recipient"}
              error={errors.files}
              hint="PDF, JPG, or PNG. National ID, trade license, NGO registration, or food safety certificate."
              className="sm:col-span-2"
            >
              <label
                htmlFor="documents"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-page/60 px-4 py-5 text-center transition hover:border-secondary"
              >
                <Upload className="h-6 w-6 text-secondary" />
                <span className="mt-2 text-label font-semibold text-ink">Click to upload documents</span>
                <span className="mt-0.5 text-caption text-muted">Documents are reviewed by an administrator</span>
                <input
                  id="documents"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(event) => {
                    const names = Array.from(event.target.files ?? []).map((file) => file.name);
                    setFiles(names);
                    setErrors((prev) => ({ ...prev, files: "" }));
                  }}
                />
              </label>
              {files.length > 0 ? (
                <ul className="mt-2 space-y-1.5">
                  {files.map((file) => (
                    <li key={file} className="flex items-center gap-2 rounded-lg bg-lightgreen px-2.5 py-1.5 text-caption text-primary">
                      <FileText className="h-3.5 w-3.5" /> {file}
                    </li>
                  ))}
                </ul>
              ) : null}
            </Field>

            <div className="sm:col-span-2">
              <label className="flex items-start gap-2 text-small text-muted">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => update("terms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-line accent-[#245C45]"
                />
                <span>
                  I agree to the platform terms and confirm that submitted food or account information
                  is accurate. I understand automated verification does not guarantee food safety.
                </span>
              </label>
              {errors.terms ? <p className="mt-1 text-caption text-[#B4473D]">{errors.terms}</p> : null}
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-1.5 text-caption text-muted">
              <ShieldCheck className="h-3.5 w-3.5" /> Your information is used for verification only.
            </p>
            <Button type="submit" className="sm:w-auto">
              {role === "recipient" ? "Submit application" : "Create donor account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      <p className="mt-5 text-center text-small text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
      <p className="mt-1.5 flex items-center justify-center gap-1.5 text-caption text-muted">
        <UserCheck className="h-3.5 w-3.5" /> Individual recipient accounts require administrator approval.
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-[#E8EEEA]" />
          <div className="mt-6 h-96 animate-pulse rounded-2xl bg-[#E8EEEA]" />
        </div>
      }
    >
      <div className="container-page">
        <RegisterForm />
      </div>
    </Suspense>
  );
}
