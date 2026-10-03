"use client";

import type { User } from "@/entities/user";
import Button from "@/shared/ui/button";
import Card from "@/shared/ui/card";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import { useProfile } from "../../model/use-profile";
import styles from "./style.module.scss";

type ProfileFormProps = {
  user: User;
};

/** Карточка «Личные данные»: имя, фамилия, телефон и email. */
const ProfileForm = ({ user }: ProfileFormProps) => {
  const { state, change, reset, save } = useProfile(user);
  const { fields } = state;

  return (
    <Card id="profile" title="Личные данные">
      <form
        className={styles.form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
      >
        <FieldGrid>
          <Field label="Имя" plain>
            <Input
              className={styles.control}
              size="lg"
              ariaLabel="Имя"
              autoComplete="given-name"
              maxLength={100}
              value={fields.name}
              onChange={(name) => change({ name })}
            />
          </Field>

          <Field label="Фамилия" plain>
            <Input
              className={styles.control}
              size="lg"
              ariaLabel="Фамилия"
              autoComplete="family-name"
              maxLength={100}
              value={fields.lastName}
              onChange={(lastName) => change({ lastName })}
            />
          </Field>

          <Field label="Телефон" plain>
            <Input
              className={styles.control}
              size="lg"
              type="tel"
              ariaLabel="Телефон"
              autoComplete="tel"
              placeholder="+7 999 000-00-00"
              maxLength={32}
              value={fields.phone}
              onChange={(phone) => change({ phone })}
            />
          </Field>

          <Field label="Электронная почта" plain>
            <Input
              className={styles.control}
              size="lg"
              type="email"
              ariaLabel="Электронная почта"
              autoComplete="email"
              maxLength={254}
              value={fields.email}
              onChange={(email) => change({ email })}
            />
          </Field>
        </FieldGrid>

        <div className={styles.actions}>
          <Button variant="outline" disabled={state.pending} onClick={reset}>
            Отмена
          </Button>
          <Button type="submit" loading={state.pending}>
            Сохранить
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileForm;
