"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  label = "items",
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  label?: string;
}) {
  if (totalPages <= 1) {
    return totalItems !== undefined ? (
      <p className="text-caption text-muted">
        Showing all {totalItems} {label}
      </p>
    ) : null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (item) => item === 1 || item === totalPages || Math.abs(item - page) <= 1
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {totalItems !== undefined ? (
        <p className="text-caption text-muted">
          Page {page} of {totalPages} · {totalItems} {label}
        </p>
      ) : (
        <span />
      )}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-muted transition hover:border-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((item, index) => {
          const previous = pages[index - 1];
          const gap = previous && item - previous > 1;
          return (
            <span key={item} className="flex items-center gap-1">
              {gap ? <span className="px-1 text-caption text-muted">…</span> : null}
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={page === item ? "page" : undefined}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-lg border text-caption font-semibold transition",
                  page === item
                    ? "border-primary bg-primary text-white"
                    : "border-line bg-white text-ink hover:border-secondary"
                )}
              >
                {item}
              </button>
            </span>
          );
        })}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-white text-muted transition hover:border-secondary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
