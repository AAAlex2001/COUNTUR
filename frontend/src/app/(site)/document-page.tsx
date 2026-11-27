import { notFound } from "next/navigation";
import { getContacts } from "@/entities/contacts";
import { getDocument } from "@/entities/document";
import LegalDocument from "@/widgets/legal-document";

type DocumentPageProps = {
  slug: string;
  appendix?: { label: string; href: string };
};

/** Открыть документ магазина. */
export async function DocumentPage({ slug, appendix }: DocumentPageProps) {
  const [document, contacts] = await Promise.all([getDocument(slug), getContacts()]);

  if (!document) notFound();

  return <LegalDocument document={document} contacts={contacts} appendix={appendix} />;
}
