import React from "react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label ? (
        <label htmlFor={htmlFor} className="label">
          {label}
          {required ? <span className="ml-1 text-[#B4473D]">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="mt-1 text-caption text-muted">{hint}</p> : null}
      {error ? <p className="mt-1 text-caption text-[#B4473D]">{error}</p> : null}
    </div>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn("field", className)} {...props} />;
  }
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} className={cn("field min-h-[104px] resize-y", className)} {...props} />;
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select ref={ref} className={cn("field cursor-pointer pr-8", className)} {...props}>
      {children}
    </select>
  );
});
