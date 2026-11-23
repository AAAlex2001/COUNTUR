import type { Metadata } from "next";
import { getContacts } from "@/entities/contacts";
import { CONTACTS_PATH } from "@/shared/config/site";
import EmptyState from "@/shared/ui/empty-state";
import { HeadphonesIcon } from "@/shared/ui/icons";
import Contacts from "@/widgets/contacts";

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getContacts();
  return {
    title: settings?.title || "Контакты",
    description: settings?.description || undefined,
    alternates: { canonical: CONTACTS_PATH },
  };
};

/** Контакты и форма обратной связи. */
export default async function ContactsRoute() {
  const settings = await getContacts();

  return (
    <main>
      {settings ? (
        <Contacts settings={settings} />
      ) : (
        <EmptyState
          icon={<HeadphonesIcon />}
          title="Контакты временно недоступны"
          text="Попробуйте открыть страницу позже."
        />
      )}
    </main>
  );
}
