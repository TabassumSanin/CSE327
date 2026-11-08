"use client";

import Link from "next/link";
import { Leaf, Mail, MapPin } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";

const copy = {
  en: {
    blurb:
      "Surplus food from Dhaka kitchens, bakeries and farms, matched to registered recipients nearby.",
    platform: "Platform",
    about: "About",
    howItWorks: "How it works",
    contact: "Contact",
    takePart: "Take part",
    donate: "Donate food",
    find: "Find food",
    login: "Log in",
    reach: "Contact",
    address: "North South University, Bashundhara R/A, Dhaka 1229",
    built:
      "2026 Smart Food Exchange. Built by Nasib Talukder, Sanin Tabassum, and Shajuti Das Ety for CSE 327, North South University.",
    location: "Dhaka, Bangladesh",
  },
  bn: {
    blurb:
      "ঢাকার রেস্তোরাঁ, বেকারি ও খামারের উদ্বৃত্ত খাবার কাছাকাছি নিবন্ধিত গ্রহীতাদের সাথে মিলিয়ে দেওয়া হয়।",
    platform: "প্ল্যাটফর্ম",
    about: "পরিচিতি",
    howItWorks: "কীভাবে কাজ করে",
    contact: "যোগাযোগ",
    takePart: "অংশ নিন",
    donate: "খাবার দান করুন",
    find: "খাবার খুঁজুন",
    login: "লগ ইন",
    reach: "যোগাযোগ",
    address: "নর্থ সাউথ ইউনিভার্সিটি, বাশুন্ডহারা আর/এ, ঢাকা ১২২৯",
    built:
      "2026 Smart Food Exchange. Built by Nasib Talukder, Sanin Tabassum, and Shajuti Das Ety for CSE 327, North South University.",
    location: "ঢাকা, বাংলাদেশ",
  },
};

export function PublicFooter() {
  const { language } = useApp();
  const c = copy[language];

  return (
    <footer className="border-t border-line bg-cream">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12">
        <div>
          <Link href="/" className="flex items-center gap-2.5" aria-label="Smart Food Exchange home">
            <Leaf className="h-5 w-5 text-primary" aria-hidden />
            <span className="font-display text-[17px] font-semibold text-ink">Smart Food Exchange</span>
          </Link>
          <p className="mt-3 max-w-xs text-small leading-relaxed text-muted">{c.blurb}</p>
          <p className="mt-4 text-caption text-muted">{c.location}</p>
        </div>

        <nav aria-label="Platform links">
          <h2 className="text-label font-semibold text-ink">{c.platform}</h2>
          <ul className="mt-3 space-y-2.5 text-small text-muted">
            <li>
              <Link href="/about" className="transition-colors hover:text-primary">
                {c.about}
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="transition-colors hover:text-primary">
                {c.howItWorks}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-primary">
                {c.contact}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Account links">
          <h2 className="text-label font-semibold text-ink">{c.takePart}</h2>
          <ul className="mt-3 space-y-2.5 text-small text-muted">
            <li>
              <Link href="/register?role=donor" className="transition-colors hover:text-primary">
                {c.donate}
              </Link>
            </li>
            <li>
              <Link href="/register?role=recipient" className="transition-colors hover:text-primary">
                {c.find}
              </Link>
            </li>
            <li>
              <Link href="/login" className="transition-colors hover:text-primary">
                {c.login}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
<<<<<<< Updated upstream
          <h2 className="text-label font-semibold text-ink">{c.reach}</h2>
          <ul className="mt-3 space-y-3 text-small text-muted">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{c.address}</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="min-w-0 break-words">
                <a href="mailto:sanin.tabassum@northsouth.edu" className="transition-colors hover:text-primary">
                  sanin.tabassum@northsouth.edu
                </a>
                <br />
                <a href="mailto:shajuti.ety@northsouth.edu" className="transition-colors hover:text-primary">
                  shajuti.ety@northsouth.edu
                </a>
              </span>
            </li>
=======
          <h3 className="text-label font-semibold text-ink">Contact</h3>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> North South University, Dhaka 1212</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-secondary" /> +880 1700 000 111</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-secondary" /> hello@smartfoodexchange.org</li>
>>>>>>> Stashed changes
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page py-5">
          <p className="max-w-3xl text-caption leading-relaxed text-muted">{c.built}</p>
        </div>
      </div>
    </footer>
  );
}
