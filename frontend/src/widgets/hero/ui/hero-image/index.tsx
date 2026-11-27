import Image from "next/image";
import styles from "../../style.module.scss";

type HeroImageProps = {
  url: string;
  alt: string;
  badge: string;
};

/** Выводит изображение первого экрана и заданную в админке подпись. */
export default function HeroImage({ url, alt, badge }: HeroImageProps) {
  return (
    <div className={styles.media}>
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(min-width: 1440px) 574px, 100vw"
        unoptimized
        loading="eager"
        className={styles.image}
      />
      {badge && (
        <p className={styles.tag}>
          <span className={styles.dot} aria-hidden="true" />
          {badge}
        </p>
      )}
    </div>
  );
}
