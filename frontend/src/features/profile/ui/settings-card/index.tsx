"use client";

import type { User } from "@/entities/user";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import { LockIcon } from "@/shared/ui/icons";
import Switch from "@/shared/ui/switch";
import { useNotifications } from "../../model/use-notifications";
import { usePassword } from "../../model/use-password";
import PasswordModal from "../password-modal";
import styles from "./style.module.scss";

type SettingsCardProps = {
  user: User;
};

/** Карточка «Настройки аккаунта»: смена пароля и уведомления. */
const SettingsCard = ({ user }: SettingsCardProps) => {
  const password = usePassword();
  const notifications = useNotifications();

  return (
    <Card id="settings" title="Настройки аккаунта">
      <div className={styles.row}>
        <LockIcon className={styles.icon} />

        <div className={styles.texts}>
          <p className={styles.name}>Пароль</p>
          <p className={styles.hint}>Для входа по email</p>
        </div>

        <Button variant="ghost" size="sm" onClick={password.open}>
          Изменить
        </Button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.row}>
        <div className={styles.texts}>
          <p className={styles.name}>Уведомления о заказах</p>
          <p className={styles.hint}>Статус и доставка по email</p>
        </div>

        <Switch
          ariaLabel="Уведомления о заказах"
          checked={user.notify_orders}
          disabled={notifications.state.pending}
          onChange={(notify_orders) => notifications.toggle({ notify_orders })}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.texts}>
          <p className={styles.name}>Акции и новинки</p>
          <p className={styles.hint}>Спецпредложения и новые комплектующие</p>
        </div>

        <Switch
          ariaLabel="Акции и новинки"
          checked={user.notify_promo}
          disabled={notifications.state.pending}
          onChange={(notify_promo) => notifications.toggle({ notify_promo })}
        />
      </div>

      <hr className={styles.divider} />

      <p className={styles.note}>
        Ваши данные используются только для оформления и доставки заказов.
      </p>

      <PasswordModal
        open={password.state.open}
        fields={password.state.fields}
        pending={password.state.pending}
        onChange={password.change}
        onSave={password.save}
        onClose={password.close}
      />
    </Card>
  );
};

export default SettingsCard;
