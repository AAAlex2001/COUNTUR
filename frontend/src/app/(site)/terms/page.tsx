import type { Metadata } from "next";
import LegalDocumentPage from "@/widgets/legal-document";
import { TERMS } from "@/widgets/legal-document/documents/terms";

export const metadata: Metadata = {
  title: TERMS.title,
  description: TERMS.description,
  alternates: { canonical: TERMS.path },
};

/** Пользовательское соглашение. */
export default function TermsRoute() {
  return (
    <main>
      <LegalDocumentPage document={TERMS} />
    </main>
  );
}
