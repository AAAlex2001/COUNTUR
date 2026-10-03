"use client";

import type { ReactNode } from "react";
import CloseButton from "@/shared/ui/close-button";
import Dialog from "@/shared/ui/dialog";
import styles from "./style.module.scss";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

/** Шторка сверху на всю ширину. Содержимое, как у шапки, не шире 768px и по центру. */
const Drawer = ({ open, onClose, title, children }: DrawerProps) => (
  <Dialog open={open} onClose={onClose} ariaLabel={title} className={styles.drawer}>
    <div className={styles.head}>
      <div className={styles.row}>
        <p className={styles.title}>{title}</p>
        <CloseButton onClick={onClose} />
      </div>
    </div>

    <div className={styles.body}>{children}</div>
  </Dialog>
);

export default Drawer;
