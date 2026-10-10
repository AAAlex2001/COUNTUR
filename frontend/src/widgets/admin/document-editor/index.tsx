"use client";

import { documentPath } from "@/entities/document";
import { DocumentForm, useDocumentEditor } from "@/features/documents-admin";
import { formatDate } from "@/shared/lib/date";
import BackButton from "@/shared/ui/back-button";
import Button from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type DocumentEditorProps = {
  slug: string;
};

/** Редактор документа: шапка с датой редакции и ссылкой на сайт, форма с текстом. */
const DocumentEditor = ({ slug }: DocumentEditorProps) => {
  const { state, change, save } = useDocumentEditor(slug);
  const { document } = state;

  if (state.status === "loading") {
    return <Loader size="lg" />;
  }

  if (state.status === "failed" || !document) {
    return <p className={styles.error}>Документ не найден.</p>;
  }

  return (
    <section className={styles.editor}>
      <BackButton className={styles.back} />

      <div className={styles.header}>
        <div className={styles.titles}>
          <h1 className={styles.title}>{document.title}</h1>
          <p className={styles.meta}>Редакция от {formatDate(document.updated_at)}</p>
        </div>

        <Button variant="outline" href={documentPath(document.slug)}>
          Открыть на сайте
        </Button>
      </div>

      <DocumentForm
        key={document.slug}
        fields={state.fields}
        pending={state.pending}
        onChange={change}
        onSave={save}
      />
    </section>
  );
};

export default DocumentEditor;
