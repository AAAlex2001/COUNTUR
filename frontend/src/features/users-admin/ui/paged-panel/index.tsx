import type { ReactNode } from "react";
import { plural } from "@/shared/lib/text";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import Panel from "@/shared/ui/panel";
import type { PagedState } from "../../model/types";
import styles from "./style.module.scss";

type PagedPanelProps<T> = {
  title: string;
  unit: [string, string, string];
  empty: string;
  state: PagedState<T>;
  pages: number;
  onPage: (page: number) => void;
  children: ReactNode;
};

/** Панель со списком покупателя: счётчик в заголовке, пустое состояние, лоадер и листание. Дети — строки `<li>`. */
const PagedPanel = <T,>({ title, unit, empty, state, pages, onPage, children }: PagedPanelProps<T>) => (
  <Panel
    title={title}
    action={
      state.total > 0 && (
        <span className={styles.total}>
          {state.total} {plural(state.total, unit)}
        </span>
      )
    }
  >
    {state.failed && <p className={styles.error}>Не удалось загрузить данные.</p>}

    {!state.loading && !state.failed && state.total === 0 && (
      <p className={styles.empty}>{empty}</p>
    )}

    <LoadingArea className={styles.body} loading={state.loading}>
      {state.items.length > 0 && <ul className={styles.list}>{children}</ul>}

      <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={onPage} />
    </LoadingArea>
  </Panel>
);

export default PagedPanel;
