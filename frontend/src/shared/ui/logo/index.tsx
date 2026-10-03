import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import styles from "./style.module.scss";

type LogoProps = {
  href: string;
  ariaLabel: string;
  caption?: string;
  full?: boolean;
};

/** Логотип COUNTUR со ссылкой. На узком экране остаётся только значок, если нет caption или full. */
const Logo = ({ href, ariaLabel, caption, full }: LogoProps) => (
  <Link
    className={cn(styles.logo, caption && styles.captioned, full && styles.full)}
    href={href}
    aria-label={ariaLabel}
  >
    <Image className={styles.mark} src="/logo.svg" alt="" width={34} height={34} unoptimized />

    <span className={styles.texts}>
      <span className={styles.brand}>COUNTUR</span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </span>
  </Link>
);

export default Logo;
