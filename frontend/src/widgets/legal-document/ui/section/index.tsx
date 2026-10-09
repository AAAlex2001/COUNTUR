import type { DocumentSection } from "../../model/types";
import styles from "./style.module.scss";

type SectionProps = {
  section: DocumentSection;
  number: number;
};

/** Раздел документа: заголовок с номером, текст, при наличии подзаголовок, список и поля для заполнения. */
const Section = ({ section, number }: SectionProps) => (
  <section className={styles.section} id={section.id}>
    <h2 className={styles.title}>
      {number}. {section.title}
    </h2>

    <p className={styles.text}>{section.text}</p>

    {section.subtitle && <p className={styles.subtitle}>{section.subtitle}</p>}

    {section.items && (
      <ul className={styles.list}>
        {section.items.map((item) => (
          <li className={styles.item} key={item}>
            {item}
          </li>
        ))}
      </ul>
    )}

    {section.fields && (
      <pre className={styles.fields}>{section.fields.join("\n")}</pre>
    )}
  </section>
);

export default Section;
