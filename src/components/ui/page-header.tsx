import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  eyebrow?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-1 text-caption font-semibold uppercase tracking-wider text-secondary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-h1 text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-small text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("card overflow-hidden", className)}>
      {title ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-4 md:px-6">
          <div>
            <h2 className="text-h3 text-ink">{title}</h2>
            {description ? <p className="mt-0.5 text-caption text-muted">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className={cn("p-4 md:p-6", bodyClassName)}>{children}</div>
    </section>
  );
}
