import Link from "next/link";
import { SearchForm } from "@/features/product-search";
import { HeartIcon } from "@/shared/ui/icons";
import { ANNOUNCEMENT, HEADER_NAV } from "./data";
import CartLink from "./ui/cart-link";
import styles from "./style.module.scss";

/** Шапка сайта. Объявление уезжает при прокрутке, сама шапка прилипает к верху. */
const Header = () => (
  <>
    <div className={styles.announcement}>
      <p className={styles.announcementText}>{ANNOUNCEMENT}</p>
    </div>

    <header className={styles.header}>
      <div className={styles.main}>
        <Link className={styles.logo} href="/" aria-label="COUNTUR — на главную">
          <span className={styles.logoMark} aria-hidden="true">
            C
          </span>
          <span className={styles.brand}>COUNTUR</span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          {HEADER_NAV.map((item) => (
            <Link key={item.href} className={styles.navLink} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <SearchForm className={styles.search} />

        <div className={styles.actions}>
          <Link className={styles.favorites} href="/favorites" aria-label="Избранное">
            <HeartIcon className={styles.favoritesIcon} />
          </Link>

          <CartLink />
        </div>
      </div>
    </header>
  </>
);

export default Header;
