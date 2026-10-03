"use client";

import Image from "next/image";
import type { ProductCardData } from "@/entities/product";
import { formatRub } from "@/shared/lib/money";
import { SearchIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import { useProductPicker } from "../../model/use-product-picker";
import styles from "./style.module.scss";

type ProductPickerProps = {
  chosenIds: number[];
  onPick: (product: ProductCardData) => void;
};

/** Поиск товара для подборки: найденные выпадают под полем, клик добавляет в состав. */
const ProductPicker = ({ chosenIds, onPick }: ProductPickerProps) => {
  const { state, visible, change, pick } = useProductPicker(onPick);
  const results = state.results.filter((product) => !chosenIds.includes(product.id));

  return (
    <div className={styles.picker}>
      <Input
        type="search"
        placeholder="Название или артикул товара"
        ariaLabel="Поиск товара для подборки"
        maxLength={100}
        autoComplete="off"
        icon={<SearchIcon />}
        suffix={state.loading && <Loader className={styles.loader} />}
        value={state.query}
        onChange={change}
      />

      {visible && !state.loading && (
        <ul className={styles.menu}>
          {results.length === 0 && <li className={styles.empty}>Ничего не нашлось.</li>}

          {results.map((product) => (
            <li key={product.id}>
              <button type="button" className={styles.item} onClick={() => pick(product)}>
                <span className={styles.image}>
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      sizes="40px"
                      unoptimized
                      className={styles.photo}
                    />
                  )}
                </span>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.price}>{formatRub(product.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductPicker;
