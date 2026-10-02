import Image from "next/image";
import { CATALOG_PATH } from "@/entities/product";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, WrenchIcon } from "@/shared/ui/icons";
import { HELP_PATH, HERO_STATS } from "./data";
import styles from "./style.module.scss";

type HeroProps = {
  imageUrl: string | null;
};

/** Первый экран главной: заголовок, кнопки, цифры магазина и картинка из админки. */
const Hero = ({ imageUrl }: HeroProps) => (
  <section className={styles.hero}>
    <div className={styles.copy}>
      <p className={styles.overline}>Комплектующие / Сборка / Поддержка</p>
      <h1 className={styles.title}>Соберите ПК мечты сегодня</h1>

      <p className={styles.description}>
        Более 5 000 комплектующих от ведущих производителей. Гарантия, быстрая доставка, помощь
        в сборке.
      </p>

      <div className={styles.actions}>
        <Button className={styles.action} href={CATALOG_PATH}>
          <ArrowRightIcon className={styles.icon} />
          Перейти в каталог
        </Button>

        <Button className={styles.action} variant="outline" href={HELP_PATH}>
          <WrenchIcon className={styles.icon} />
          Помощь в сборке
        </Button>
      </div>

      <ul className={styles.stats}>
        {HERO_STATS.map((stat) => (
          <li className={styles.stat} key={stat.label}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className={styles.media}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt="Игровой компьютер с подсветкой"
          fill
          sizes="(min-width: 1440px) 574px, 100vw"
          unoptimized
          loading="eager"
          className={styles.image}
        />
      )}

      <p className={styles.tag}>
        <span className={styles.dot} aria-hidden="true" />
        Сборка готова к игре
      </p>
    </div>
  </section>
);

export default Hero;
