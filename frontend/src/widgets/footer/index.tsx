import Link from "next/link";
import Logo from "@/shared/ui/logo";
import { FOOTER_COLUMNS, FOOTER_DESCRIPTION } from "./data";
import styles from "./style.module.scss";

type FooterProps = {
  email?: string;
};

/** Подвал сайта: бренд, колонки ссылок и копирайт. */
const Footer = ({ email }: FooterProps) => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Logo href="/" ariaLabel="COUNTUR — на главную" full />
          <p className={styles.description}>{FOOTER_DESCRIPTION}</p>
          {email && <a className={styles.email} href={`mailto:${email}`}>{email}</a>}
        </div>

        <div className={styles.columns}>
          {FOOTER_COLUMNS.map((column) => (
            <nav className={styles.column} key={column.title} aria-label={column.title}>
              <p className={styles.columnTitle}>{column.title}</p>

              {column.links.map((link) => (
                <Link
                  className={styles.link}
                  key={link.label}
                  href={link.href}
                  target={link.newTab ? "_blank" : undefined}
                  rel={link.newTab ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={styles.copyright}>
        © {new Date().getFullYear()} COUNTUR. Все права защищены.
      </p>
    </div>
  </footer>
);

export default Footer;
