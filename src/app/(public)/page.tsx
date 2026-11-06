"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  Bike,
  Building2,
  ClipboardCheck,
  Globe2,
  HeartHandshake,
  Leaf,
  PackageCheck,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
import { foodCategories } from "@/lib/nav";
import { FoodCard } from "@/components/ui/food-card";

const copy = {
  en: {
    badge: "Verified food redistribution, powered by smart matching",
    heroTitle: "Reduce Food Waste,",
    heroHighlight: "Share Hope.",
    heroDescription:
      "Smart Food Exchange connects restaurants, bakeries, farms, and households with verified recipients. Donate surplus food, let our platform verify and match it safely, and help every meal reach a plate instead of a bin.",
    stats: [
      { label: "Total Donations", value: "12,480", icon: HeartHandshake },
      { label: "Food Redistributed", value: "48.2 tons", icon: PackageCheck },
      { label: "Active Donors", value: "320+", icon: Building2 },
      { label: "Registered Recipients", value: "1,150", icon: Users },
    ],
    sectionHow: "How It Works",
    sectionHowDesc: "From surplus to a shared meal in four transparent steps.",
    steps: [
      { title: "Donors share surplus food", desc: "Add food details, photos, quantity, storage conditions, and pickup instructions.", icon: HeartHandshake },
      { title: "Platform verifies the information", desc: "Automated safety rules check expiry, storage, temperature, and allergens.", icon: ClipboardCheck },
      { title: "AI matches eligible recipients", desc: "Urgency, eligibility, and match scores decide who gets a provisional reservation.", icon: Sparkles },
      { title: "Recipients confirm and collect", desc: "Recipients confirm, coordinate transport, collect, and confirm the collected quantity.", icon: Truck },
    ],
    sectionBenefits: "Why Smart Food Exchange",
    sectionBenefitsDesc: "Built for trust, speed, and measurable community impact.",
    benefits: [
      { title: "Safety-first verification", desc: "Automated checks flag risky donations for manual review before matching.", icon: ShieldCheck },
      { title: "AI-assisted matching", desc: "Eligible recipients are prioritised by urgency and match score.", icon: Sparkles },
      { title: "End-to-end tracking", desc: "Follow every reservation from provisional hold to confirmed collection.", icon: Bike },
      { title: "Multiple recipients", desc: "Large donations can be split across recipients with independent tracking.", icon: Users },
      { title: "Bilingual by design", desc: "Switch between English and Bengali across the platform interface.", icon: Globe2 },
      { title: "Impact reporting", desc: "Administrators see verified redistribution totals and donation trends.", icon: BarChart3 },
    ],
    sectionCategories: "Food Categories",
    sectionCategoriesDesc: "Explore the kinds of surplus food shared on the platform.",
    categoryCta: "View category",
    sectionCta: "Every meal shared is a choice for a better tomorrow.",
    sectionCtaDesc:
      "Join a growing network of donors and verified recipients working together to reduce food waste in our communities.",
    ctaPrimary: "Become a Donor",
    ctaSecondary: "Register as Recipient",
    featured: "Fresh Donations",
    featuredDesc: "A preview of verified food currently available to eligible recipients.",
    featuredCta: "Browse all available food",
    trust: "Community Food Safety",
    trustDesc: "Automated verification does not guarantee food safety. Flagged donations always require administrator review.",
  },
  bn: {
    badge: "স্মার্ট ম্যাচিংয়ের মাধ্যমে যাচাইকৃত খাদ্য বিতরণ",
    heroTitle: "খাদ্য অপচয় কমান,",
    heroHighlight: "আশা ভাগ করুন।",
    heroDescription:
      "স্মার্ট ফুড এক্সচেঞ্জ রেস্তোরাঁ, বেকারি, খামার এবং পরিবারকে যাচাইকৃত গ্রহীতাদের সাথে যুক্ত করে। উদ্বৃত্ত খাবার দান করুন, প্ল্যাটফর্মের যাচাই ও নিরাপদ ম্যাচিংয়ের মাধ্যমে প্রতিটি খাবার যেন নষ্ট না হয়ে মানুষের প্লেটে পৌঁছায়।",
    stats: [
      { label: "মোট অনুদান", value: "১২,৪৮০", icon: HeartHandshake },
      { label: "পুনর্বণ্টিত খাদ্য", value: "৪৮.২ টন", icon: PackageCheck },
      { label: "সক্রিয় দাতা", value: "৩২০+", icon: Building2 },
      { label: "নিবন্ধিত গ্রহীতা", value: "১,১৫০", icon: Users },
    ],
    sectionHow: "কীভাবে কাজ করে",
    sectionHowDesc: "উদ্বৃত্ত খাবার থেকে ভাগ করা খাবার—চারটি স্বচ্ছ ধাপে।",
    steps: [
      { title: "দাতারা উদ্বৃত্ত খাবার শেয়ার করেন", desc: "খাবারের বিবরণ, ছবি, পরিমাণ, সংরক্ষণ অবস্থা ও পিকআপ নির্দেশনা যোগ করুন।", icon: HeartHandshake },
      { title: "প্ল্যাটফর্ম তথ্য যাচাই করে", desc: "স্বয়ংক্রিয় নিয়ম মেয়াদ, সংরক্ষণ, তাপমাত্রা ও অ্যালার্জেন যাচাই করে।", icon: ClipboardCheck },
      { title: "এআই যোগ্য গ্রহীতা খুঁজে বের করে", desc: "জরুরি অবস্থা, যোগ্যতা ও ম্যাচ স্কোরের ভিত্তিতে সাময়িক সংরক্ষণ তৈরি হয়।", icon: Sparkles },
      { title: "গ্রহীতারা নিশ্চিত করেন ও সংগ্রহ করেন", desc: "গ্রহীতা নিশ্চিত করেন, পরিবহন সমন্বয় করেন এবং সংগৃহীত পরিমাণ নিশ্চিত করেন।", icon: Truck },
    ],
    sectionBenefits: "কেন স্মার্ট ফুড এক্সচেঞ্জ",
    sectionBenefitsDesc: "বিশ্বাস, গতি এবং পরিমাপযোগ্য সামাজিক প্রভাবের জন্য তৈরি।",
    benefits: [
      { title: "নিরাপত্তা-প্রথম যাচাই", desc: "স্বয়ংক্রিয় পরীক্ষা ঝুঁকিপূর্ণ অনুদানকে ম্যানুয়াল পর্যালোচনার জন্য চিহ্নিত করে।", icon: ShieldCheck },
      { title: "এআই সহায়ক ম্যাচিং", desc: "যোগ্য গ্রহীতাদের জরুরি অবস্থা ও ম্যাচ স্কোর অনুযায়ী অগ্রাধিকার দেওয়া হয়।", icon: Sparkles },
      { title: "সম্পূর্ণ ট্র্যাকিং", desc: "সাময়িক সংরক্ষণ থেকে নিশ্চিত সংগ্রহ পর্যন্ত প্রতিটি ধাপ অনুসরণ করুন।", icon: Bike },
      { title: "একাধিক গ্রহীতা", desc: "বড় অনুদান একাধিক গ্রহীতার মধ্যে ভাগ করা যায়, প্রতিটি আলাদাভাবে ট্র্যাক হয়।", icon: Users },
      { title: "দ্বিভাষিক ডিজাইন", desc: "ইংরেজি ও বাংলার মধ্যে সহজে পরিবর্তন করুন।", icon: Globe2 },
      { title: "প্রভাব প্রতিবেদন", desc: "প্রশাসকরা যাচাইকৃত পুনর্বণ্টন ও অনুদানের ধারা দেখতে পারেন।", icon: BarChart3 },
    ],
    sectionCategories: "খাবারের বিভাগ",
    sectionCategoriesDesc: "প্ল্যাটফর্মে শেয়ার করা বিভিন্ন ধরনের উদ্বৃত্ত খাবার দেখুন।",
    categoryCta: "বিভাগ দেখুন",
    sectionCta: "প্রতিটি ভাগ করা খাবার আগামীর জন্য একটি ভালো সিদ্ধান্ত।",
    sectionCtaDesc:
      "খাদ্য অপচয় কমাতে একসাথে কাজ করা দাতা ও যাচাইকৃত গ্রহীতাদের ক্রমবর্ধমান নেটওয়ার্কে যোগ দিন।",
    ctaPrimary: "দাতা হোন",
    ctaSecondary: "গ্রহীতা হিসেবে নিবন্ধন",
    featured: "নতুন অনুদান",
    featuredDesc: "যোগ্য গ্রহীতাদের জন্য বর্তমানে উপলব্ধ যাচাইকৃত খাবারের একটি ঝলক।",
    featuredCta: "সব উপলব্ধ খাবার দেখুন",
    trust: "কমিউনিটি খাদ্য নিরাপত্তা",
    trustDesc: "স্বয়ংক্রিয় যাচাই খাদ্য নিরাপত্তার নিশ্চয়তা দেয় না। চিহ্নিত অনুদান সর্বদা প্রশাসকের পর্যালোচনা প্রয়োজন।",
  },
};

export default function HomePage() {
  const { language, donations } = useApp();
  const c = copy[language];
  const featured = donations.filter((item) => item.status === "available").slice(0, 3);

  return (
    <>
      <section className="hero-glow relative overflow-hidden border-b border-line">
        <div className="leaf-grid absolute inset-0 opacity-40" aria-hidden />
        <div className="container-page relative grid items-center gap-8 py-10 md:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C6DFD0] bg-white/80 px-3 py-1.5 text-caption font-medium text-primary backdrop-blur">
              <BadgeCheck className="h-4 w-4" />
              {c.badge}
            </span>
            <h1 className="mt-4 text-[34px] font-bold leading-[1.12] tracking-tight text-ink sm:text-[44px] lg:text-[54px]">
              {c.heroTitle}
              <br />
              <span className="text-primary">{c.heroHighlight}</span>
            </h1>
            <p className="mt-4 max-w-xl text-body text-muted md:text-[17px]">{c.heroDescription}</p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/register?role=donor"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-btn text-white transition hover:bg-[#1d4c39]"
              >
                <HeartHandshake className="h-4 w-4" />
                {language === "bn" ? "খাবার দান করুন" : "Donate Food"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=recipient"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#C6DFD0] bg-white px-6 text-btn text-primary transition hover:border-secondary hover:bg-lightgreen/50"
              >
                <Search className="h-4 w-4" />
                {language === "bn" ? "খাবার খুঁজুন" : "Find Food"}
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-secondary" /> Safety check before matching
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BellRing className="h-4 w-4 text-secondary" /> Real-time reservation alerts
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-secondary" /> Zero-waste mission
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] animate-fade-up lg:max-w-none">
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/40 shadow-soft backdrop-blur">
              <Image
                src="/images/hero.svg"
                alt="A food donation box being shared between a donor and a recipient"
                width={640}
                height={540}
                priority
                className="h-auto w-full"
              />
            </div>

            <div className="absolute -left-1 bottom-4 hidden w-[188px] rounded-2xl border border-line bg-white p-3.5 shadow-soft sm:block md:left-4 md:bottom-5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-success text-[#1D6A3E]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-caption text-muted">AI match score</p>
                  <p className="text-h3 leading-tight text-ink">94 / 100</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-lightgreen">
                <div className="h-full w-[94%] rounded-full bg-primary" />
              </div>
              <p className="mt-1.5 text-[10.5px] text-muted">High urgency recipient</p>
            </div>

            <div className="absolute -right-1 top-4 hidden w-[184px] rounded-2xl border border-line bg-white p-3.5 shadow-soft sm:block md:right-4 md:top-5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lightgreen text-primary">
                  <Truck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-caption text-muted">Collected today</p>
                  <p className="text-h3 leading-tight text-ink">128 kg</p>
                </div>
              </div>
              <p className="mt-1.5 text-[10.5px] text-muted">Verified by recipients</p>
            </div>
          </div>
        </div>

        <div className="container-page relative pb-8 md:pb-10">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-white/90 p-3 backdrop-blur sm:gap-4 md:grid-cols-4 md:p-4">
            {c.stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3 rounded-xl px-2 py-2 md:px-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lightgreen text-primary md:h-11 md:w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-caption text-muted">{stat.label}</p>
                    <p className="truncate text-[19px] font-bold leading-tight text-ink md:text-h2">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="max-w-2xl">
          <span className="text-caption font-semibold uppercase tracking-wider text-secondary">01 · Process</span>
          <h2 className="mt-1 text-h1 text-ink">{c.sectionHow}</h2>
          <p className="mt-1 text-small text-muted">{c.sectionHowDesc}</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
          {c.steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="card relative p-4 md:p-5">
                <span className="absolute right-4 top-4 text-[30px] font-bold leading-none text-lightgreen">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-lightgreen text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-h3 text-ink">{step.title}</h3>
                <p className="mt-1.5 text-small text-muted">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr] lg:gap-12">
            <div>
              <span className="text-caption font-semibold uppercase tracking-wider text-secondary">02 · Benefits</span>
              <h2 className="mt-1 text-h1 text-ink">{c.sectionBenefits}</h2>
              <p className="mt-1 text-small text-muted">{c.sectionBenefitsDesc}</p>
              <div className="mt-5 rounded-2xl border border-[#F0DFA8] bg-warning/60 p-4">
                <p className="flex items-center gap-1.5 text-label font-semibold text-[#7A5A0B]">
                  <ShieldCheck className="h-4 w-4" /> {c.trust}
                </p>
                <p className="mt-1 text-caption text-[#7A5A0B]">{c.trustDesc}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {c.benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="rounded-2xl border border-line bg-page/60 p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-primary shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-2.5 text-label font-semibold text-ink">{benefit.title}</h3>
                    <p className="mt-1 text-caption text-muted">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="max-w-2xl">
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary">03 · Categories</span>
            <h2 className="mt-1 text-h1 text-ink">{c.sectionCategories}</h2>
            <p className="mt-1 text-small text-muted">{c.sectionCategoriesDesc}</p>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-caption font-semibold text-ink transition hover:border-secondary hover:text-primary"
          >
            {c.categoryCta} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {foodCategories.map((category) => (
            <Link
              key={category.name}
              href={`/register?role=recipient&category=${encodeURIComponent(category.name)}`}
              className="card group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-lightgreen">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-label font-semibold text-ink">
                    {language === "bn" ? category.bn : category.name}
                  </p>
                  <p className="text-caption text-muted">{category.name}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted transition group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page py-10 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="max-w-2xl">
              <span className="text-caption font-semibold uppercase tracking-wider text-secondary">04 · Live</span>
              <h2 className="mt-1 text-h1 text-ink">{c.featured}</h2>
              <p className="mt-1 text-small text-muted">{c.featuredDesc}</p>
            </div>
            <Link
              href="/recipient/available-food"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-caption font-semibold text-ink transition hover:border-secondary hover:text-primary"
            >
              {c.featuredCta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((donation) => (
              <FoodCard key={donation.id} donation={donation} href={`/recipient/food/${donation.id}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="relative overflow-hidden rounded-[28px] bg-primary px-5 py-10 md:px-10 md:py-12">
          <div className="leaf-grid absolute inset-0 opacity-[0.08]" aria-hidden />
          <div className="relative grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-caption font-medium text-[#DDF3E4]">
                <UtensilsCrossed className="h-3.5 w-3.5" /> Join the exchange
              </span>
              <h2 className="mt-3 max-w-2xl text-[26px] font-bold leading-tight text-white md:text-[32px]">
                {c.sectionCta}
              </h2>
              <p className="mt-2 max-w-2xl text-small text-[#CFE5D8] md:text-body">{c.sectionCtaDesc}</p>
            </div>
            <div className="flex flex-col gap-2.5 sm:flex-row lg:justify-end">
              <Link
                href="/register?role=donor"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-btn text-primary transition hover:bg-[#F2F8F4]"
              >
                {c.ctaPrimary} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=recipient"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 text-btn text-white transition hover:bg-white/10"
              >
                {c.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
