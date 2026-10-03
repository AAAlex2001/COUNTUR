import { AccountButton } from "@/features/auth";
import { SearchForm } from "@/features/product-search";
import { HeartIcon } from "@/shared/ui/icons";
import Logo from "@/shared/ui/logo";
import { ANNOUNCEMENT, HEADER_NAV } from "./data";
import CartLink from "./ui/cart-link";
import HeaderMenu from "./ui/menu";
import NavLink from "./ui/nav-link";
import styles from "./style.module.scss";

/** Шапка сайта. На ПК — разделы, кабинет и избранное в ряд; на узком экране они в бургер-меню. */
const Header = () => (
  <>
    <div className={styles.announcement}>
      <p className={styles.announcementText}>{ANNOUNCEMENT}</p>
    </div>

    <header className={styles.header}>
      <div className={styles.main}>
        <Logo href="/" ariaLabel="COUNTUR — на главную" />

        <nav className={styles.nav} aria-label="Основная навигация">
          {HEADER_NAV.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <SearchForm className={styles.search} />

        <div className={styles.actions}>
          <AccountButton className={styles.desktop} />

          <NavLink className={styles.favorites} href="/favorites" ariaLabel="Избранное">
            <HeartIcon className={styles.icon} />
          </NavLink>

          <CartLink />

          <HeaderMenu className={styles.burger} />
        </div>
      </div>
    </header>
  </>
);

export default Header;
