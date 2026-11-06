import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-4 md:py-12">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] font-bold text-ink">Smart Food Exchange</span>
              <span className="block text-[11px] text-muted">Food Redistribution Platform</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-small text-muted">
            Reducing food waste by connecting surplus food donors with verified, eligible recipients.
          </p>
        </div>

        <div>
          <h3 className="text-label font-semibold text-ink">Platform</h3>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li><Link href="/about" className="hover:text-primary">About us</Link></li>
            <li><Link href="/how-it-works" className="hover:text-primary">How it works</Link></li>
            <li><Link href="/register" className="hover:text-primary">Become a donor</Link></li>
            <li><Link href="/register" className="hover:text-primary">Register as recipient</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-label font-semibold text-ink">Access</h3>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li><Link href="/login" className="hover:text-primary">Log in</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-primary">Admin dashboard</Link></li>
            <li><Link href="/donor/dashboard" className="hover:text-primary">Donor dashboard</Link></li>
            <li><Link href="/recipient/dashboard" className="hover:text-primary">Recipient dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-label font-semibold text-ink">Contact</h3>
          <ul className="mt-3 space-y-2 text-small text-muted">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> House 12, Road 5, Gulshan 1, Dhaka 1212</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-secondary" /> +880 1700 000 111</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-secondary" /> hello@smartfoodexchange.org</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-caption text-muted sm:flex-row">
          <p>© Group7__CSE327.</p>
          <p>English · বাংলা</p>
        </div>
      </div>
    </footer>
  );
}
