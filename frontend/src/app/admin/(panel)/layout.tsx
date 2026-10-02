import AdminShell from "@/widgets/admin/shell";

/** Страницы админки, доступные только после входа. */
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
