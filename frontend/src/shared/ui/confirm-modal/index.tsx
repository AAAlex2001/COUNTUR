"use client";

import Button from "@/shared/ui/button";
import Modal from "@/shared/ui/modal";
import styles from "./style.module.scss";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
};

/** Окно с вопросом и кнопками «Отмена» и красного подтверждения — для удаления. */
const ConfirmModal = ({
  open,
  title,
  text,
  confirmLabel,
  onConfirm,
  onCancel,
  pending,
}: ConfirmModalProps) => (
  <Modal
    open={open}
    title={title}
    onClose={onCancel}
    footer={
      <>
        <Button className={styles.button} variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button className={styles.button} variant="danger" loading={pending} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className={styles.text}>{text}</p>
  </Modal>
);

export default ConfirmModal;
