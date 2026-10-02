"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import { useLogin } from "../../model/use-login";
import styles from "./style.module.scss";

/** Форма входа в админку. */
const LoginForm = () => {
  const { state, changeField, submit } = useLogin();

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <h1 className={styles.title}>Вход в админку</h1>

      <Field label="Логин">
        <Input
          ariaLabel="Логин"
          autoComplete="username"
          value={state.login}
          onChange={(value) => changeField("login", value)}
        />
      </Field>

      <Field label="Пароль">
        <Input
          type="password"
          ariaLabel="Пароль"
          autoComplete="current-password"
          value={state.password}
          onChange={(value) => changeField("password", value)}
        />
      </Field>

      <Button type="submit" loading={state.pending}>
        Войти
      </Button>
    </form>
  );
};

export default LoginForm;
