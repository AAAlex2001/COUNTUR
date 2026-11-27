import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";

type DeleteFeedbackButtonProps = {
  disabled: boolean;
  confirming: boolean;
  deleting: boolean;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onDelete: () => void;
};

/** Запрашивает подтверждение перед удалением обращения. */
const DeleteFeedbackButton = ({
  disabled,
  confirming,
  deleting,
  onAskDelete,
  onCancelDelete,
  onDelete,
}: DeleteFeedbackButtonProps) => (
  <>
    <Button variant="danger" disabled={disabled || deleting} onClick={onAskDelete}>
      Удалить обращение
    </Button>
    <ConfirmModal
      open={confirming}
      title="Удалить обращение?"
      text="Сообщение и сохранённый ответ будут удалены без возможности восстановления."
      confirmLabel="Удалить"
      pending={deleting}
      onConfirm={onDelete}
      onCancel={onCancelDelete}
    />
  </>
);

export default DeleteFeedbackButton;
