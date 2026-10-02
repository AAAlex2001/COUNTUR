import Button from "@/shared/ui/button";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Страница не найдена</h1>
      <p className={styles.text}>
        Возможно, товар сняли с продажи или адрес введён с ошибкой.
      </p>
      <Button href="/">На главную</Button>
    </main>
  );
}
