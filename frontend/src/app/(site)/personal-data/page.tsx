import { documentMetadata } from "../../seo/documents";
import { DocumentPage } from "../document-page";

const SLUG = "personal-data";

export const dynamic = "force-dynamic";

/** Собрать метаданные документа. */
export const generateMetadata = () => documentMetadata(SLUG);

/** Показать согласие на обработку данных. */
export default function PersonalDataPage() {
  return <DocumentPage slug={SLUG} />;
}
