import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger" | "soft" | "white";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover active:bg-primary-hover",
  secondary:
    "border border-line bg-white text-ink hover:border-primary hover:text-primary active:bg-cream",
  accent: "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover",
  outline:
    "border border-line bg-white text-ink hover:border-primary hover:text-primary active:bg-cream",
  ghost: "text-ink hover:bg-cream hover:text-primary",
  danger: "bg-risk-review text-white hover:bg-risk-review/90 active:bg-risk-review/90",
  soft: "bg-softgreen text-primary hover:bg-softgreen/70 active:bg-softgreen/70",
  white: "bg-white text-primary hover:bg-cream active:bg-cream",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-caption font-semibold gap-1.5",
  md: "h-10 px-4 text-btn gap-2",
  lg: "h-12 px-6 text-btn gap-2",
  icon: "h-10 w-10 justify-center",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={buttonStyles(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : null}
      {children}
    </button>
  );
});
