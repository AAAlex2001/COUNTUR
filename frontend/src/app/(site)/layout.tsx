import { CartProvider } from "@/entities/cart";
import { FavoritesProvider } from "@/entities/favorite";
import { UserProvider } from "@/entities/user";
import { AuthModal } from "@/features/auth";
import Footer from "@/widgets/footer";
import Header from "@/widgets/header";

/** Общая оболочка страниц сайта: шапка, подвал, аккаунт покупателя, его корзина и избранное. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <FavoritesProvider>
          <Header />
          {children}
          <Footer />
          <AuthModal />
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
  );
}
