import type { Metadata } from "next";
import Favorites from "@/widgets/favorites";

export const metadata: Metadata = {
  title: "Избранное",
  robots: { index: false, follow: false },
};

export default function FavoritesRoute() {
  return (
    <main>
      <Favorites />
    </main>
  );
}
