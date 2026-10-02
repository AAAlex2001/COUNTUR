import {
  CATALOG_PATH,
  Rating,
  StockStatus,
  categoryPath,
  type Product,
  type ReviewList,
} from "@/entities/product";
import Badge from "@/shared/ui/badge";
import Breadcrumbs from "@/shared/ui/breadcrumbs";
import Chip from "@/shared/ui/chip";
import Gallery from "./ui/gallery";
import ProductTabs from "./ui/product-tabs";
import Purchase from "./ui/purchase";
import styles from "./style.module.scss";

type ProductDetailsProps = {
  product: Product;
  reviews: ReviewList;
};

/** Страница товара: галерея, описание с ценой и вкладки с характеристиками и отзывами. */
const ProductDetails = ({ product, reviews }: ProductDetailsProps) => (
  <section className={styles.details}>
    <Breadcrumbs
      items={[
        { label: "Главная", href: "/" },
        { label: "Каталог", href: CATALOG_PATH },
        { label: product.category.name, href: categoryPath(product.category.slug) },
        { label: product.name },
      ]}
    />

    <div className={styles.hero}>
      <Gallery name={product.name} images={product.images} />

      <div className={styles.info}>
        <div className={styles.meta}>
          {product.brand && <span className={styles.brand}>{product.brand.name}</span>}
          {product.is_hit && <Badge>Хит</Badge>}
          {product.sku && <span className={styles.sku}>Арт. {product.sku}</span>}
        </div>

        <h1 className={styles.name}>{product.name}</h1>

        <div className={styles.ratingRow}>
          <Rating rating={product.rating} reviewsCount={product.reviews_count} />
          <StockStatus availability={product.availability} />
        </div>

        {product.short_description && (
          <p className={styles.description}>{product.short_description}</p>
        )}

        <div className={styles.chips}>
          {product.highlights.map((highlight) => (
            <Chip key={highlight}>{highlight}</Chip>
          ))}
        </div>

        <hr className={styles.divider} />

        <Purchase product={product} />
      </div>
    </div>

    <ProductTabs
      slug={product.slug}
      specs={product.specs}
      description={product.description}
      reviews={reviews}
    />
  </section>
);

export default ProductDetails;
