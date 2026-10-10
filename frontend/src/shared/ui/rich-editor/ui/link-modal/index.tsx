"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Modal from "@/shared/ui/modal";
import styles from "./style.module.scss";

type LinkModalProps = {
  open: boolean;
  href: string;
  onChange: (href: string) => void;
  onSave: () => void;
  onClose: () => void;
};

/** Окно ссылки для выделенного текста. Пустой адрес убирает ссылку. */
const LinkModal = ({ open, href, onChange, onSave, onClose }: LinkModalProps) => (
  <Modal open={open} title="Ссылка" onClose={onClose}>
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
    >
      <Field label="Адрес" hint="Пусто — ссылка будет убрана" plain>
        <Input
          size="lg"
          ariaLabel="Адрес ссылки"
          placeholder="https://… или /contacts"
          maxLength={500}
          value={href}
          onChange={onChange}
        />
      </Field>

      <div className={styles.actions}>
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </form>
  </Modal>
);

export default LinkModal;
