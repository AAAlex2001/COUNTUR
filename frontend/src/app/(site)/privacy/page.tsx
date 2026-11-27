import { PRIVACY_APPENDIX } from "@/shared/config/site";
import { documentMetadata } from "../../seo/documents";
import { DocumentPage } from "../document-page";

const SLUG = "privacy";

export const dynamic = "force-dynamic";

/** Собрать метаданные документа. */
export const generateMetadata = () => documentMetadata(SLUG);

/** Показать политику конфиденциальности. */
export default function PrivacyPage() {
  return <DocumentPage slug={SLUG} appendix={PRIVACY_APPENDIX} />;
}
