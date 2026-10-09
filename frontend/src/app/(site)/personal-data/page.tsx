import type { Metadata } from "next";
import LegalDocumentPage from "@/widgets/legal-document";
import { PERSONAL_DATA } from "@/widgets/legal-document/documents/personal-data";

export const metadata: Metadata = {
  title: PERSONAL_DATA.title,
  description: PERSONAL_DATA.description,
  alternates: { canonical: PERSONAL_DATA.path },
};

/** Обработка персональных данных и шаблон согласия. */
export default function PersonalDataRoute() {
  return (
    <main>
      <LegalDocumentPage document={PERSONAL_DATA} />
    </main>
  );
}
