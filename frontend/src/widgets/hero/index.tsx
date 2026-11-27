import type { HeroContent } from "@/entities/landing";
import HeroActions from "./ui/hero-actions";
import HeroImage from "./ui/hero-image";
import styles from "./style.module.scss";

type HeroProps = {
  imageUrl: string | null;
  content: HeroContent;
};

/** Показывает опубликованные тексты, показатели и изображение первого экрана. */
const Hero = ({ imageUrl, content }: HeroProps) => {
  const hasActions = Boolean(content.catalog_button_label || content.support_button_label);
  const hasText = Boolean(content.overline || content.title || content.description);
  const hasStatistics = content.statistics.length > 0;
  const hasCopy = hasText || hasActions || hasStatistics;

  if (!content.is_visible || (!hasCopy && !imageUrl)) return null;

  return (
    <section className={styles.hero}>
      {hasCopy && (
        <div className={styles.copy}>
          {content.overline && <p className={styles.overline}>{content.overline}</p>}
          {content.title && <h1 className={styles.title}>{content.title}</h1>}
          {content.description && <p className={styles.description}>{content.description}</p>}

          <HeroActions
            catalogLabel={content.catalog_button_label}
            supportLabel={content.support_button_label}
          />

          {hasStatistics && (
            <ul className={styles.stats}>
              {content.statistics.map(({ value, label }, index) => (
                <li className={styles.stat} key={index}>
                  {value && <span className={styles.value}>{value}</span>}
                  {label && <span className={styles.label}>{label}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {imageUrl && (
        <HeroImage url={imageUrl} alt={content.image_alt} badge={content.image_badge} />
      )}
    </section>
  );
};

export default Hero;
