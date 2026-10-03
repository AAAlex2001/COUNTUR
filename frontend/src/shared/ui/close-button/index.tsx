import { CloseIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type CloseButtonProps = {
  onClick: () => void;
  ariaLabel?: string;
};

/** Квадратная кнопка с крестиком для закрытия окон. */
const CloseButton = ({ onClick, ariaLabel = "Закрыть" }: CloseButtonProps) => (
  <button type="button" className={styles.close} aria-label={ariaLabel} onClick={onClick}>
    <CloseIcon />
  </button>
);

export default CloseButton;
