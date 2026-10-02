import Image from "next/image";
import type { Promotion as PromotionData } from "@/entities/landing";
import Button from "@/shared/ui/button";
import styles from "./style.module.scss";

type PromotionProps = {
  promotion: PromotionData;
};

/** Рекламный блок главной. Тексты, кнопку и картинку задают в админке. */
const Promotion = ({ promotion }: PromotionProps) => (
  <section className={styles.wrap}>
    <div className={styles.promotion}>
      <div className={styles.copy}>
        {promotion.label && <p className={styles.label}>{promotion.label}</p>}
        <h2 className={styles.title}>{promotion.title}</h2>
        {promotion.text && <p className={styles.text}>{promotion.text}</p>}

        {promotion.button_label && promotion.button_url && (
          <Button href={promotion.button_url}>{promotion.button_label}</Button>
        )}
      </div>

      {promotion.image_url && (
        <div className={styles.media}>
          <Image
            src={promotion.image_url}
            alt=""
            fill
            sizes="(min-width: 1440px) 520px, 100vw"
            unoptimized
            className={styles.image}
          />
        </div>
      )}
    </div>
  </section>
);

export default Promotion;
