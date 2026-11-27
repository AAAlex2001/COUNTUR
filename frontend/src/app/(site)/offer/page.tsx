import { documentMetadata } from "../../seo/documents";
import { DocumentPage } from "../document-page";

const SLUG = "offer";

export const dynamic = "force-dynamic";

/** Собрать метаданные документа. */
export const generateMetadata = () => documentMetadata(SLUG);

/** Показать договор оферты. */
export default function OfferPage() {
  return <DocumentPage slug={SLUG} />;
}
