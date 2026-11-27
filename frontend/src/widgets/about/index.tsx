import { ABOUT_INTRO, ABOUT_PARAGRAPHS, ABOUT_QUOTE } from "./data";
import styles from "./style.module.scss";

/** Показывает рассказ магазина о подборе комплектующих и поддержке покупателей. */
export default function About() {
  return (
    <article className={styles.article}>
      <h1 className={styles.title}>О Countur</h1>

      <p><strong>Countur</strong> {ABOUT_INTRO}</p>

      {ABOUT_PARAGRAPHS.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      <blockquote className={styles.quote}>{ABOUT_QUOTE}</blockquote>
    </article>
  );
}
