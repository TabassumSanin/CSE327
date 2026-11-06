import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft" | "white";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-[#1d4c39] active:bg-[#173d2e] shadow-sm disabled:hover:bg-primary",
  secondary:
    "bg-secondary text-white hover:bg-[#327056] active:bg-[#2a604a] shadow-sm disabled:hover:bg-secondary",
  outline:
    "border border-line bg-white text-ink hover:border-secondary hover:text-primary disabled:hover:border-line",
  ghost: "text-ink hover:bg-lightgreen disabled:hover:bg-transparent",
  danger: "bg-[#B4473D] text-white hover:bg-[#9d3c33] disabled:hover:bg-[#B4473D]",
  soft: "bg-lightgreen text-primary hover:bg-[#d8e9de]",
  white: "bg-white text-primary hover:bg-[#f2f8f4] shadow-sm",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-caption font-semibold gap-1.5",
  md: "h-10 px-4 text-btn gap-2",
  lg: "h-12 px-6 text-btn gap-2",
  icon: "h-10 w-10 justify-center",
};

export function buttonStyles(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center rounded-xl transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
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
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});
