"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Info,
  Leaf,
  Package,
  ShieldCheck,
  ThermometerSnowflake,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/components/providers/app-provider";
import { PageHeader, SectionCard } from "@/components/ui/page-header";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/empty-state";
import { categorySlug } from "@/lib/utils";
import type { Donation } from "@/types";

const categories: Donation["category"][] = [
  "Prepared Food",
  "Packaged Food",
  "Produce",
  "Bakery",
  "Refrigerated",
  "Frozen",
];

const allergenOptions = ["Gluten", "Milk", "Eggs", "Nuts", "Mustard", "Soy", "Fish", "None"];

const initialForm = {
  name: "",
  category: "Prepared Food" as Donation["category"],
  description: "",
  quantity: "",
  unit: "kg",
  preparedAt: "2026-11-06T08:00",
  expiresAt: "2026-11-07T20:00",
  storage: "Hot holding above 60°C",
  temperature: "",
  pickupLocation: "",
  pickupInstructions: "",
  transportation: "Donor can deliver within 5 km",
};

export default function AddDonationPage() {
  const { addDonation, notify } = useApp();
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [allergens, setAllergens] = useState<string[]>(["None"]);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [certified, setCertified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const needsTemperature = form.category === "Refrigerated" || form.category === "Frozen";

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleAllergen = (allergen: string) => {
    setErrors((prev) => ({ ...prev, allergens: "" }));
    if (allergen === "None") {
      setAllergens(["None"]);
      return;
    }
    setAllergens((prev) => {
      const next = prev.filter((item) => item !== "None");
      return next.includes(allergen) ? next.filter((item) => item !== allergen) : [...next, allergen];
    });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Enter a food name of at least 3 characters.";
    if (form.description.trim().length < 20) next.description = "Describe the food, ingredients, and packaging (at least 20 characters).";
    const quantity = Number(form.quantity);
    if (!quantity || quantity <= 0) next.quantity = "Enter an available quantity greater than zero.";
    if (!form.preparedAt) next.preparedAt = "Select when the food was prepared.";
    if (!form.expiresAt) next.expiresAt = "Select a safe consumption deadline.";
    if (form.preparedAt && form.expiresAt && new Date(form.expiresAt) <= new Date(form.preparedAt)) {
      next.expiresAt = "The expiry time must be after the preparation time.";
    }
    if (!form.storage.trim()) next.storage = "Select or describe the storage conditions.";
    if (needsTemperature && !form.temperature.trim()) next.temperature = "Temperature is required for refrigerated or frozen food.";
    if (allergens.length === 0) next.allergens = "Select at least one allergen option, or choose None.";
    if (!form.pickupLocation.trim()) next.pickupLocation = "Enter the pickup address.";
    if (!form.pickupInstructions.trim()) next.pickupInstructions = "Add instructions to help recipients collect the food safely.";
    if (photos.length === 0) next.photos = "Add at least one photo of the food.";
    if (!certified) next.certified = "Confirm the food is safe for redistribution.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) {
      notify("Please fix the highlighted fields before submitting.", "error");
      return;
    }
    const donation = addDonation({
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
      preparedAt: form.preparedAt,
      expiresAt: form.expiresAt,
      storage: form.storage,
      temperature: needsTemperature ? form.temperature : undefined,
      allergens: allergens.includes("None") ? [] : allergens,
      pickupLocation: form.pickupLocation.trim(),
      pickupInstructions: form.pickupInstructions.trim(),
      transportation: form.transportation,
      photos: photos.length,
    });
    notify(`Donation ${donation.id} submitted${donation.status === "pending-review" ? " for review" : " and verified"}.`);
    router.push(`/donor/donations/${donation.id}`);
  };

  const completion = useMemo(() => {
    const checks = [
      form.name.trim().length >= 3,
      form.description.trim().length >= 20,
      Number(form.quantity) > 0,
      Boolean(form.preparedAt && form.expiresAt),
      Boolean(form.storage),
      !needsTemperature || Boolean(form.temperature),
      allergens.length > 0,
      Boolean(form.pickupLocation && form.pickupInstructions),
      photos.length > 0,
      certified,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [form, allergens, photos, certified, needsTemperature]);

  return (
    <>
      <PageHeader
        title="Add Donation"
        description="Share surplus food with verified recipients. Complete details help automated verification pass faster."
        actions={
          <Link href="/donor/donations" className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-white px-4 text-btn text-ink transition hover:border-secondary hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to donations
          </Link>
        }
      />

      <form onSubmit={submit} className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]" noValidate>
        <div className="space-y-4">
          <SectionCard title="Food Details" description="Tell recipients what is available">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Food name" htmlFor="donation-name" required error={errors.name} className="sm:col-span-2">
                <Input id="donation-name" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="e.g. Fresh Vegetable Curry" />
              </Field>
              <Field label="Category" htmlFor="donation-category" required>
                <Select id="donation-category" value={form.category} onChange={(event) => set("category", event.target.value as Donation["category"])}>
                  {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                </Select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Quantity" htmlFor="donation-quantity" required error={errors.quantity}>
                  <Input id="donation-quantity" type="number" min={1} value={form.quantity} onChange={(event) => set("quantity", event.target.value)} placeholder="0" />
                </Field>
                <Field label="Unit" htmlFor="donation-unit" required>
                  <Select id="donation-unit" value={form.unit} onChange={(event) => set("unit", event.target.value)}>
                    <option value="kg">kg</option>
                    <option value="litre">litre</option>
                    <option value="portions">portions</option>
                    <option value="boxes">boxes</option>
                  </Select>
                </Field>
              </div>
              <Field label="Description" htmlFor="donation-description" required error={errors.description} hint="Include ingredients, packaging, and who the food is suitable for." className="sm:col-span-2">
                <Textarea id="donation-description" rows={4} value={form.description} onChange={(event) => set("description", event.target.value)} placeholder="Describe the food, how it was prepared, and how it is packed." />
              </Field>
            </div>
          </SectionCard>

          <SectionCard title="Preparation & Safety" description="Used by automated verification before matching">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prepared at" htmlFor="donation-prepared" required error={errors.preparedAt}>
                <Input id="donation-prepared" type="datetime-local" value={form.preparedAt} onChange={(event) => set("preparedAt", event.target.value)} />
              </Field>
              <Field label="Safe until" htmlFor="donation-expires" required error={errors.expiresAt}>
                <Input id="donation-expires" type="datetime-local" value={form.expiresAt} onChange={(event) => set("expiresAt", event.target.value)} />
              </Field>
              <Field label="Storage conditions" htmlFor="donation-storage" required error={errors.storage}>
                <Select id="donation-storage" value={form.storage} onChange={(event) => set("storage", event.target.value)}>
                  <option>Hot holding above 60°C</option>
                  <option>Cool dry place</option>
                  <option>Cool, ventilated storage</option>
                  <option>Refrigerated at 2–4°C</option>
                  <option>Frozen at -18°C or below</option>
                </Select>
              </Field>
              <Field
                label={needsTemperature ? "Temperature (required)" : "Temperature (optional)"}
                htmlFor="donation-temperature"
                required={needsTemperature}
                error={errors.temperature}
                hint={needsTemperature ? "Cold-chain details are required for this category." : "Add if your storage has a measured temperature."}
              >
                <Input id="donation-temperature" value={form.temperature} onChange={(event) => set("temperature", event.target.value)} placeholder="e.g. 3°C" />
              </Field>
            </div>

            <div className="mt-4 border-t border-line pt-4">
              <p className="label">Allergens <span className="text-[#B4473D]">*</span></p>
              <div className="flex flex-wrap gap-2">
                {allergenOptions.map((allergen) => {
                  const selected = allergens.includes(allergen);
                  return (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergen(allergen)}
                      aria-pressed={selected}
                      className={`rounded-full border px-3 py-1.5 text-caption font-medium transition ${
                        selected ? "border-primary bg-primary text-white" : "border-line bg-white text-muted hover:border-secondary hover:text-primary"
                      }`}
                    >
                      {allergen}
                    </button>
                  );
                })}
              </div>
              {errors.allergens ? <p className="mt-1 text-caption text-[#B4473D]">{errors.allergens}</p> : null}
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-3">
                <p className="label">Food photos <span className="text-[#B4473D]">*</span></p>
                <span className="text-caption text-muted">{photos.length}/4</span>
              </div>
              <label htmlFor="donation-photos" className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-page px-4 py-5 text-center transition hover:border-secondary">
                <Upload className="h-5 w-5 text-secondary" />
                <span className="mt-1 text-label font-medium text-ink">Upload food photos</span>
                <span className="text-caption text-muted">JPG or PNG · up to 4 images · clear photos speed up review</span>
                <input
                  id="donation-photos"
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []).slice(0, 4 - photos.length);
                    setPhotos((prev) => [...prev, ...files.map((file) => ({ name: file.name, url: URL.createObjectURL(file) }))].slice(0, 4));
                    setErrors((prev) => ({ ...prev, photos: "" }));
                  }}
                />
              </label>
              {errors.photos ? <p className="mt-1 text-caption text-[#B4473D]">{errors.photos}</p> : null}
              {photos.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photos.map((photo) => (
                    <span key={photo.url} className="relative h-16 w-20 overflow-hidden rounded-lg border border-line">
                      <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos((prev) => prev.filter((item) => item.url !== photo.url))}
                        className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-white/90 text-[#8C2F27]"
                        aria-label={`Remove ${photo.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="Pickup Details" description="Help the recipient collect safely">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Pickup location" htmlFor="donation-location" required error={errors.pickupLocation} className="sm:col-span-2">
                <Input id="donation-location" value={form.pickupLocation} onChange={(event) => set("pickupLocation", event.target.value)} placeholder="Building, road, area, city" />
              </Field>
              <Field label="Pickup instructions" htmlFor="donation-instructions" required error={errors.pickupInstructions} className="sm:col-span-2">
                <Textarea id="donation-instructions" rows={3} value={form.pickupInstructions} onChange={(event) => set("pickupInstructions", event.target.value)} placeholder="Entry point, contact person, loading bay, or timing notes." />
              </Field>
              <Field label="Transportation" htmlFor="donation-transport" className="sm:col-span-2">
                <Select id="donation-transport" value={form.transportation} onChange={(event) => set("transportation", event.target.value)}>
                  <option>Donor can deliver within 5 km</option>
                  <option>Donor delivers</option>
                  <option>Recipient pickup</option>
                  <option>Recipient pickup with cold chain</option>
                  <option>Donor delivers with refrigerated van</option>
                </Select>
              </Field>
            </div>

            <label className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-page p-3 text-small text-ink">
              <input
                type="checkbox"
                checked={certified}
                onChange={(event) => { setCertified(event.target.checked); setErrors((prev) => ({ ...prev, certified: "" })); }}
                className="mt-0.5 h-4 w-4 rounded accent-[#245C45]"
              />
              <span>
                I confirm this food was handled safely, is within its safe consumption window, and is suitable for redistribution.
              </span>
            </label>
            {errors.certified ? <p className="mt-1 text-caption text-[#B4473D]">{errors.certified}</p> : null}
            {Object.keys(errors).length ? <div className="mt-3"><ErrorMessage message="Some required details are missing. Review the highlighted fields above." /></div> : null}
          </SectionCard>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link href="/donor/donations" className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-white px-4 text-btn text-ink transition hover:border-secondary">
              Cancel
            </Link>
            <Button type="submit"><ShieldCheck className="h-4 w-4" /> Submit for verification</Button>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <SectionCard title="Donation Preview">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-lightgreen">
              <Image
                src={`/images/food-${categorySlug(form.category)}.svg`}
                alt={`${form.category} illustration`}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3">
              <p className="text-h3 text-ink">{form.name.trim() || "Your food donation"}</p>
              <p className="mt-0.5 text-caption text-muted">{form.category} · {form.quantity || "0"} {form.unit}</p>
              <p className="mt-2 line-clamp-3 text-small text-muted">
                {form.description.trim() || "Your description will appear here for recipients and reviewers."}
              </p>
              <div className="mt-3 space-y-2 border-t border-line pt-3 text-caption">
                <p className="flex items-center gap-1.5 text-muted"><Leaf className="h-3.5 w-3.5 text-secondary" /> {form.storage}</p>
                <p className="flex items-center gap-1.5 text-muted"><Package className="h-3.5 w-3.5 text-secondary" /> {photos.length} photo{photos.length === 1 ? "" : "s"} attached</p>
                <p className="flex items-center gap-1.5 text-muted"><ThermometerSnowflake className="h-3.5 w-3.5 text-secondary" /> {form.temperature || "No temperature recorded"}</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Readiness">
            <div className="flex items-center justify-between gap-3">
              <p className="text-small text-muted">Completeness</p>
              <p className="text-label font-semibold text-primary">{completion}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E8EEEA]">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${completion}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-caption">
              {[
                [form.name.trim().length >= 3, "Food name added"],
                [form.description.trim().length >= 20, "Description complete"],
                [Number(form.quantity) > 0, "Quantity provided"],
                [Boolean(form.preparedAt && form.expiresAt), "Safety times set"],
                [!needsTemperature || Boolean(form.temperature), "Temperature recorded"],
                [allergens.length > 0, "Allergens declared"],
                [photos.length > 0, "Photos attached"],
                [certified, "Safety confirmed"],
              ].map(([done, label]) => (
                <li key={String(label)} className={`flex items-center gap-2 ${done ? "text-ink" : "text-muted"}`}>
                  <CheckCircle2 className={`h-4 w-4 ${done ? "text-secondary" : "text-line"}`} /> {label}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-lightgreen p-3 text-caption text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Automated verification is advisory. Flagged donations are reviewed by an administrator before matching.
            </div>
          </SectionCard>

          <SectionCard title="Need help?">
            <p className="text-small text-muted">Contact the platform team if you are donating large quantities or need cold-chain transport.</p>
            <div className="mt-3 flex items-center gap-2 text-caption text-muted">
              <Camera className="h-4 w-4 text-secondary" /> Photos should clearly show the food and packaging.
            </div>
          </SectionCard>
        </aside>
      </form>
    </>
  );
}
