import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ClipboardCheck,
  Package,
  CalendarCheck,
  BarChart3,
  Settings,
  PlusSquare,
  HeartHandshake,
  History,
  Bell,
  UserCog,
  UtensilsCrossed,
  Apple,
} from "lucide-react";

export interface NavItem {
  label: string;
  labelBn: string;
  href: string;
  icon: LucideIcon;
}

export const adminNav: NavItem[] = [
  { label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manage Users", labelBn: "ব্যবহারকারী", href: "/admin/users", icon: Users },
  { label: "Account Approvals", labelBn: "অ্যাকাউন্ট অনুমোদন", href: "/admin/approvals", icon: UserCheck },
  { label: "Food Reviews", labelBn: "খাদ্য পর্যালোচনা", href: "/admin/food-reviews", icon: ClipboardCheck },
  { label: "Donations", labelBn: "অনুদান", href: "/admin/donations", icon: Package },
  { label: "Reservations", labelBn: "সংরক্ষণ", href: "/admin/reservations", icon: CalendarCheck },
  { label: "Reports", labelBn: "প্রতিবেদন", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", labelBn: "সেটিংস", href: "/admin/settings", icon: Settings },
];

export const donorNav: NavItem[] = [
  { label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/donor/dashboard", icon: LayoutDashboard },
  { label: "Add Donation", labelBn: "অনুদান যোগ করুন", href: "/donor/add-donation", icon: PlusSquare },
  { label: "My Donations", labelBn: "আমার অনুদান", href: "/donor/donations", icon: HeartHandshake },
  { label: "Reservations", labelBn: "সংরক্ষণ", href: "/donor/reservations", icon: CalendarCheck },
  { label: "History", labelBn: "ইতিহাস", href: "/donor/history", icon: History },
  { label: "Notifications", labelBn: "বিজ্ঞপ্তি", href: "/donor/notifications", icon: Bell },
  { label: "Profile", labelBn: "প্রোফাইল", href: "/donor/profile", icon: UserCog },
];

export const recipientNav: NavItem[] = [
  { label: "Dashboard", labelBn: "ড্যাশবোর্ড", href: "/recipient/dashboard", icon: LayoutDashboard },
  { label: "Available Food", labelBn: "উপলব্ধ খাবার", href: "/recipient/available-food", icon: UtensilsCrossed },
  { label: "Reservations", labelBn: "সংরক্ষণ", href: "/recipient/reservations", icon: CalendarCheck },
  { label: "Collections", labelBn: "সংগ্রহ", href: "/recipient/collections", icon: Package },
  { label: "History", labelBn: "ইতিহাস", href: "/recipient/history", icon: History },
  { label: "Notifications", labelBn: "বিজ্ঞপ্তি", href: "/recipient/notifications", icon: Bell },
  { label: "Profile", labelBn: "প্রোফাইল", href: "/recipient/profile", icon: UserCog },
];

export const mobileNav: Record<string, NavItem[]> = {
  donor: [
    donorNav[0],
    donorNav[1],
    donorNav[2],
    donorNav[5],
    donorNav[6],
  ],
  recipient: [
    recipientNav[0],
    recipientNav[1],
    recipientNav[2],
    recipientNav[5],
    recipientNav[6],
  ],
  admin: [adminNav[0], adminNav[2], adminNav[3], adminNav[4], adminNav[7]],
};

export const foodCategories = [
  { name: "Prepared Food", bn: "প্রস্তুত খাবার", image: "/images/food-prepared.svg", icon: UtensilsCrossed },
  { name: "Packaged Food", bn: "প্যাকেটজাত খাবার", image: "/images/food-packaged.svg", icon: Package },
  { name: "Produce", bn: "তাজা ফল ও সবজি", image: "/images/food-produce.svg", icon: Apple },
  { name: "Bakery", bn: "বেকারি", image: "/images/food-bakery.svg", icon: UtensilsCrossed },
  { name: "Refrigerated", bn: "ফ্রিজে রাখা খাবার", image: "/images/food-refrigerated.svg", icon: Package },
  { name: "Frozen", bn: "হিমায়িত খাবার", image: "/images/food-frozen.svg", icon: Package },
];
