"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Language, translate } from "@/lib/i18n";
import {
  activities as seedActivities,
  currentDonor,
  currentRecipient,
  donations as seedDonations,
  notifications as seedNotifications,
  reservations as seedReservations,
  users as seedUsers,
} from "@/data/mock";
import type {
  ActivityItem,
  AppUser,
  Donation,
  Notification,
  Reservation,
  ReservationStatus,
} from "@/types";

export interface DonationFormInput {
  name: string;
  category: Donation["category"];
  description: string;
  quantity: number;
  unit: string;
  preparedAt: string;
  expiresAt: string;
  storage: string;
  temperature?: string;
  allergens: string[];
  pickupLocation: string;
  pickupInstructions: string;
  transportation: string;
  photos?: number;
}

interface Toast {
  id: number;
  message: string;
  variant: "success" | "error" | "info";
}

interface AppContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
  donations: Donation[];
  reservations: Reservation[];
  notifications: Notification[];
  users: AppUser[];
  activities: ActivityItem[];
  toasts: Toast[];
  notify: (message: string, variant?: Toast["variant"]) => void;
  dismissToast: (id: number) => void;
  addDonation: (input: DonationFormInput) => Donation;
  updateDonationStatus: (id: string, status: Donation["status"], notes?: string) => void;
  updateDonation: (id: string, patch: Partial<Donation>) => void;
  reserveFood: (donationId: string, quantity: number) => Reservation | null;
  updateReservation: (id: string, status: ReservationStatus, collectedQty?: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: Notification["audience"]) => void;
  updateUserStatus: (id: string, status: AppUser["status"]) => void;
  updateUser: (id: string, patch: Partial<AppUser>) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function stamp() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [donations, setDonations] = useState<Donation[]>(seedDonations);
  const [reservations, setReservations] = useState<Reservation[]>(seedReservations);
  const [notifications, setNotifications] = useState<Notification[]>(seedNotifications);
  const [users, setUsers] = useState<AppUser[]>(seedUsers);
  const [activities, setActivities] = useState<ActivityItem[]>(seedActivities);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, variant: Toast["variant"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      document.documentElement.classList.toggle("font-bangla", next === "bn");
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "bn" : "en");
  }, [language, setLanguage]);

  const t = useCallback((key: string) => translate(key, language), [language]);

  const pushActivity = useCallback((item: Omit<ActivityItem, "id" | "time">) => {
    setActivities((prev) => [
      { ...item, id: `AC-${Date.now()}`, time: "Just now" },
      ...prev,
    ]);
  }, []);

  const addDonation = useCallback(
    (input: DonationFormInput) => {
      const needsReview =
        input.allergens.length === 0 ||
        (["Refrigerated", "Frozen"].includes(input.category) && !input.temperature);
      const donation: Donation = {
        id: `DON-${Math.floor(1100 + Math.random() * 800)}`,
        name: input.name,
        category: input.category,
        description: input.description,
        donor: currentDonor,
        quantity: input.quantity,
        unit: input.unit,
        availableQty: needsReview ? 0 : input.quantity,
        reservedQty: 0,
        collectedQty: 0,
        preparedAt: input.preparedAt,
        expiresAt: input.expiresAt,
        storage: input.storage,
        temperature: input.temperature,
        allergens: input.allergens,
        photos: input.photos ?? 0,
        pickupLocation: input.pickupLocation,
        pickupInstructions: input.pickupInstructions,
        transportation: input.transportation,
        status: needsReview ? "pending-review" : "available",
        verification: needsReview ? "needs-review" : "verified",
        flags: needsReview ? ["Automated verification flagged incomplete safety details"] : [],
        reviewNotes: needsReview ? "Queued for administrator review." : undefined,
        createdAt: new Date().toISOString(),
      };
      setDonations((prev) => [donation, ...prev]);
      setNotifications((prev) => [
        {
          id: `N-${Date.now()}`,
          audience: "donor",
          type: "verification",
          title: needsReview ? "Donation needs review" : "Donation verified",
          message: needsReview
            ? `${donation.name} was submitted for administrator review.`
            : `${donation.name} passed automated verification and is now available.`,
          time: stamp(),
          read: false,
        },
        ...prev,
      ]);
      pushActivity({
        title: "Donation submitted",
        message: `${currentDonor.organization} submitted ${donation.name}.`,
        kind: "donation",
      });
      return donation;
    },
    [pushActivity]
  );

  const updateDonationStatus = useCallback(
    (id: string, status: Donation["status"], notes?: string) => {
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === id
            ? {
                ...donation,
                status,
                reviewNotes: notes ?? donation.reviewNotes,
                verification:
                  status === "rejected"
                    ? "rejected"
                    : status === "available" || status === "reserved"
                    ? "verified"
                    : donation.verification,
                availableQty: status === "rejected" ? 0 : donation.availableQty,
              }
            : donation
        )
      );
      pushActivity({
        title: "Donation status updated",
        message: `${id} is now ${status.replace("-", " ")}.`,
        kind: "review",
      });
    },
    [pushActivity]
  );

  const updateDonation = useCallback(
    (id: string, patch: Partial<Donation>) => {
      setDonations((prev) =>
        prev.map((donation) => (donation.id === id ? { ...donation, ...patch } : donation))
      );
      notify(`${id} updated.`);
      pushActivity({
        title: "Donation updated",
        message: `${id} details were edited by an administrator.`,
        kind: "donation",
      });
    },
    [notify, pushActivity]
  );

  const reserveFood = useCallback(
    (donationId: string, quantity: number) => {
      const donation = donations.find((item) => item.id === donationId);
      if (!donation || quantity <= 0 || quantity > donation.availableQty) {
        notify("That quantity is not available.", "error");
        return null;
      }
      const reservation: Reservation = {
        id: `RES-${Math.floor(5100 + Math.random() * 800)}`,
        donationId,
        foodName: donation.name,
        donorName: donation.donor.organization ?? donation.donor.name,
        recipientName: currentRecipient.organization,
        quantity,
        unit: donation.unit,
        status: "provisional",
        transport: donation.transportation,
        createdAt: new Date().toISOString(),
        collectionDate: donation.expiresAt.slice(0, 10),
        collectionWindow: "To be coordinated",
        address: donation.pickupLocation,
        instructions: donation.pickupInstructions,
        timeline: [
          { title: "Provisional reservation created", description: "A provisional hold was placed on the food quantity.", time: stamp(), done: true },
          { title: "Awaiting confirmation", description: "Confirm this reservation to continue.", time: stamp(), done: true },
          { title: "Transport coordination", description: "Pending confirmation.", time: "Pending", done: false },
          { title: "Collection", description: "Collection schedule will be confirmed.", time: "Pending", done: false },
        ],
      };
      setReservations((prev) => [reservation, ...prev]);
      setDonations((prev) =>
        prev.map((item) =>
          item.id === donationId
            ? {
                ...item,
                availableQty: item.availableQty - quantity,
                reservedQty: item.reservedQty + quantity,
                status: item.availableQty - quantity === 0 ? "reserved" : item.status,
              }
            : item
        )
      );
      setNotifications((prev) => [
        {
          id: `N-${Date.now()}`,
          audience: "recipient",
          type: "reservation",
          title: "Provisional reservation created",
          message: `${quantity} ${donation.unit} of ${donation.name} is held for you.`,
          time: stamp(),
          read: false,
        },
        {
          id: `N-${Date.now() + 1}`,
          audience: "donor",
          type: "reservation",
          title: "New reservation received",
          message: `${currentRecipient.organization} reserved ${quantity} ${donation.unit} of ${donation.name}.`,
          time: stamp(),
          read: false,
        },
        ...prev,
      ]);
      pushActivity({
        title: "Reservation created",
        message: `${currentRecipient.organization} reserved ${quantity} ${donation.unit} of ${donation.name}.`,
        kind: "reservation",
      });
      notify(`Reservation created for ${quantity} ${donation.unit}.`);
      return reservation;
    },
    [donations, notify, pushActivity]
  );

  const updateReservation = useCallback(
    (id: string, status: ReservationStatus, collectedQty?: number) => {
      const target = reservations.find((item) => item.id === id);
      if (!target) return;
      const release = status === "declined" || status === "cancelled" || status === "expired";
      const collected = status === "completed" ? collectedQty ?? target.quantity : target.collectedQty;

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id
            ? {
                ...reservation,
                status,
                collectedQty: collected,
                confirmationDate:
                  status === "confirmed" ? new Date().toISOString() : reservation.confirmationDate,
                timeline: reservation.timeline.map((event, index) => {
                  if (status === "confirmed" && index === 1)
                    return { ...event, title: "Recipient confirmed", description: "Reservation confirmed by the recipient.", time: stamp(), done: true };
                  if (status === "declined" && index === 1)
                    return { ...event, title: "Recipient declined", description: "Held quantity released for matching.", time: stamp(), done: true };
                  if (status === "in-progress" && index === 2)
                    return { ...event, title: "Collection in progress", description: "Collection is underway.", time: stamp(), done: true };
                  if (status === "completed" && index === 3)
                    return { ...event, title: "Collection completed", description: `${collected} ${reservation.unit} collected and confirmed.`, time: stamp(), done: true };
                  return event;
                }),
              }
            : reservation
        )
      );

      setDonations((prev) =>
        prev.map((donation) => {
          if (donation.id !== target.donationId) return donation;
          if (release) {
            const nextAvailable = donation.availableQty + target.quantity;
            const nextReserved = Math.max(0, donation.reservedQty - target.quantity);
            return {
              ...donation,
              availableQty: nextAvailable,
              reservedQty: nextReserved,
              status: donation.status === "expired" || donation.status === "cancelled" ? donation.status : "available",
            };
          }
          if (status === "completed") {
            const nextReserved = Math.max(0, donation.reservedQty - target.quantity);
            return {
              ...donation,
              reservedQty: nextReserved,
              collectedQty: donation.collectedQty + (collected ?? 0),
              status:
                donation.availableQty === 0 && nextReserved === 0 ? "completed" : donation.status,
            };
          }
          return donation;
        })
      );

      if (status === "confirmed") {
        setNotifications((prev) => [
          {
            id: `N-${Date.now()}`,
            audience: "donor",
            type: "confirmation",
            title: "Reservation confirmed",
            message: `${target.recipientName} confirmed ${target.id}.`,
            time: stamp(),
            read: false,
          },
          ...prev,
        ]);
        notify(`${target.id} confirmed.`);
      } else if (status === "declined") {
        notify(`${target.id} declined and its quantity was released.`, "info");
      } else if (status === "completed") {
        notify(`Collection confirmed: ${collected} ${target.unit}.`);
      } else if (status === "in-progress") {
        notify("Collection marked as in progress.", "info");
      }
      pushActivity({
        title: "Reservation updated",
        message: `${target.id} is now ${status.replace("-", " ")}.`,
        kind: "reservation",
      });
    },
    [notify, pushActivity, reservations]
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)));
  }, []);

  const markAllNotificationsRead = useCallback((audience: Notification["audience"]) => {
    setNotifications((prev) =>
      prev.map((item) => (item.audience === audience ? { ...item, read: true } : item))
    );
  }, []);

  const updateUserStatus = useCallback(
    (id: string, status: AppUser["status"]) => {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));
      pushActivity({
        title: "User account updated",
        message: `${id} was marked ${status.replace("-", " ")}.`,
        kind: "user",
      });
      notify(`Account ${status}.`);
    },
    [notify, pushActivity]
  );

  const updateUser = useCallback(
    (id: string, patch: Partial<AppUser>) => {
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, ...patch } : user)));
      notify(`${id} profile updated.`);
      pushActivity({
        title: "User profile updated",
        message: `${id} profile details were edited.`,
        kind: "user",
      });
    },
    [notify, pushActivity]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      donations,
      reservations,
      notifications,
      users,
      activities,
      toasts,
      notify,
      dismissToast,
      addDonation,
      updateDonationStatus,
      updateDonation,
      reserveFood,
      updateReservation,
      markNotificationRead,
      markAllNotificationsRead,
      updateUserStatus,
      updateUser,
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      t,
      donations,
      reservations,
      notifications,
      users,
      activities,
      toasts,
      notify,
      dismissToast,
      addDonation,
      updateDonationStatus,
      updateDonation,
      reserveFood,
      updateReservation,
      markNotificationRead,
      markAllNotificationsRead,
      updateUserStatus,
      updateUser,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
