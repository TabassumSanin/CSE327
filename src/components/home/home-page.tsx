"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { foodCategories } from "@/lib/nav";
import type { Donation } from "@/types";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/ui/risk-badge";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Section, SectionHeading } from "@/components/ui/section";
import { homeCopy } from "@/components/home/copy";

const featuredIds = ["DON-1001", "DON-1011", "DON-1005"];

function formatNumber(value: number, language: "en" | "bn") {
  return value.toLocaleString(language === "bn" ? "bn-BD" : "en-US");
}

function formatPickup(value: string, language: "en" | "bn") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function shortPlace(value: string) {
  return value.split(",").slice(0, 2).join(",");
}

export function HomePage() {
  const { language, donations, users, reservations } = useApp();
  const c = homeCopy[language];
  const isBn = language === "bn";

  const availableNow = donations.filter((item) => item.status === "available").length;
  const recipientCount = users.filter((item) => item.role === "recipient").length;
  const reservationCount = reservations.length;
  const collectedKg = donations
    .filter((item) => item.unit === "kg")
    .reduce((total, item) => total + item.collectedQty, 0);

  const stats = [
    { label: c.stats.open, value: formatNumber(availableNow, language) },
    { label: c.stats.recipients, value: formatNumber(recipientCount, language) },
    { label: c.stats.reservations, value: formatNumber(reservationCount, language) },
    {
      label: c.stats.collected,
      value: `${formatNumber(collectedKg, language)} ${isBn ? "কেজি" : "kg"}`,
    },
  ];

  const picked = featuredIds
    .map((id) => donations.find((item) => item.id === id))
    .filter((item): item is Donation => Boolean(item));
  const fallback = donations
    .filter(
      (item) =>
        item.status === "available" && !picked.some((entry) => entry.id === item.id)
    )
    .slice(0, Math.max(0, 3 - picked.length));
  const cards = [...picked, ...fallback].slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page py-10 md:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h1 className="max-w-2xl text-balance font-display text-[36px] leading-[1.1] tracking-[-0.02em] text-ink sm:text-[44px] lg:text-[52px]">
                {c.hero.headline}
              </h1>
              <p className="mt-5 max-w-xl text-lead leading-relaxed text-muted">{c.hero.body}</p>

              <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
                <Link href="/register?role=donor" className={buttonStyles("primary", "lg")}>
                  {c.hero.primary}
                </Link>
                <Link href="/register?role=recipient" className={buttonStyles("secondary", "lg")}>
                  {c.hero.secondary}
                </Link>
              </div>

              <p className="mt-5 flex max-w-xl items-start gap-2 text-caption leading-relaxed text-muted">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span>{c.hero.safety}</span>
              </p>
            </div>

            <PhotoPlaceholder
              alt={`${c.hero.photoLabel}. ${c.hero.photoCaption}`}
              label={c.hero.photoLabel}
              caption={c.hero.photoCaption}
              aspect="portrait"
              priority
              className="mx-auto w-full max-w-[520px]"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="border-b border-line">
        <div className="container-page py-8 md:py-10">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-caption font-medium text-muted">{c.statsLabel}</p>
            <p className="text-caption text-muted">{c.statsNote}</p>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index > 0 ? "border-line sm:border-l sm:pl-6" : "border-line"
                }
              >
                <dd className="font-display text-[30px] leading-none text-ink md:text-[34px]">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-caption text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* How it works */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="max-w-sm text-balance font-display text-h2 text-ink">{c.how.title}</h2>
            <p className="mt-3 max-w-sm text-small leading-relaxed text-muted">{c.how.description}</p>
            <Link
              href="/how-it-works"
              className="mt-5 inline-flex items-center gap-1.5 text-label font-medium text-primary hover:underline"
            >
              {c.how.link}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <ol className="border-t border-line">
            {c.how.steps.map((step, index) => (
              <li
                key={step.title}
                className="grid grid-cols-[36px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[52px_1fr] sm:gap-6"
              >
                <span className="font-display text-[20px] leading-none text-muted" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-h3 text-ink">{step.title}</h3>
                  <p className="mt-1.5 max-w-xl text-small leading-relaxed text-muted">
                    {step.description}
                  </p>
                  <p className="mt-1.5 text-caption text-muted">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Benefits */}
      <Section tone="white">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h2 className="max-w-md text-balance font-display text-h2 text-ink">
              {c.benefits.title}
            </h2>
            <p className="mt-3 max-w-md text-small leading-relaxed text-muted">
              {c.benefits.description}
            </p>

            <div className="mt-7 rounded-xl border border-primary/15 bg-softgreen/70 p-5 md:p-6">
              <h3 className="font-display text-h3 text-ink">{c.benefits.featureTitle}</h3>
              <p className="mt-2 text-small leading-relaxed text-ink/80">
                {c.benefits.featureBody}
              </p>
              <ul className="mt-4 space-y-2 border-t border-primary/15 pt-4">
                {c.benefits.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-caption leading-relaxed text-ink/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-line bg-cream p-5">
              <h3 className="flex items-center gap-2 text-label font-semibold text-ink">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                {c.benefits.safetyTitle}
              </h3>
              <p className="mt-1.5 text-caption leading-relaxed text-muted">
                {c.benefits.safetyText}
              </p>
            </div>
          </div>

          <div>
            {c.benefits.items.map((item, index) => (
              <div
                key={item.title}
                className={
                  index === 0
                    ? "pb-6"
                    : "border-t border-line py-6 last:pb-0"
                }
              >
                <h3 className="font-display text-h3 text-ink">{item.title}</h3>
                <p className="mt-2 max-w-md text-small leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Categories */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <PhotoPlaceholder
            alt={c.categories.photoLabel}
            label={c.categories.photoLabel}
            caption={c.categories.photoCaption}
            aspect="portrait"
            className="w-full"
          />

          <div>
            <SectionHeading
              title={c.categories.title}
              description={c.categories.description}
            />
            <p className="mt-3 text-caption text-muted">{c.categories.sample}</p>

            <ul className="mt-6 grid gap-x-10 sm:grid-cols-2">
              {foodCategories.map((category) => (
                <li key={category.name} className="border-t border-line">
                  <Link
                    href={`/register?role=recipient&category=${encodeURIComponent(category.name)}`}
                    className="group flex items-baseline justify-between gap-3 py-3.5"
                  >
                    <span>
                      <span className="block text-label font-medium text-ink transition-colors group-hover:text-primary">
                        {c.categories.labels[category.name] ?? category.name}
                      </span>
                      <span className="mt-0.5 block text-caption text-muted">
                        {c.categories.descriptions[category.name] ?? ""}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted transition-colors group-hover:text-primary"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Featured donations */}
      <Section tone="white">
        <SectionHeading
          title={c.featured.title}
          description={c.featured.description}
          actions={
            <Link
              href="/recipient/available-food"
              className="inline-flex items-center gap-1.5 text-label font-medium text-primary hover:underline"
            >
              {c.featured.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />
        <p className="mt-3 text-caption text-muted">{c.featured.note}</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((donation) => {
            const risk = c.featured.risks[donation.id] ?? {
              level: "safe" as const,
              reason: isBn ? "সংরক্ষণ ও মেয়াদ যাচাই করা হয়েছে।" : "Storage and expiry details were checked.",
            };
            const needsReview = donation.verification === "needs-review";
            const donorName = donation.donor.organization ?? donation.donor.name;

            return (
              <Card
                key={donation.id}
                as="article"
                padding="none"
                className="flex h-full flex-col overflow-hidden"
              >
                <PhotoPlaceholder
                  alt={`${donation.name} from ${donorName}, ${donation.pickupLocation}`}
                  label={donation.name}
                  aspect="card"
                  framed={false}
                  className="rounded-none border-b border-line"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-caption text-muted">
                    {c.categories.labels[donation.category] ?? donation.category}
                  </p>
                  <h3 className="mt-1 font-display text-h3 text-ink">{donation.name}</h3>
                  <p className="mt-1 text-caption text-muted">
                    {donorName} · {shortPlace(donation.pickupLocation)}
                  </p>

                  <RiskBadge
                    level={risk.level}
                    reason={risk.reason}
                    label={c.featured.labels[risk.level]}
                    className="mt-3"
                  />

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3 text-caption">
                    <div>
                      <dt className="text-muted">
                        {needsReview ? c.featured.listed : c.featured.available}
                      </dt>
                      <dd className="mt-0.5 font-semibold text-ink">
                        {formatNumber(
                          needsReview ? donation.quantity : donation.availableQty,
                          language
                        )}{" "}
                        {donation.unit}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted">{c.featured.collectBy}</dt>
                      <dd className="mt-0.5 font-semibold text-risk-soon">
                        {formatPickup(donation.expiresAt, language)}
                      </dd>
                    </div>
                  </dl>

                  {needsReview ? (
                    <div className="mt-3">
                      <Badge tone="review">{c.featured.needsAdmin}</Badge>
                    </div>
                  ) : null}

                  <div className="mt-auto pt-4">
                    {needsReview ? (
                      <span className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-line bg-cream px-4 text-caption font-semibold text-muted">
                        {c.featured.awaiting}
                      </span>
                    ) : (
                      <Link
                        href={`/recipient/food/${donation.id}`}
                        className="inline-flex items-center gap-1.5 text-label font-medium text-primary hover:underline"
                      >
                        {c.featured.view}
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Final banner */}
      <Section spacing="lg">
        <div className="grid items-center gap-8 rounded-xl bg-primary px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
          <div>
            <h2 className="max-w-2xl text-balance font-display text-[28px] leading-tight text-white md:text-[36px]">
              {c.cta.headline}
            </h2>
            <p className="mt-3 max-w-2xl text-small leading-relaxed text-softgreen md:text-body">
              {c.cta.body}
            </p>
            <p className="mt-4 text-caption text-softgreen/80">{c.cta.note}</p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row lg:flex-col">
            <Link href="/register?role=donor" className={buttonStyles("accent", "lg", "w-full sm:w-auto")}>
              {c.cta.primary}
            </Link>
            <Link
              href="/register?role=recipient"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-softgreen/40 px-6 text-btn text-white transition-colors hover:border-softgreen hover:bg-white/10"
            >
              {c.cta.secondary}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
