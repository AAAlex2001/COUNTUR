import { notFound } from "next/navigation";
import { getDocument } from "@/entities/document";
import LegalDocumentPage, { documentMetadata } from "@/widgets/legal-document";

const SLUG = "terms";

export const dynamic = "force-dynamic";

export const generateMetadata = () => documentMetadata(SLUG);

/** Пользовательское соглашение. Текст правится в админке. */
export default async function TermsRoute() {
  const document = await getDocument(SLUG);

  if (!document) notFound();

  return (
    <main>
      <LegalDocumentPage document={document} />
    </main>
  );
}
