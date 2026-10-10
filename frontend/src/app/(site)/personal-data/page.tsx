import { notFound } from "next/navigation";
import { getDocument } from "@/entities/document";
import LegalDocumentPage, { documentMetadata } from "@/widgets/legal-document";

const SLUG = "personal-data";

export const dynamic = "force-dynamic";

export const generateMetadata = () => documentMetadata(SLUG);

/** Обработка персональных данных и текст согласия. Текст правится в админке. */
export default async function PersonalDataRoute() {
  const document = await getDocument(SLUG);

  if (!document) notFound();

  return (
    <main>
      <LegalDocumentPage document={document} />
    </main>
  );
}
