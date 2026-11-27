import type { Metadata } from "next";
import Favorites from "@/widgets/favorites";
import ProductCardActions from "@/widgets/product-card-actions";

export const metadata: Metadata = {
  title: "Избранное",
  robots: { index: false, follow: false },
};

export default function FavoritesRoute() {
  return (
    <main>
      <Favorites actions={ProductCardActions} />
    </main>
  );
}
