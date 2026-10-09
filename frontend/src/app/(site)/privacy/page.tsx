import type { Metadata } from "next";
import LegalDocumentPage from "@/widgets/legal-document";
import { PRIVACY_POLICY } from "@/widgets/legal-document/documents/privacy";

export const metadata: Metadata = {
  title: PRIVACY_POLICY.title,
  description: PRIVACY_POLICY.description,
  alternates: { canonical: PRIVACY_POLICY.path },
};

/** Политика конфиденциальности. */
export default function PrivacyRoute() {
  return (
    <main>
      <LegalDocumentPage document={PRIVACY_POLICY} />
    </main>
  );
}
