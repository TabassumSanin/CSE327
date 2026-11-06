export type Role = "admin" | "donor" | "recipient";

export type DonationStatus =
  | "available"
  | "reserved"
  | "completed"
  | "pending-review"
  | "rejected"
  | "expired"
  | "cancelled";

export type VerificationStatus = "verified" | "needs-review" | "rejected";

export type ReservationStatus =
  | "provisional"
  | "awaiting"
  | "confirmed"
  | "declined"
  | "expired"
  | "in-progress"
  | "completed"
  | "cancelled";

export type FoodCategory =
  | "Prepared Food"
  | "Packaged Food"
  | "Produce"
  | "Bakery"
  | "Refrigerated"
  | "Frozen";

export interface DonorInfo {
  id: string;
  name: string;
  organization?: string;
  email: string;
  phone: string;
}

export interface Donation {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  donor: DonorInfo;
  quantity: number;
  unit: string;
  availableQty: number;
  reservedQty: number;
  collectedQty: number;
  preparedAt: string;
  expiresAt: string;
  storage: string;
  temperature?: string;
  allergens: string[];
  photos: number;
  pickupLocation: string;
  pickupInstructions: string;
  transportation: string;
  status: DonationStatus;
  verification: VerificationStatus;
  flags: string[];
  reviewNotes?: string;
  createdAt: string;
}

export interface ReservationEvent {
  title: string;
  description: string;
  time: string;
  done: boolean;
}

export interface Reservation {
  id: string;
  donationId: string;
  foodName: string;
  donorName: string;
  recipientName: string;
  quantity: number;
  unit: string;
  status: ReservationStatus;
  transport: string;
  createdAt: string;
  confirmationDate?: string;
  collectionDate?: string;
  collectionWindow: string;
  collectedQty?: number;
  address: string;
  instructions: string;
  timeline: ReservationEvent[];
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  accountType: "Individual" | "Organization";
  organization?: string;
  location: string;
  status: "active" | "inactive" | "pending" | "rejected" | "under-review";
  joinedAt: string;
  documents: string[];
  applicantType?: "Donor" | "Recipient";
  avatarColor: string;
}

export interface Notification {
  id: string;
  audience: Role;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  message: string;
  time: string;
  kind: "donation" | "user" | "reservation" | "review";
}
