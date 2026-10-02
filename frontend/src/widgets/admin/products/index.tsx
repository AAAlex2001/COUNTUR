"use client";

import { ProductsTable, useProductsList } from "@/features/products-admin";
import { ADMIN_NEW_PRODUCT_PATH } from "@/shared/lib/admin-paths";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import styles from "./style.module.scss";

/** Страница админки со всеми товарами: поиск, список и кнопка добавления. */
const AdminProducts = () => {
  const { state, pages, changeSearch, submitSearch, openPage } = useProductsList();
  const { list } = state;

  return (
    <section className={styles.products}>
      <div className={styles.header}>
        <h1 className={styles.title}>Товары</h1>
        <Button href={ADMIN_NEW_PRODUCT_PATH}>Добавить товар</Button>
      </div>

      <form
        className={styles.search}
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
      >
        <Input
          className={styles.field}
          type="search"
          size="lg"
          placeholder="Название или артикул"
          ariaLabel="Поиск товара"
          maxLength={100}
          icon={<SearchIcon />}
          value={state.search}
          onChange={changeSearch}
        />
        <Button type="submit" variant="outline">
          Найти
        </Button>
      </form>

      {state.failed && <p className={styles.error}>Не удалось загрузить товары.</p>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea className={styles.results} loading={state.loading}>
          <p className={styles.found}>
            {list.total} {plural(list.total, ["товар", "товара", "товаров"])}
          </p>

          <ProductsTable products={list.products} />

          <Pagination
            page={state.page}
            pages={pages}
            disabled={state.loading}
            onChange={openPage}
          />
        </LoadingArea>
      )}
    </section>
  );
};

export default AdminProducts;
