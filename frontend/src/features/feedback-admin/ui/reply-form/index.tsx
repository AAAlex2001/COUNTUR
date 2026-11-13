"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import styles from "./style.module.scss";

type ReplyFormProps = {
  email: string;
  reply: string;
  error?: string;
  pending: boolean;
  onChange: (reply: string) => void;
  onSend: () => void;
};

/** Ответ на обращение: текст письма и кнопка отправки на почту отправителя. */
const ReplyForm = ({ email, reply, error, pending, onChange, onSend }: ReplyFormProps) => (
  <Panel title="Ответить">
    <p className={styles.hint}>Письмо уйдёт на {email} с темой обращения.</p>

    <Field error={error}>
      <Textarea
        ariaLabel="Текст ответа"
        placeholder="Здравствуйте! …"
        rows={6}
        maxLength={5000}
        value={reply}
        onChange={onChange}
      />
    </Field>

    <Button className={styles.submit} loading={pending} onClick={onSend}>
      Отправить на почту
    </Button>
  </Panel>
);

export default ReplyForm;
