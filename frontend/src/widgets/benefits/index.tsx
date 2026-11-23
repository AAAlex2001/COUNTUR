import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import { BENEFITS } from "./data";
import styles from "./style.module.scss";

/** Полоса преимуществ магазина внизу главной, вплотную к подвалу. */
const Benefits = () => (
  <section className={styles.benefits}>
    <ul className={styles.list}>
      {BENEFITS.map(({ Icon, title, text, linkToSupport }) => (
        <li className={styles.benefit} key={title}>
          <Icon className={styles.icon} />

          <div className={styles.texts}>
            <h3 className={styles.title}>
              {linkToSupport ? (
                <a href={TELEGRAM_SUPPORT_URL} target="_blank" rel="noopener noreferrer">{title}</a>
              ) : title}
            </h3>
            <p className={styles.text}>{text}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

export default Benefits;
