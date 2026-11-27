import type { Metadata } from "next";
import { ABOUT_PATH } from "@/shared/config/site";
import About from "@/widgets/about";

export const metadata: Metadata = {
  title: "О Countur",
  alternates: { canonical: ABOUT_PATH },
};

/** Страница о магазине Countur. */
export default function AboutRoute() {
  return (
    <main>
      <About />
    </main>
  );
}
