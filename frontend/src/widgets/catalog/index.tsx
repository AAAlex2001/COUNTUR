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
import { FavoriteButton } from "@/features/toggle-favorite";
import {
  CatalogPagination,
  CatalogParamsProvider,
  CatalogResults,
  Filters,
  SortSelect,
  ViewToggle,
} from "@/features/catalog-filter";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import CatalogHeading from "./ui/heading";
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
  <CatalogParamsProvider>
    <section className={styles.catalog}>
      <CatalogHeading>
        <div className={styles.sort}>
          <span className={styles.sortLabel}>Сортировка</span>
          <SortSelect />
        </div>
      </CatalogHeading>

      <div className={styles.body}>
        <Filters className={styles.filters} categories={categories} filters={filters} />

        <CatalogResults className={styles.results}>
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
                    <div className={styles.actions}>
                      <FavoriteButton productId={product.id} size="md" />
                      <AddToCartButton
                        productId={product.id}
                        productName={product.name}
                        available={product.availability === "in_stock"}
                      />
                    </div>
                  }
                />
              </li>
            ))}
          </ul>

          <CatalogPagination
            className={styles.pagination}
            pages={Math.ceil(list.total / CATALOG_PAGE_SIZE)}
          />
        </CatalogResults>
      </div>
    </section>
  </CatalogParamsProvider>
);

export default Catalog;
