import React from "react";
import { cn } from "@/lib/utils";

type Padding = "none" | "sm" | "md" | "lg";

const paddingStyles: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-5 md:p-6",
  lg: "p-6 md:p-8",
};

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Inner padding. Use "none" when the card contains a photo or table. */
  padding?: Padding;
  /** Adds the single soft shadow and a pointer cursor on hover. */
  interactive?: boolean;
  /** Render as a different element, for example "article" or "li". */
  as?: React.ElementType;
}

export function Card({
  className,
  padding = "md",
  interactive = false,
  as: Tag = "div",
  children,
  ...props
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-line bg-card",
        paddingStyles[padding],
        interactive && "transition-shadow hover:shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/** A hairline divider that matches the card border. */
export function CardDivider({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} aria-hidden />;
}
