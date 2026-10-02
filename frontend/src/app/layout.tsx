import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/shared/ui/toaster";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "COUNTUR — комплектующие для ПК",
    template: "%s | COUNTUR",
  },
  description: "Интернет-магазин комплектующих для производительной сборки",
};

export const viewport: Viewport = {
  themeColor: "#0c1114",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
