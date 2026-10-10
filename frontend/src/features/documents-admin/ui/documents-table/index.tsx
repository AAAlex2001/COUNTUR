import Link from "next/link";
import { documentPath, type LegalDocument } from "@/entities/document";
import { adminDocumentPath } from "@/shared/lib/admin-paths";
import { formatShortDate } from "@/shared/lib/date";
import { FileTextIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type DocumentsTableProps = {
  documents: LegalDocument[];
};

/** Список документов. Строка целиком ведёт в редактор. */
const DocumentsTable = ({ documents }: DocumentsTableProps) => (
  <ul className={styles.table}>
    {documents.map((document) => (
      <li key={document.slug}>
        <Link className={styles.row} href={adminDocumentPath(document.slug)}>
          <span className={styles.icon}>
            <FileTextIcon />
          </span>

          <span className={styles.info}>
            <span className={styles.title}>{document.title}</span>
            <span className={styles.meta}>{documentPath(document.slug)}</span>
          </span>

          <span className={styles.meta}>Редакция {formatShortDate(document.updated_at)}</span>
        </Link>
      </li>
    ))}
  </ul>
);

export default DocumentsTable;
