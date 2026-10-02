import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProductReviews } from "@/entities/product";
import ProductDetails from "@/widgets/product-details";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

/** Заголовок и описание страницы из данных товара. */
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Товар не найден" };

  return {
    title: product.name,
    description: product.short_description ?? undefined,
  };
}

/** Страница товара. Если товара нет или он не опубликован — 404. */
export default async function ProductRoute({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const reviews = await getProductReviews(slug);

  return (
    <main>
      <ProductDetails product={product} reviews={reviews} />
    </main>
  );
}
