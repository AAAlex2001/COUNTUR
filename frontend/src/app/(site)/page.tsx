import type { Metadata } from "next";
import { getCollections } from "@/entities/collection";
import { getHero, getPromotion } from "@/entities/landing";
import { getCategories, getFeaturedProducts } from "@/entities/product";
import Benefits from "@/widgets/benefits";
import Categories from "@/widgets/categories";
import Collections from "@/widgets/collections";
import Hero from "@/widgets/hero";
import Hits from "@/widgets/hits";
import Promotion from "@/widgets/promotion";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** Главная страница. Рекламный блок, хиты и подборки показываются, только когда им есть что показать. */
export default async function HomePage() {
  const [hero, categories, promotion, featured, collections] = await Promise.all([
    getHero(),
    getCategories(),
    getPromotion(),
    getFeaturedProducts(),
    getCollections("home"),
  ]);

  return (
    <main>
      <Hero imageUrl={hero.image_url} />
      <Categories categories={categories} />
      {promotion && <Promotion promotion={promotion} />}
      {featured.products.length > 0 && <Hits products={featured.products} />}
      <Collections collections={collections} />
      <Benefits />
    </main>
  );
}
