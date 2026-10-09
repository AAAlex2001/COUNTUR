import Link from "next/link";
import { CONTACTS_PATH, SUPPORT_EMAIL } from "@/shared/config/site";
import { formatShortDate } from "@/shared/lib/date";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import { ArrowRightIcon, InfoIcon } from "@/shared/ui/icons";
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
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: document.title }]} />

      <div className={styles.heading}>
        <p className={styles.eyebrow}>{document.eyebrow}</p>
        <h1 className={styles.title}>{document.title}</h1>
        <p className={styles.description}>{document.description}</p>
      </div>

      <p className={styles.revision}>
        Редакция
        <span className={styles.date}>{formatShortDate(document.revision)}</span>
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
          <Link className={styles.helpLink} href={CONTACTS_PATH}>
            Контакты
            <ArrowRightIcon />
          </Link>
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

        <dl className={styles.requisites}>
          <p className={styles.requisitesTitle}>{document.requisites.title}</p>

          {document.requisites.items.map((item) => (
            <div className={styles.requisite} key={item.label}>
              <dt className={styles.requisiteLabel}>{item.label}</dt>
              <dd className={styles.requisiteValue}>
                {item.href ? (
                  <a className={styles.requisiteLink} href={item.href}>
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}

          <p className={styles.requisitesNote}>{document.requisites.note}</p>
        </dl>

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
