"use client";

import { cn } from "@/lib/utils";

export function Tabs({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-thin", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-label transition",
            value === option.value
              ? "bg-primary text-white"
              : "text-muted hover:bg-lightgreen hover:text-primary"
          )}
        >
          {option.label}
          {option.count !== undefined ? (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-caption font-semibold",
                value === option.value ? "bg-white/20 text-white" : "bg-lightgreen text-primary"
              )}
            >
              {option.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
