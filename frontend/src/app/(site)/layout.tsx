import { CartProvider } from "@/entities/cart";
import { FavoritesProvider } from "@/entities/favorite";
import Footer from "@/widgets/footer";
import Header from "@/widgets/header";

/** Общая оболочка страниц сайта: шапка, подвал, корзина и избранное посетителя. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <FavoritesProvider>
        <Header />
        {children}
        <Footer />
      </FavoritesProvider>
    </CartProvider>
  );
}
