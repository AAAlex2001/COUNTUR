import { CONTACTS_PATH, SUPPORT_EMAIL } from "@/shared/config/site";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, InfoIcon } from "@/shared/ui/icons";
import RequisitesCard from "@/shared/ui/requisites-card";
import type { LegalDocument } from "./model/types";
import Section from "./ui/section";
import Toc from "./ui/toc";
import styles from "./style.module.scss";

export type { LegalDocument } from "./model/types";

type LegalDocumentPageProps = {
  document: LegalDocument;
};

/** Страница документа: шапка с редакцией, оглавление и помощь слева, текст и реквизиты справа. */
const LegalDocumentPage = ({ document }: LegalDocumentPageProps) => (
  <section className={styles.page}>
    <div className={styles.intro}>
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Документы" }, { label: document.title }]}
      />

      <div className={styles.heading}>
        <p className={styles.eyebrow}>{document.eyebrow}</p>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.description}>{document.description}</p>
      </div>

      <p className={styles.revision}>
        Дата редакции
        <span className={styles.date}>{document.revision}</span>
      </p>
    </div>

    <hr className={styles.divider} />

    <div className={styles.columns}>
      <aside className={styles.sidebar}>
        <Toc sections={document.sections} />

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
        <div className={styles.notice}>
          <InfoIcon className={styles.noticeIcon} />
          <div className={styles.noticeTexts}>
            <p className={styles.noticeTitle}>{document.notice.title}</p>
            <p className={styles.noticeText}>{document.notice.text}</p>
          </div>
        </div>

        <div className={styles.sections}>
          {document.sections.map((section, index) => (
            <Section key={section.id} section={section} number={index + 1} />
          ))}
        </div>

        {document.statement && (
          <div className={styles.statement}>
            <p className={styles.statementLabel}>{document.statement.label}</p>
            <p className={styles.statementText}>{document.statement.text}</p>
            <p className={styles.statementNote}>{document.statement.note}</p>
          </div>
        )}

        <RequisitesCard
          title={document.requisites.title}
          items={document.requisites.items}
          note={document.requisites.note}
        />

        <div className={styles.end}>
          <span className={styles.status}>{document.status}</span>
          <a className={styles.up} href="#top">
            К началу документа
            <ArrowRightIcon className={styles.upIcon} />
          </a>
        </div>
      </article>
    </div>
  </section>
);

export default LegalDocumentPage;
