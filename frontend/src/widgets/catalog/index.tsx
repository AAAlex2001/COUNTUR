import cn from "classnames";
import type { Collection } from "@/entities/collection";
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
  SearchFilter,
  SortSelect,
  ViewToggle,
} from "@/features/catalog-filter";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import CatalogCollections from "./ui/collections";
import CatalogHeading from "./ui/heading";
import styles from "./style.module.scss";

type CatalogProps = {
  list: ProductList;
  categories: Category[];
  filters: CatalogFilters;
  collections: Collection[];
  view: CatalogView;
  search: string;
};

/** Страница каталога: заголовок с сортировкой, фильтры, подборки и список товаров. */
const Catalog = ({ list, categories, filters, collections, view, search }: CatalogProps) => (
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
          {collections.length > 0 && <CatalogCollections collections={collections} />}

          <div className={styles.toolbar}>
            <SearchFilter className={styles.search} />
            <ViewToggle view={view} />
          </div>

          <p className={styles.found}>
            Найдено: {list.total} {plural(list.total, ["товар", "товара", "товаров"])}
            {search && ` по запросу «${search}»`}
          </p>

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
