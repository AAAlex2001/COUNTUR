import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS_PATH, collectionPath, type Collection } from "@/entities/collection";
import { plural } from "@/shared/lib/text";
import Button from "@/shared/ui/button";
import { ArrowRightIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

const COVER_COUNT = 3;

type CatalogCollectionsProps = {
  collections: Collection[];
};

/** Подборки над выдачей каталога: карточки с обложкой из фото товаров. На узком экране листаются свайпом. */
const CatalogCollections = ({ collections }: CatalogCollectionsProps) => (
  <div className={styles.block}>
    <div className={styles.heading}>
      <p className={styles.title}>Готовые подборки</p>
      <Button variant="ghost" size="sm" href={COLLECTIONS_PATH}>
        Все подборки
        <ArrowRightIcon />
      </Button>
    </div>

    <ul className={styles.list}>
      {collections.map((collection) => (
        <li className={styles.item} key={collection.id}>
          <Link className={styles.card} href={collectionPath(collection.slug)}>
            <span className={styles.cover}>
              {collection.products.slice(0, COVER_COUNT).map((product) => (
                <span className={styles.cell} key={product.id}>
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt=""
                      fill
                      sizes="120px"
                      unoptimized
                      className={styles.photo}
                    />
                  )}
                </span>
              ))}
            </span>

            <span className={styles.footer}>
              <span className={styles.texts}>
                <span className={styles.name}>{collection.title}</span>
                <span className={styles.count}>
                  {collection.products.length}{" "}
                  {plural(collection.products.length, ["товар", "товара", "товаров"])}
                </span>
              </span>

              <ArrowRightIcon className={styles.arrow} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default CatalogCollections;
