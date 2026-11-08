import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";

export const metadata: Metadata = {
  title: "Surplus food, matched in Dhaka | Smart Food Exchange",
  description:
    "List surplus food from a Dhaka kitchen, bakery, farm or event. Automated safety checks and matching help a registered recipient collect it nearby.",
};

export default function Page() {
  return <HomePage />;
}
