"use client";

import {
  DeleteFeedbackButton,
  MessageCard,
  ReplyForm,
  useDeleteFeedback,
  useFeedbackMessage,
} from "@/features/feedback-admin";
import BackButton from "@/shared/ui/back-button";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type AdminFeedbackMessageProps = {
  messageId: number;
};

/** Карточка обращения: текст, уже отправленный ответ и форма нового ответа. */
const AdminFeedbackMessage = ({ messageId }: AdminFeedbackMessageProps) => {
  const { state, replyError, changeReply, send } = useFeedbackMessage(messageId);
  const deletion = useDeleteFeedback(messageId);
  const { message } = state;

  if (state.failed) {
    return <p className={styles.error}>Обращение не найдено.</p>;
  }

  if (!message) {
    return <Loader size="lg" />;
  }

  return (
    <section className={styles.page}>
      <div className={styles.actions}>
        <BackButton />
        <DeleteFeedbackButton
          disabled={state.pending}
          confirming={deletion.confirming}
          deleting={deletion.deleting}
          onAskDelete={deletion.askDelete}
          onCancelDelete={deletion.cancelDelete}
          onDelete={deletion.deleteMessage}
        />
      </div>

      <MessageCard message={message} />

      <ReplyForm
        email={message.email}
        reply={state.reply}
        error={replyError}
        pending={state.pending}
        disabled={deletion.deleting}
        onChange={changeReply}
        onSend={send}
      />
    </section>
  );
};

export default AdminFeedbackMessage;
