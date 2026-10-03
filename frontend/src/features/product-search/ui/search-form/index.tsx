"use client";

import cn from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { productPath } from "@/entities/product";
import { formatRub } from "@/shared/lib/money";
import { useClickOutside } from "@/shared/lib/use-click-outside";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import { useProductSearch } from "../../model/use-product-search";
import styles from "./style.module.scss";

type SearchFormProps = {
  className?: string;
};

/** Поиск в шапке: под полем выпадают найденные товары, Enter открывает первый из них. */
const SearchForm = ({ className }: SearchFormProps) => {
  const { state, visible, change, open, close, submit } = useProductSearch();
  const rootRef = useRef<HTMLFormElement>(null);

  useClickOutside(rootRef, close);

  return (
    <form
      ref={rootRef}
      className={cn(styles.form, className)}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      onFocus={open}
      onKeyDown={(event) => event.key === "Escape" && close()}
    >
      <Input
        className={styles.field}
        type="search"
        placeholder="Поиск комплектующих…"
        ariaLabel="Поиск по каталогу"
        maxLength={100}
        autoComplete="off"
        icon={<SearchIcon />}
        suffix={state.loading && <Loader className={styles.loader} />}
        value={state.query}
        onChange={change}
      />

      {visible && (
        <div className={styles.menu}>
          {!state.loading && state.products.length === 0 && (
            <p className={styles.empty}>Ничего не нашлось. Попробуйте другое название.</p>
          )}

          <ul className={styles.list}>
            {state.products.map((product) => (
              <li key={product.id}>
                <Link className={styles.item} href={productPath(product.slug)} onClick={close}>
                  <span className={styles.image}>
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt=""
                        fill
                        sizes="44px"
                        unoptimized
                        className={styles.photo}
                      />
                    )}
                  </span>

                  <span className={styles.info}>
                    <span className={styles.name}>{product.name}</span>
                    <span className={styles.category}>{product.category.name}</span>
                  </span>

                  <span className={styles.price}>{formatRub(product.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
