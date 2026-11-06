import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe2,
  HeartHandshake,
  Leaf,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const metadata = { title: "About | Smart Food Exchange" };

export default function AboutPage() {
  return (
    <>
      <section className="hero-glow border-b border-line">
        <div className="container-page py-10 md:py-16">
          <span className="text-caption font-semibold uppercase tracking-wider text-secondary">About us</span>
          <h1 className="mt-2 max-w-3xl text-[32px] font-bold leading-tight text-ink md:text-[44px]">
            Food should feed people, not fill landfills.
          </h1>
          <p className="mt-3 max-w-2xl text-body text-muted">
            Smart Food Exchange is a food redistribution platform that brings surplus food donors and
            verified recipients together. We combine clear food-safety checks, AI-assisted matching,
            and full reservation tracking to make sharing food trustworthy and efficient.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link href="/register?role=donor" className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-btn text-white hover:bg-[#1d4c39]">
              Join as a donor <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/how-it-works" className="inline-flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-5 text-btn text-ink hover:border-secondary hover:text-primary">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Target, title: "Our mission", text: "Reduce avoidable food waste while improving food access for communities that need it most." },
            { icon: ShieldCheck, title: "Our standard", text: "Every donation passes automated safety rules. Flagged food is manually reviewed before matching." },
            { icon: Sparkles, title: "Our method", text: "Eligible recipients are matched by urgency and match score, with transparent provisional holds." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card p-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-lightgreen text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h2 className="mt-3 text-h3 text-ink">{item.title}</h2>
                <p className="mt-1.5 text-small text-muted">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="container-page grid gap-8 py-10 md:grid-cols-2 md:py-14">
          <div>
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary">The problem</span>
            <h2 className="mt-1 text-h1 text-ink">Good food is lost every day</h2>
            <p className="mt-2 text-small text-muted">
              Restaurants, bakeries, farms, and events regularly have safe surplus food with nowhere to go.
              At the same time, community kitchens and families struggle to access nutritious meals.
              The gap is rarely about food supply — it is about coordination, trust, and timing.
            </p>
            <ul className="mt-4 space-y-2.5">
              {[
                "Surplus food is often discarded because donation logistics are unclear.",
                "Recipients need clear information about storage, expiry, and allergens.",
                "Administrators need visibility to keep food safety standards consistent.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-small text-muted">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "12,480", label: "Donations shared", icon: HeartHandshake },
              { value: "48.2t", label: "Food redistributed", icon: Leaf },
              { value: "320+", label: "Active donors", icon: Building2 },
              { value: "1,150", label: "Verified recipients", icon: Users },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="rounded-2xl border border-line bg-page/60 p-4">
                  <Icon className="h-5 w-5 text-secondary" />
                  <p className="mt-2 text-[26px] font-bold leading-none text-ink">{stat.value}</p>
                  <p className="mt-1 text-caption text-muted">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <span className="text-caption font-semibold uppercase tracking-wider text-secondary">Our values</span>
            <h2 className="mt-1 text-h1 text-ink">Built around trust</h2>
            <p className="mt-2 text-small text-muted">
              Smart Food Exchange is designed as a transparent, bilingual platform for academic and
              community use. We keep the human review step visible because automated checks are a
              safety aid, not a guarantee.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: ShieldCheck, title: "Safety first", text: "Clear verification states and manual review queues." },
              { icon: Globe2, title: "Accessible", text: "English and Bengali interfaces, responsive on any device." },
              { icon: Sparkles, title: "Fair matching", text: "Urgency and eligibility come before convenience." },
              { icon: Leaf, title: "Sustainability", text: "Less waste, lower emissions, stronger communities." },
            ].map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="card p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-2 text-label font-semibold text-ink">{value.title}</h3>
                  <p className="mt-1 text-caption text-muted">{value.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
