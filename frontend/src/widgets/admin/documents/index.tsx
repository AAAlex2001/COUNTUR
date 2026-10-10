"use client";

import { DocumentsTable, useDocumentsList } from "@/features/documents-admin";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

/** Страница админки с документами магазина. */
const AdminDocuments = () => {
  const { documents, failed } = useDocumentsList();

  return (
    <section className={styles.documents}>
      <div className={styles.heading}>
        <h1 className={styles.title}>Документы</h1>
        <p className={styles.description}>
          Политика, согласие и соглашение. Изменения сразу видны на сайте, дата редакции обновляется
          сама.
        </p>
      </div>

      {failed && <p className={styles.error}>Не удалось загрузить документы.</p>}

      {!documents && !failed && <Loader size="lg" />}

      {documents && <DocumentsTable documents={documents} />}
    </section>
  );
};

export default AdminDocuments;
