import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductReviews, productPath } from "@/entities/product";
import { absoluteUrl } from "@/shared/config/site";
import JsonLd from "@/shared/ui/json-ld";
import ProductDetails from "@/widgets/product-details";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

/** Заголовок, описание, canonical и OG-карточка с фото из данных товара. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Товар не найден", robots: { index: false } };

  const description =
    product.short_description ??
    `${product.name} — купить в COUNTUR. ${product.highlights.join(", ")}.`;

  return {
    title: product.name,
    description,
    alternates: { canonical: productPath(product.slug) },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: productPath(product.slug),
      images: product.image_url ? [{ url: absoluteUrl(product.image_url), alt: product.name }] : [],
    },
  };
}

/** Страница товара. Если товара нет или он не опубликован — 404. */
export default async function ProductRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const reviews = await getProductReviews(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    description: product.short_description ?? undefined,
    image: product.images.map((image) => absoluteUrl(image.url)),
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(productPath(product.slug)),
      price: product.price,
      priceCurrency: "RUB",
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : product.availability === "expected"
            ? "https://schema.org/PreOrder"
            : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.rating && product.reviews_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviews_count,
          }
        : undefined,
  };

  return (
    <main>
      <JsonLd data={jsonLd} />
      <ProductDetails product={product} reviews={reviews} />
    </main>
  );
}
