import type { Metadata, Viewport } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/shared/config/site";
import JsonLd from "@/shared/ui/json-ld";
import { ToastProvider } from "@/shared/ui/toaster";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — комплектующие для ПК`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "ru_RU",
    url: SITE_URL,
    title: `${SITE_NAME} — комплектующие для ПК`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c1114",
  width: "device-width",
  initialScale: 1,
};

/** Организация и сайт с поиском по каталогу — общие данные для всех страниц. */
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      url: SITE_URL,
      logo: absoluteUrl("/logo.svg"),
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "ru",
      publisher: { "@id": absoluteUrl("/#organization") },
      potentialAction: {
        "@type": "SearchAction",
        target: `${absoluteUrl("/catalog")}?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <JsonLd data={SITE_JSON_LD} />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
