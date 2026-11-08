import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Aspect = "wide" | "card" | "square" | "portrait" | "none";

const aspects: Record<Aspect, string> = {
  wide: "aspect-[16/9]",
  card: "aspect-[16/10]",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  none: "",
};

export interface PhotoPlaceholderProps {
  /** Alt text describing the real photo that belongs here. Required. */
  alt: string;
  /** Short visible subject line, e.g. "Vegetable curry in steel trays". */
  label?: string;
  /** Optional caption shown below the image with place and time detail. */
  caption?: string;
  /** Add a real image later without changing the layout. */
  src?: string;
  aspect?: Aspect;
  framed?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * A warm, deliberate stand-in for photography. It never pretends to be a
 * finished photo: the placeholder label stays visible until a real image is
 * supplied through `src`.
 */
export function PhotoPlaceholder({
  alt,
  label,
  caption,
  src,
  aspect = "card",
  framed = true,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: PhotoPlaceholderProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden bg-cream",
        framed && "rounded-xl border border-line",
        className
      )}
    >
      <div className={cn("relative w-full overflow-hidden bg-cream", aspects[aspect])}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="absolute inset-0 flex flex-col justify-between p-4 md:p-5"
          >
            <ImageIcon className="h-5 w-5 text-muted/70" aria-hidden />
            <div aria-hidden>
              {label ? (
                <p className="font-display text-[17px] leading-snug text-ink md:text-[19px]">{label}</p>
              ) : null}
              <p className="mt-1 text-caption text-muted">Photo placeholder</p>
            </div>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="border-t border-line px-4 py-3 text-caption leading-relaxed text-muted">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
