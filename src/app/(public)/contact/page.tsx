"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useApp } from "@/components/providers/app-provider";

export default function ContactPage() {
  const { notify } = useApp();
  const [form, setForm] = useState({ name: "", email: "", role: "Donor", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.subject.trim()) next.subject = "Please add a subject.";
    if (form.message.trim().length < 20) next.message = "Please write at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSent(true);
    notify("Message sent. Our team will reply within 1–2 business days.");
    setForm({ name: "", email: "", role: "Donor", subject: "", message: "" });
  };

  return (
    <>
      <section className="hero-glow border-b border-line">
        <div className="container-page py-10 md:py-14">
          <span className="text-caption font-semibold uppercase tracking-wider text-secondary">Contact</span>
          <h1 className="mt-2 text-[32px] font-bold leading-tight text-ink md:text-[42px]">
            We would love to hear from you.
          </h1>
          <p className="mt-2 max-w-2xl text-body text-muted">
            Questions about donating, recipient approvals, food safety reviews, or partnerships?
            Send us a message and the platform team will get back to you.
          </p>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-3">
            {[
              { icon: MapPin, title: "Office", lines: ["North South University", "Dhaka 1212, Bangladesh"] },
              { icon: Phone, title: "Phone", lines: ["+880 1700 000 111"] },
              { icon: Mail, title: "Email", lines: ["hello@smartfoodexchange.org", "support@smartfoodexchange.org"] },
              { icon: Clock, title: "Support hours", lines: ["Sunday – Thursday, 9:00 AM – 6:00 PM", "Urgent donation issues: 24/7"] },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card flex gap-3 p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lightgreen text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-label font-semibold text-ink">{item.title}</h2>
                    {item.lines.map((line) => (
                      <p key={line} className="text-small text-muted">{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="rounded-2xl border border-[#C6DFD0] bg-lightgreen p-4">
              <p className="flex items-center gap-2 text-label font-semibold text-primary">
                <MessageSquare className="h-4 w-4" /> Academic project
              </p>
              <p className="mt-1 text-caption text-muted">
                This frontend was built as a CSE327 academic project. All data shown is mock data for
                demonstration purposes.
              </p>
            </div>
          </div>

          <div className="card p-4 md:p-6">
            {sent ? (
              <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-success text-[#1D6A3E]">
                  <Mail className="h-6 w-6" />
                </span>
                <h2 className="mt-3 text-h2 text-ink">Message sent</h2>
                <p className="mt-1 max-w-sm text-small text-muted">
                  Thank you for reaching out. Our team will review your message and reply within
                  1–2 business days.
                </p>
                <Button className="mt-5" variant="outline" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h2 className="text-h2 text-ink">Send a message</h2>
                <p className="mt-0.5 text-small text-muted">Fields marked with * are required.</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" required error={errors.name}>
                    <Input id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                  </Field>
                  <Field label="Email address" htmlFor="email" required error={errors.email}>
                    <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                  </Field>
                  <Field label="I am a" htmlFor="role" required>
                    <Select id="role" value={form.role} onChange={(e) => update("role", e.target.value)}>
                      <option>Donor</option>
                      <option>Recipient</option>
                      <option>Administrator</option>
                      <option>Other</option>
                    </Select>
                  </Field>
                  <Field label="Subject" htmlFor="subject" required error={errors.subject}>
                    <Input id="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" />
                  </Field>
                  <Field label="Message" htmlFor="message" required error={errors.message} className="sm:col-span-2">
                    <Textarea id="message" rows={6} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Write your message here..." />
                  </Field>
                </div>
                <div className="mt-5 flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-caption text-muted">We never share your contact details.</p>
                  <Button type="submit" className="sm:w-auto">
                    <Send className="h-4 w-4" /> Send message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
