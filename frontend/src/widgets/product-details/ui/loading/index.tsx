import { CATALOG_PATH } from "@/entities/product";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Loader from "@/shared/ui/loader";
import styles from "../../style.module.scss";

/** Страница товара, пока сервер её собирает: хлебные крошки на месте, вместо товара лоадер. */
const ProductLoading = () => (
  <section className={styles.details}>
    <Breadcrumbs
      items={[
        { label: "Главная", href: "/" },
        { label: "Каталог", href: CATALOG_PATH },
      ]}
    />
    <Loader size="lg" />
  </section>
);

export default ProductLoading;
