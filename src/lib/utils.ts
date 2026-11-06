export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function daysUntil(value: string) {
  const diff = new Date(value).getTime() - new Date("2026-11-06T12:00:00").getTime();
  return Math.ceil(diff / 86400000);
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const categoryImageSlugs: Record<string, string> = {
  "Prepared Food": "prepared",
  "Packaged Food": "packaged",
  Produce: "produce",
  Bakery: "bakery",
  Refrigerated: "refrigerated",
  Frozen: "frozen",
};

export function categorySlug(category: string) {
  return categoryImageSlugs[category] ?? category.toLowerCase().replace(/\s+/g, "-");
}
