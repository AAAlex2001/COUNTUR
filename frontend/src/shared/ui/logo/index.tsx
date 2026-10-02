import Link from "next/link";
import styles from "./style.module.scss";

type LogoProps = {
  href: string;
  ariaLabel: string;
};

/** Логотип COUNTUR со ссылкой. На узком экране остаётся только значок. */
const Logo = ({ href, ariaLabel }: LogoProps) => (
  <Link className={styles.logo} href={href} aria-label={ariaLabel}>
    <span className={styles.mark} aria-hidden="true">
      C
    </span>
    <span className={styles.brand}>COUNTUR</span>
  </Link>
);

export default Logo;
