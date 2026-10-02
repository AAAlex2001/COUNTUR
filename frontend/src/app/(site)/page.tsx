import { getHero, getPromotion } from "@/entities/landing";
import { getCategories, getFeaturedProducts } from "@/entities/product";
import Benefits from "@/widgets/benefits";
import Categories from "@/widgets/categories";
import Hero from "@/widgets/hero";
import Hits from "@/widgets/hits";
import Promotion from "@/widgets/promotion";

export const dynamic = "force-dynamic";

/** Главная страница. Рекламный блок и хиты показываются, только когда им есть что показать. */
export default async function HomePage() {
  const [hero, categories, promotion, featured] = await Promise.all([
    getHero(),
    getCategories(),
    getPromotion(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      <Hero imageUrl={hero.image_url} />
      <Categories categories={categories} />
      {promotion && <Promotion promotion={promotion} />}
      {featured.products.length > 0 && <Hits products={featured.products} />}
      <Benefits />
    </main>
  );
}
