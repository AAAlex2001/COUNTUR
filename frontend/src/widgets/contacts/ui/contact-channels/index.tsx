import { phoneHref, type ContactsSettings } from "@/entities/contacts";
import { MailIcon, PhoneIcon } from "@/shared/ui/icons";
import ChannelCard from "../channel-card";
import styles from "../../style.module.scss";

type ContactChannelsProps = {
  settings: ContactsSettings;
};

/** Показывает карточки заполненных каналов связи. */
const ContactChannels = ({ settings }: ContactChannelsProps) => {
  if (!settings.phone && !settings.email) return null;

  return (
    <div className={styles.channels}>
      {settings.phone && (
        <ChannelCard
          icon={<PhoneIcon />}
          label={settings.phone_label}
          value={settings.phone}
          href={phoneHref(settings.phone)}
          text={settings.phone_description}
        />
      )}
      {settings.email && (
        <ChannelCard
          icon={<MailIcon />}
          label={settings.email_label}
          value={settings.email}
          href={`mailto:${settings.email}`}
          text={settings.email_description}
        />
      )}
    </div>
  );
};

export default ContactChannels;
