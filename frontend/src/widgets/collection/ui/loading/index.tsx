import { COLLECTIONS_PATH } from "@/entities/collection";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Loader from "@/shared/ui/loader";
import styles from "../../style.module.scss";

/** Страница подборки, пока сервер её собирает: хлебные крошки на месте, вместо товаров лоадер. */
const CollectionLoading = () => (
  <section className={styles.collection}>
    <Breadcrumbs
      items={[
        { label: "Главная", href: "/" },
        { label: "Готовые подборки", href: COLLECTIONS_PATH },
      ]}
    />
    <Loader size="lg" />
  </section>
);

export default CollectionLoading;
