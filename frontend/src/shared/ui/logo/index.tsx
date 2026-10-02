import cn from "classnames";
import Link from "next/link";
import styles from "./style.module.scss";

type LogoProps = {
  href: string;
  ariaLabel: string;
  caption?: string;
};

/** Логотип COUNTUR со ссылкой. Без подписи caption на узком экране остаётся только значок. */
const Logo = ({ href, ariaLabel, caption }: LogoProps) => (
  <Link
    className={cn(styles.logo, caption && styles.captioned)}
    href={href}
    aria-label={ariaLabel}
  >
    <span className={styles.mark} aria-hidden="true">
      C
    </span>

    <span className={styles.texts}>
      <span className={styles.brand}>COUNTUR</span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </span>
  </Link>
);

export default Logo;
