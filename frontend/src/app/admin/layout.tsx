import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Админка",
  robots: { index: false, follow: false },
};

/** Общая оболочка всех страниц админки, включая вход. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
