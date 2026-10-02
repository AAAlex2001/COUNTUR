import cn from "classnames";
import { CATALOG_PATH } from "@/entities/product";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import styles from "./style.module.scss";

type SearchFormProps = {
  className?: string;
};

/** Поиск по названию товара. Отправка формы открывает каталог с результатами. */
const SearchForm = ({ className }: SearchFormProps) => (
  <form className={cn(styles.form, className)} action={CATALOG_PATH} role="search">
    <Input
      className={styles.field}
      type="search"
      name="q"
      placeholder="Поиск комплектующих…"
      ariaLabel="Поиск по каталогу"
      maxLength={100}
      autoComplete="off"
      icon={<SearchIcon />}
    />
  </form>
);

export default SearchForm;
