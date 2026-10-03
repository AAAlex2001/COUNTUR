import Loader from "@/shared/ui/loader";
import CatalogHeading from "../heading";
import styles from "../../style.module.scss";

/** Каталог, пока сервер собирает выдачу: шапка страницы на месте, вместо товаров лоадер. */
const CatalogLoading = () => (
  <section className={styles.catalog}>
    <CatalogHeading />
    <Loader size="lg" />
  </section>
);

export default CatalogLoading;
