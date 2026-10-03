"use client";

import { fullName, type User } from "@/entities/user";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import { MapPinIcon } from "@/shared/ui/icons";
import Textarea from "@/shared/ui/textarea";
import { useAddress } from "../../model/use-address";
import styles from "./style.module.scss";

type AddressCardProps = {
  user: User;
};

/** Карточка «Адрес доставки»: показ адреса и правка на месте. */
const AddressCard = ({ user }: AddressCardProps) => {
  const { state, openEdit, closeEdit, changeDraft, save } = useAddress(user);

  return (
    <Card
      id="address"
      title="Адрес доставки"
      action={
        !state.editing && (
          <Button variant="ghost" size="sm" onClick={openEdit}>
            {user.address ? "Изменить" : "Добавить"}
          </Button>
        )
      }
    >
      {state.editing ? (
        <div className={styles.editor}>
          <Textarea
            className={styles.control}
            ariaLabel="Адрес доставки"
            rows={3}
            maxLength={500}
            placeholder="Город, улица, дом, квартира"
            value={state.draft}
            onChange={changeDraft}
          />

          <div className={styles.actions}>
            <Button variant="outline" disabled={state.pending} onClick={closeEdit}>
              Отмена
            </Button>
            <Button loading={state.pending} onClick={save}>
              Сохранить
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.kind}>
            <span className={styles.place}>
              <MapPinIcon className={styles.icon} />
              Основной адрес
            </span>
            {user.address && <Badge tone="soft">Основной</Badge>}
          </div>

          {user.address ? (
            <div className={styles.recipient}>
              <p className={styles.name}>{fullName(user)}</p>
              <p className={styles.address}>{user.address}</p>
              {user.phone && <p className={styles.phone}>{user.phone}</p>}
            </div>
          ) : (
            <p className={styles.address}>
              Адрес ещё не указан — добавьте его, чтобы быстрее оформлять заказы.
            </p>
          )}
        </>
      )}
    </Card>
  );
};

export default AddressCard;
