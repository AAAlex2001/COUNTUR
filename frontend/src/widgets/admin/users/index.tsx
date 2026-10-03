"use client";

import { UsersTable, useUsersList } from "@/features/users-admin";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import styles from "./style.module.scss";

/** Страница админки с покупателями: поиск и список. */
const AdminUsers = () => {
  const { state, pages, changeSearch, submitSearch, openPage } = useUsersList();
  const { list } = state;

  return (
    <section className={styles.users}>
      <h1 className={styles.title}>Покупатели</h1>

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
          placeholder="Имя, фамилия или email"
          ariaLabel="Поиск покупателя"
          maxLength={100}
          icon={<SearchIcon />}
          value={state.search}
          onChange={changeSearch}
        />
        <Button type="submit" variant="outline">
          Найти
        </Button>
      </form>

      {state.failed && <p className={styles.error}>Не удалось загрузить покупателей.</p>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea className={styles.results} loading={state.loading}>
          <p className={styles.found}>
            {list.total} {plural(list.total, ["покупатель", "покупателя", "покупателей"])}
          </p>

          <UsersTable users={list.users} />

          <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={openPage} />
        </LoadingArea>
      )}
    </section>
  );
};

export default AdminUsers;
