"use client";

import { MessageCard, ReplyForm, useFeedbackMessage } from "@/features/feedback-admin";
import BackButton from "@/shared/ui/back-button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type AdminFeedbackMessageProps = {
  messageId: number;
};

/** Карточка обращения: текст, уже отправленный ответ и форма нового ответа. */
const AdminFeedbackMessage = ({ messageId }: AdminFeedbackMessageProps) => {
  const { state, changeReply, send } = useFeedbackMessage(messageId);
  const { message } = state;

  if (state.failed) {
    return <p className={styles.error}>Обращение не найдено.</p>;
  }

  if (!message) {
    return <Loader size="lg" />;
  }

  return (
    <section className={styles.page}>
      <BackButton className={styles.back} />

      <MessageCard message={message} />

      <ReplyForm
        email={message.email}
        reply={state.reply}
        pending={state.pending}
        onChange={changeReply}
        onSend={send}
      />
    </section>
  );
};

export default AdminFeedbackMessage;
