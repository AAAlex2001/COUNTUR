import { formatDate } from "@/shared/lib/date";
import Panel from "@/shared/ui/panel";
import type { FeedbackMessage } from "../../model/types";
import StatusBadge from "../status-badge";
import styles from "./style.module.scss";

type MessageCardProps = {
  message: FeedbackMessage;
};

/** Обращение целиком: отправитель, тема, текст и уже отправленный ответ, если он есть. */
const MessageCard = ({ message }: MessageCardProps) => (
  <Panel title={message.subject} action={<StatusBadge status={message.status} />}>
    <p className={styles.meta}>
      {message.name} ·{" "}
      <a className={styles.email} href={`mailto:${message.email}`}>
        {message.email}
      </a>{" "}
      · {formatDate(message.created_at)}
    </p>

    <p className={styles.text}>{message.message}</p>

    {message.reply && (
      <div className={styles.reply}>
        <p className={styles.replyLabel}>
          Ответ отправлен {message.answered_at && formatDate(message.answered_at)}
        </p>
        <p className={styles.text}>{message.reply}</p>
      </div>
    )}
  </Panel>
);

export default MessageCard;
