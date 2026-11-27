import { EMPTY_CART, getCart } from "@/entities/cart";
import { getContacts } from "@/entities/contacts";
import { getFavorites } from "@/entities/favorite";
import { UserProvider } from "@/entities/user";
import { getSessionUser, sessionHeaders } from "@/entities/user/server";
import { AuthModal } from "@/features/auth";
import Footer from "@/widgets/footer";
import Header from "@/widgets/header";
import { CustomerProviders } from "./customer-providers";

/** Открыть витрину магазина. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const headers = await sessionHeaders();

  const [contacts, user, cart, favorites] = await Promise.all([
    getContacts(),
    headers ? getSessionUser(headers) : null,
    headers ? getCart(headers) : EMPTY_CART,
    headers ? getFavorites(headers) : [],
  ]);

  return (
    <UserProvider initialUser={user}>
      <CustomerProviders cart={cart} favorites={favorites}>
        <Header />
        {children}
        <Footer email={contacts?.email} />
        <AuthModal />
      </CustomerProviders>
    </UserProvider>
  );
}
