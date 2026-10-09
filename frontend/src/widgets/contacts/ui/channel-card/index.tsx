import type { ReactNode } from "react";
import styles from "./style.module.scss";

type ChannelCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
  text: string;
};

/** Карточка канала связи: значок, подпись, крупный контакт-ссылка и пояснение. */
const ChannelCard = ({ icon, label, value, href, text }: ChannelCardProps) => (
  <div className={styles.card}>
    <div className={styles.channel}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>

    <a className={styles.value} href={href}>
      {value}
    </a>

    <p className={styles.text}>{text}</p>
  </div>
);

export default ChannelCard;
