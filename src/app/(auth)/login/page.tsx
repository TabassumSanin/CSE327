"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Eye,
  EyeOff,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";
import { useApp } from "@/components/providers/app-provider";
import { cn } from "@/lib/utils";

const roles = [
  { id: "donor", label: "Donor", icon: HeartHandshake, email: "nusrat@greenharvest.org" },
  { id: "recipient", label: "Recipient", icon: Users, email: "imran@hopekitchen.org" },
  { id: "admin", label: "Administrator", icon: ShieldCheck, email: "admin@smartfoodexchange.org" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { notify, t } = useApp();
  const [role, setRole] = useState<(typeof roles)[number]["id"]>("donor");
  const [email, setEmail] = useState("nusrat@greenharvest.org");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectRole = (next: (typeof roles)[number]) => {
    setRole(next.id);
    setEmail(next.email);
    setPassword("demo1234");
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      notify(`Signed in as ${role === "admin" ? "administrator" : role}.`);
      router.push(`/${role}/dashboard`);
    }, 600);
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="leaf-grid absolute inset-0 opacity-[0.1]" aria-hidden />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-caption font-medium text-[#DDF3E4]">
            <Sparkles className="h-3.5 w-3.5" /> Reduce food waste, share hope
          </span>
          <h1 className="mt-6 max-w-md text-[40px] font-bold leading-[1.15] text-white">
            Welcome back to the food exchange.
          </h1>
          <p className="mt-3 max-w-md text-small text-[#CFE5D8]">
            Sign in to manage donations, review food safety, track reservations, and confirm
            collections — all from one shared platform.
          </p>

          <div className="mt-8 max-w-md space-y-3">
            {[
              { icon: ShieldCheck, text: "Verified food safety review workflow" },
              { icon: Sparkles, text: "AI-assisted recipient matching" },
              { icon: Leaf, text: "Measurable redistribution impact" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-2.5 text-small text-[#E7F2EB]">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
                    <Icon className="h-4 w-4" />
                  </span>
                  {item.text}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <p className="text-small italic text-[#E7F2EB]">
            “Before this platform, coordinating surplus food took dozens of phone calls. Now we see
            verified donations and confirmed collections in one place.”
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-primary">
              <Building2 className="h-4 w-4" />
            </span>
            <div>
              <p className="text-caption font-semibold text-white">Nusrat Jahan</p>
              <p className="text-[11px] text-[#CFE5D8]">Green Harvest Kitchen</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-8 md:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 lg:hidden">
            <span className="inline-flex items-center gap-2 rounded-full bg-lightgreen px-3 py-1 text-caption font-medium text-primary">
              <Leaf className="h-3.5 w-3.5" /> Smart Food Exchange
            </span>
          </div>
          <h2 className="text-h1 text-ink">{t("login")}</h2>
          <p className="mt-1 text-small text-muted">Choose a workspace and sign in to continue.</p>

          <div className="mt-5 grid grid-cols-3 gap-2" role="tablist" aria-label="Account role">
            {roles.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={role === item.id}
                  onClick={() => selectRole(item)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-caption font-medium transition",
                    role === item.id
                      ? "border-primary bg-lightgreen text-primary"
                      : "border-line bg-white text-muted hover:border-secondary hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5">
            <div className="space-y-4">
              <Field label={t("email")} htmlFor="email" required error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="you@example.com"
                />
              </Field>
              <Field label={t("password")} htmlFor="password" required error={errors.password}>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="inline-flex items-center gap-2 text-caption text-muted">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                    className="h-4 w-4 rounded border-line text-primary accent-[#245C45]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => notify("Password reset link sent to your email (demo).", "info")}
                  className="text-caption font-semibold text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" loading={submitting}>
                Sign in as {roles.find((item) => item.id === role)?.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-4 rounded-xl border border-line bg-white p-3">
            <p className="text-caption font-semibold text-ink">Demo credentials</p>
            <p className="mt-0.5 text-caption text-muted">
              {email} · password: demo1234. Choose a role above to load its demo account.
            </p>
          </div>

          <p className="mt-5 text-center text-small text-muted">
            New to Smart Food Exchange?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-caption text-muted">
            <UserCheck className="h-3.5 w-3.5" /> Recipient accounts require administrator approval.
          </p>
        </div>
      </div>
    </div>
  );
}
