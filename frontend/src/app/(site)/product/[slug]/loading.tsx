import ProductLoading from "@/widgets/product-details/ui/loading";

/** Показывается, пока сервер собирает страницу товара. */
export default function Loading() {
  return (
    <main>
      <ProductLoading />
    </main>
  );
}
