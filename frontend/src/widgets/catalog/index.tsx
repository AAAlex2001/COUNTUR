import cn from "classnames";
import {
  CATALOG_PAGE_SIZE,
  CATALOG_PATH,
  ProductCard,
  type CatalogFilters,
  type CatalogView,
  type Category,
  type ProductList,
} from "@/entities/product";
import { AddToCartButton } from "@/features/add-to-cart";
import { CatalogPagination, Filters, SortSelect, ViewToggle } from "@/features/catalog-filter";
import { plural } from "@/shared/lib/text";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Button from "@/shared/ui/button";
import styles from "./style.module.scss";

type CatalogProps = {
  list: ProductList;
  categories: Category[];
  filters: CatalogFilters;
  view: CatalogView;
  search: string;
};

/** Страница каталога: заголовок с сортировкой, фильтры и список товаров. */
const Catalog = ({ list, categories, filters, view, search }: CatalogProps) => (
  <section className={styles.catalog}>
    <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />

    <div className={styles.header}>
      <div className={styles.titles}>
        <h1 className={styles.title}>Каталог комплектующих</h1>
        <p className={styles.subtitle}>Всё необходимое для производительной сборки</p>
      </div>

      <div className={styles.sort}>
        <span className={styles.sortLabel}>Сортировка</span>
        <SortSelect />
      </div>
    </div>

    <hr className={styles.divider} />

    <div className={styles.body}>
      <Filters className={styles.filters} categories={categories} filters={filters} />

      <div className={styles.results}>
        <div className={styles.toolbar}>
          <p className={styles.found}>
            Найдено: {list.total} {plural(list.total, ["товар", "товара", "товаров"])}
            {search && ` по запросу «${search}»`}
          </p>
          <ViewToggle view={view} />
        </div>

        {list.total === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Под выбранные условия ничего не нашлось. Попробуйте изменить фильтры.
            </p>
            <Button href={CATALOG_PATH}>Сбросить фильтры</Button>
          </div>
        )}

        <ul className={cn(styles.grid, view === "list" && styles.list)}>
          {list.products.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                view={view}
                action={
                  <AddToCartButton
                    productId={product.id}
                    productName={product.name}
                    available={product.availability === "in_stock"}
                  />
                }
              />
            </li>
          ))}
        </ul>

        <CatalogPagination
          className={styles.pagination}
          pages={Math.ceil(list.total / CATALOG_PAGE_SIZE)}
        />
      </div>
    </div>
  </section>
);

export default Catalog;
