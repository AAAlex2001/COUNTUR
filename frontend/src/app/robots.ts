import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/shared/config/site";

/** robots.txt: закрытые разделы не индексируем, карту сайта показываем. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/cart", "/favorites", "/checkout", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
