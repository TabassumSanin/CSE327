"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 md:items-center md:p-6">
      <div
        className="absolute inset-0 bg-[#1B2C23]/50 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-soft animate-fade-up md:rounded-2xl",
          sizes[size]
        )}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-line bg-white px-4 py-4 md:px-6">
          <div>
            <h2 className="text-h3 text-ink">{title}</h2>
            {description ? <p className="mt-1 text-small text-muted">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1.5 text-muted transition hover:bg-lightgreen hover:text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-4 py-4 md:px-6">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-line bg-white px-4 py-4 sm:flex-row sm:justify-end md:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "primary",
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "primary" | "danger" | "secondary";
  icon?: React.ReactNode;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        {icon ? <div className="mt-0.5 shrink-0">{icon}</div> : null}
        <p className="text-small text-muted">{description}</p>
      </div>
      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-line bg-white px-4 text-btn text-ink transition hover:border-secondary"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-xl px-4 text-btn text-white transition",
            variant === "danger"
              ? "bg-[#B4473D] hover:bg-[#9d3c33]"
              : "bg-primary hover:bg-[#1d4c39]"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
