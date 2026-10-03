import { CartProvider, EMPTY_CART, getCart } from "@/entities/cart";
import { FavoritesProvider, getFavoriteIds } from "@/entities/favorite";
import { UserProvider } from "@/entities/user";
import { getSessionUser, sessionHeaders } from "@/entities/user/server";
import { AuthModal } from "@/features/auth";
import Footer from "@/widgets/footer";
import Header from "@/widgets/header";

/** Общая оболочка страниц сайта. Покупатель, корзина и избранное читаются по cookie ещё на сервере. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const headers = await sessionHeaders();

  const [user, cart, favoriteIds] = headers
    ? await Promise.all([getSessionUser(headers), getCart(headers), getFavoriteIds(headers)])
    : [null, EMPTY_CART, []];

  return (
    <UserProvider initialUser={user}>
      <CartProvider initialCart={cart}>
        <FavoritesProvider initialIds={favoriteIds}>
          <Header />
          {children}
          <Footer />
          <AuthModal />
        </FavoritesProvider>
      </CartProvider>
    </UserProvider>
  );
}
