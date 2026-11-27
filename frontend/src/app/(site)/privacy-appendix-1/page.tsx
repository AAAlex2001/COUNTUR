import { documentMetadata } from "../../seo/documents";
import { DocumentPage } from "../document-page";

const SLUG = "privacy-appendix-1";

export const dynamic = "force-dynamic";

/** Собрать метаданные документа. */
export const generateMetadata = () => documentMetadata(SLUG);

/** Показать приложение к политике. */
export default function PrivacyAppendixPage() {
  return <DocumentPage slug={SLUG} />;
}
