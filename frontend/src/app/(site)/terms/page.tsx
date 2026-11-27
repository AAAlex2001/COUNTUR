import { documentMetadata } from "../../seo/documents";
import { DocumentPage } from "../document-page";

const SLUG = "terms";

export const dynamic = "force-dynamic";

/** Собрать метаданные документа. */
export const generateMetadata = () => documentMetadata(SLUG);

/** Показать пользовательское соглашение. */
export default function TermsPage() {
  return <DocumentPage slug={SLUG} />;
}
