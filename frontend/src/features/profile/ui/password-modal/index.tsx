"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Modal from "@/shared/ui/modal";
import type { PasswordFields } from "../../model/types";
import styles from "./style.module.scss";

type PasswordModalProps = {
  open: boolean;
  fields: PasswordFields;
  pending: boolean;
  onChange: (changes: Partial<PasswordFields>) => void;
  onSave: () => void;
  onClose: () => void;
};

/** Окно смены пароля: текущий, новый и его подтверждение. */
const PasswordModal = ({ open, fields, pending, onChange, onSave, onClose }: PasswordModalProps) => (
  <Modal
    open={open}
    title="Смена пароля"
    onClose={onClose}
    footer={
      <>
        <Button className={styles.button} variant="outline" disabled={pending} onClick={onClose}>
          Отмена
        </Button>
        <Button className={styles.button} loading={pending} onClick={onSave}>
          Сохранить
        </Button>
      </>
    }
  >
    <div className={styles.fields}>
      <Field label="Текущий пароль" plain>
        <Input
          size="lg"
          type="password"
          ariaLabel="Текущий пароль"
          autoComplete="current-password"
          maxLength={128}
          value={fields.current}
          onChange={(current) => onChange({ current })}
        />
      </Field>

      <Field label="Новый пароль" plain hint="Не менее 8 символов, включая буквы и цифры.">
        <Input
          size="lg"
          type="password"
          ariaLabel="Новый пароль"
          autoComplete="new-password"
          maxLength={128}
          value={fields.next}
          onChange={(next) => onChange({ next })}
        />
      </Field>

      <Field label="Повторите новый пароль" plain>
        <Input
          size="lg"
          type="password"
          ariaLabel="Повторите новый пароль"
          autoComplete="new-password"
          maxLength={128}
          value={fields.confirm}
          onChange={(confirm) => onChange({ confirm })}
        />
      </Field>
    </div>
  </Modal>
);

export default PasswordModal;
