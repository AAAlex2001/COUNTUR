import type { Metadata } from "next";
import Contacts from "@/widgets/contacts";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Телефон, почта, адрес магазина COUNTUR и форма обращения в поддержку",
  alternates: { canonical: "/contacts" },
};

/** Контакты и форма обратной связи. */
export default function ContactsRoute() {
  return (
    <main>
      <Contacts />
    </main>
  );
}
