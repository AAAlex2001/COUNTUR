import type { Metadata } from "next";
import { documentPath, getDocument, type LegalDocument } from "@/entities/document";
import {
  COMPANY_REQUISITES,
  COMPANY_REQUISITES_NOTE,
  CONTACTS_PATH,
  SUPPORT_EMAIL,
} from "@/shared/config/site";
import { formatShortDate } from "@/shared/lib/date";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import RequisitesCard from "@/shared/ui/requisites-card";
import RichContent from "@/shared/ui/rich-content";
import { withHeadings } from "./lib/headings";
import Toc from "./ui/toc";
import styles from "./style.module.scss";

/** Заголовок, описание и canonical страницы документа из базы. */
export const documentMetadata = async (slug: string): Promise<Metadata> => {
  const document = await getDocument(slug);

  if (!document) return { title: "Документ не найден", robots: { index: false } };

  return {
    title: document.title,
    description: document.description || undefined,
    alternates: { canonical: documentPath(slug) },
  };
};

type LegalDocumentPageProps = {
  document: LegalDocument;
};

/** Страница документа: шапка с датой редакции, оглавление и помощь слева, текст и реквизиты справа. */
const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => {
  const { content, headings } = withHeadings(document.content);

  return (
    <section className={styles.page}>
      <div className={styles.intro}>
        <Breadcrumbs
          items={[{ label: "Главная", href: "/" }, { label: "Документы" }, { label: document.title }]}
        />

        <div className={styles.heading}>
          <p className={styles.eyebrow}>Документы магазина</p>
          <h1 className={styles.title}>{document.title}</h1>
          {document.description && <p className={styles.description}>{document.description}</p>}
        </div>

        <p className={styles.revision}>
          Дата редакции
          <span className={styles.date}>{formatShortDate(document.updated_at)}</span>
        </p>
      </div>

      <hr className={styles.divider} />

      <div className={styles.columns}>
        <aside className={styles.sidebar}>
          {headings.length > 0 && <Toc headings={headings} />}

          <div className={styles.help}>
            <p className={styles.helpTitle}>Есть вопрос?</p>
            <p className={styles.helpText}>Уточните информацию у поддержки магазина.</p>
            <a className={styles.helpEmail} href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            <Button variant="ghost" size="sm" href={CONTACTS_PATH}>
              Контакты
              <ArrowRightIcon />
            </Button>
          </div>
        </aside>

        <article className={styles.document} id="top">
          <RichContent html={content} />

          <RequisitesCard
            title="Контакты оператора"
            items={COMPANY_REQUISITES}
            note={COMPANY_REQUISITES_NOTE}
          />

          <div className={styles.end}>
            <Button variant="ghost" size="sm" href="#top">
              К началу документа
              <ArrowRightIcon className={styles.upIcon} />
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};

export default LegalDocumentPage;
