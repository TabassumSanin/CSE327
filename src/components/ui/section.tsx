import { cn } from "@/lib/utils";

type Tone = "page" | "white" | "cream";
type Spacing = "sm" | "md" | "lg";

const tones: Record<Tone, string> = {
  page: "bg-transparent",
  white: "border-y border-line bg-white",
  cream: "border-y border-line bg-cream",
};

const spacings: Record<Spacing, string> = {
  sm: "py-10 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
};

export function Section({
  id,
  tone = "page",
  spacing = "md",
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  spacing?: Spacing;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn(tones[tone], spacings[spacing], className)}>
      <div className={cn("container-page", containerClassName)}>{children}</div>
    </section>
  );
}

export function SectionHeading({
  title,
  description,
  actions,
  className,
  headingLevel = 2,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="max-w-prose">
        <Heading className={cn("font-display text-ink", headingLevel === 3 ? "text-h3" : "text-h2")}>
          {title}
        </Heading>
        {description ? (
          <p className="mt-2 max-w-2xl text-small leading-relaxed text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
