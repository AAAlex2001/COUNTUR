"use client";

import { useState, type ReactNode } from "react";
import { useAdminSession } from "@/features/admin-auth";
import { ADMIN_PRODUCTS_PATH } from "@/shared/lib/admin-paths";
import IconButton from "@/shared/ui/icon-button";
import { MenuIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import Logo from "@/shared/ui/logo";
import Modal from "@/shared/ui/modal";
import AdminNav from "./ui/nav";
import styles from "./style.module.scss";

type AdminShellProps = {
  children: ReactNode;
};

/** Оболочка админки: пускает после входа. Меню на ПК стоит сбоку, на узком экране — за бургером. */
const AdminShell = ({ children }: AdminShellProps) => {
  const { state, exit } = useAdminSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  if (!state.ready) {
    return <Loader size="lg" />;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Logo href={ADMIN_PRODUCTS_PATH} ariaLabel="COUNTUR — админка" caption="Control panel" />
        <AdminNav onExit={exit} />
      </aside>

      <header className={styles.bar}>
        <Logo href={ADMIN_PRODUCTS_PATH} ariaLabel="COUNTUR — админка" caption="Control panel" />

        <IconButton tone="outline" ariaLabel="Открыть меню" onClick={() => setMenuOpen(true)}>
          <MenuIcon />
        </IconButton>
      </header>

      <Modal open={menuOpen} title="Меню" onClose={closeMenu}>
        {menuOpen && <AdminNav onExit={exit} onNavigate={closeMenu} />}
      </Modal>

      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default AdminShell;
