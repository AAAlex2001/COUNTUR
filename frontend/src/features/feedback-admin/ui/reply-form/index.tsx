"use client";

import Button from "@/shared/ui/button";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import styles from "./style.module.scss";

type ReplyFormProps = {
  email: string;
  reply: string;
  pending: boolean;
  onChange: (reply: string) => void;
  onSend: () => void;
};

/** Ответ на обращение: текст письма и кнопка отправки на почту отправителя. */
const ReplyForm = ({ email, reply, pending, onChange, onSend }: ReplyFormProps) => (
  <Panel title="Ответить">
    <p className={styles.hint}>Письмо уйдёт на {email} с темой обращения.</p>

    <Textarea
      ariaLabel="Текст ответа"
      placeholder="Здравствуйте! …"
      rows={6}
      maxLength={5000}
      value={reply}
      onChange={onChange}
    />

    <Button className={styles.submit} loading={pending} disabled={reply.trim().length < 2} onClick={onSend}>
      Отправить на почту
    </Button>
  </Panel>
);

export default ReplyForm;
