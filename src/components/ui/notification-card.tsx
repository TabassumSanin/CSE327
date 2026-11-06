"use client";

import { Bell, Check, Inbox } from "lucide-react";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

export function NotificationCard({
  item,
  onRead,
}: {
  item: Notification;
  onRead: (id: string) => void;
}) {
  return (
    <article
      className={cn(
        "card flex gap-3 p-4 transition",
        item.read ? "bg-white" : "border-[#C6DFD0] bg-lightgreen/40"
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full",
          item.read ? "bg-page text-muted" : "bg-lightgreen text-primary"
        )}
      >
        <Bell className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className={cn("text-label", item.read ? "text-ink" : "font-semibold text-ink")}>
            {item.title}
          </h3>
          <span className="text-caption text-muted">{item.time}</span>
        </div>
        <p className="mt-1 text-small text-muted">{item.message}</p>
        <div className="mt-2.5 flex items-center gap-3">
          <span className="rounded-full bg-white px-2 py-0.5 text-caption capitalize text-muted">
            {item.type}
          </span>
          {!item.read ? (
            <button
              type="button"
              onClick={() => onRead(item.id)}
              className="inline-flex items-center gap-1 text-caption font-semibold text-primary hover:underline"
            >
              <Check className="h-3.5 w-3.5" /> Mark as read
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-caption text-muted">
              <Inbox className="h-3.5 w-3.5" /> Read
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
