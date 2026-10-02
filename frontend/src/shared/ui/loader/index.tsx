import cn from "classnames";
import styles from "./style.module.scss";

type LoaderProps = {
  size?: "sm" | "lg";
  className?: string;
};

/** Индикатор загрузки: sm встаёт в кнопку и берёт её цвет, lg — отдельный блок по центру. */
const Loader = ({ size = "sm", className }: LoaderProps) => (
  <span
    className={cn(styles.loader, styles[size], className)}
    role="status"
    aria-label="Загрузка"
  />
);

export default Loader;
