import Image from "next/image";
import type { HeroContent } from "@/entities/landing";
import { CATALOG_PATH } from "@/entities/product";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, WrenchIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type HeroProps = {
  imageUrl: string | null;
  content: HeroContent;
};

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

          {hasActions && (
            <div className={styles.actions}>
              {content.catalog_button_label && (
                <Button className={styles.action} href={CATALOG_PATH}>
                  <ArrowRightIcon className={styles.icon} />
                  {content.catalog_button_label}
                </Button>
              )}
              {content.support_button_label && (
                <Button className={styles.action} variant="outline" href={TELEGRAM_SUPPORT_URL} newTab>
                  <WrenchIcon className={styles.icon} />
                  {content.support_button_label}
                </Button>
              )}
            </div>
          )}

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
        <div className={styles.media}>
          <Image
            src={imageUrl}
            alt={content.image_alt}
            fill
            sizes="(min-width: 1440px) 574px, 100vw"
            unoptimized
            loading="eager"
            className={styles.image}
          />
          {content.image_badge && (
            <p className={styles.tag}>
              <span className={styles.dot} aria-hidden="true" />
              {content.image_badge}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default Hero;
