"use client";

import { FEEDBACK_FILTERS, MessagesTable, useFeedbackList } from "@/features/feedback-admin";
import { plural } from "@/shared/lib/text";
import Loader from "@/shared/ui/loader";
import LoadingArea from "@/shared/ui/loading-area";
import Pagination from "@/shared/ui/pagination";
import Segmented from "@/shared/ui/segmented";
import styles from "./style.module.scss";

/** Страница админки с обращениями: фильтр по статусу и список. */
const AdminFeedback = () => {
  const { state, pages, changeFilter, openPage } = useFeedbackList();
  const { list } = state;

  return (
    <section className={styles.feedback}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обращения</h1>
        <Segmented
          value={state.filter}
          options={FEEDBACK_FILTERS}
          onChange={(value) => changeFilter(value as typeof state.filter)}
        />
      </div>

      {state.failed && <p className={styles.error}>Не удалось загрузить обращения.</p>}

      {!list && state.loading && <Loader size="lg" />}

      {list && (
        <LoadingArea className={styles.results} loading={state.loading}>
          <p className={styles.found}>
            {list.total} {plural(list.total, ["обращение", "обращения", "обращений"])}
          </p>

          {list.total === 0 && <p className={styles.empty}>Здесь пусто.</p>}

          <MessagesTable messages={list.messages} />

          <Pagination page={state.page} pages={pages} disabled={state.loading} onChange={openPage} />
        </LoadingArea>
      )}
    </section>
  );
};

export default AdminFeedback;
