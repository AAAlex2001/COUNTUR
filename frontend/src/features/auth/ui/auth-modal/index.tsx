"use client";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/entities/user";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import CloseButton from "@/shared/ui/close-button";
import Dialog from "@/shared/ui/dialog";
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from "@/shared/ui/icons";
import Input from "@/shared/ui/input";
import Segmented from "@/shared/ui/segmented";
import { useAuth } from "../../model/use-auth";
import type { AuthTab } from "../../model/types";
import styles from "./style.module.scss";

const TABS = [
  { value: "login", label: "Вход" },
  { value: "register", label: "Регистрация" },
];

const TEXTS = {
  login: {
    title: "С возвращением",
    description: "Войдите, чтобы увидеть корзину, избранное и заказы.",
    submit: "Войти",
  },
  register: {
    title: "Создайте аккаунт",
    description: "Сохраняйте сборки, отслеживайте заказы и оформляйте покупки быстрее.",
    submit: "Зарегистрироваться",
  },
};

/** Окно входа и регистрации. Открывается из шапки и везде, где нужен аккаунт. */
const AuthModal = () => {
  const { authOpen, closeAuth } = useUser();
  const { state, changeTab, change, togglePassword, submit } = useAuth();
  const { tab, fields } = state;
  const texts = TEXTS[tab];
  const passwordType = state.showPassword ? "text" : "password";

  const passwordToggle = (
    <button
      type="button"
      className={styles.eye}
      aria-label={state.showPassword ? "Скрыть пароль" : "Показать пароль"}
      onClick={togglePassword}
    >
      {state.showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <Dialog open={authOpen} onClose={closeAuth} ariaLabel={texts.title} className={styles.window}>
      <div className={styles.head}>
        <span className={styles.logo}>
          <Image src="/logo.svg" alt="" width={30} height={30} unoptimized />
          COUNTUR
        </span>

        <CloseButton onClick={closeAuth} />
      </div>

      <Segmented value={tab} options={TABS} onChange={(value) => changeTab(value as AuthTab)} />

      <div className={styles.intro}>
        <h2 className={styles.title}>{texts.title}</h2>
        <p className={styles.description}>{texts.description}</p>
      </div>

      <form
        className={styles.form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {tab === "register" && (
          <div className={styles.field}>
            <span className={styles.label}>Имя *</span>
            <Input
              className={styles.control}
              size="lg"
              ariaLabel="Имя"
              placeholder="Как к вам обращаться"
              autoComplete="name"
              maxLength={100}
              value={fields.name}
              onChange={(name) => change({ name })}
            />
          </div>
        )}

        <div className={styles.field}>
          <span className={styles.label}>Email *</span>
          <Input
            className={styles.control}
            size="lg"
            type="email"
            ariaLabel="Email"
            placeholder="example@mail.ru"
            autoComplete="email"
            maxLength={254}
            value={fields.email}
            onChange={(email) => change({ email })}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Пароль *</span>
          <Input
            className={styles.control}
            size="lg"
            type={passwordType}
            ariaLabel="Пароль"
            placeholder={tab === "register" ? "Придумайте пароль" : "Ваш пароль"}
            autoComplete={tab === "register" ? "new-password" : "current-password"}
            maxLength={128}
            value={fields.password}
            onChange={(password) => change({ password })}
            suffix={passwordToggle}
          />
          {tab === "register" && (
            <span className={styles.hint}>Не менее 8 символов, включая буквы и цифры.</span>
          )}
        </div>

        {tab === "register" && (
          <>
            <div className={styles.field}>
              <span className={styles.label}>Подтверждение пароля *</span>
              <Input
                className={styles.control}
                size="lg"
                type={passwordType}
                ariaLabel="Подтверждение пароля"
                placeholder="Повторите пароль"
                autoComplete="new-password"
                maxLength={128}
                value={fields.confirm}
                onChange={(confirm) => change({ confirm })}
                suffix={passwordToggle}
              />
            </div>

            <Checkbox size="lg" checked={fields.agree} onChange={(agree) => change({ agree })}>
              Я принимаю{" "}
              <Link className={styles.link} href="/terms">
                условия использования
              </Link>{" "}
              и даю согласие на обработку данных согласно{" "}
              <Link className={styles.link} href="/privacy">
                политике конфиденциальности
              </Link>
              .
            </Checkbox>
          </>
        )}

        <div className={styles.actions}>
          <Button type="submit" loading={state.pending}>
            {texts.submit}
            <ArrowRightIcon className={styles.arrow} />
          </Button>

          <p className={styles.switch}>
            {tab === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => changeTab(tab === "login" ? "register" : "login")}
            >
              {tab === "login" ? "Регистрация" : "Вход"}
            </Button>
          </p>
        </div>
      </form>
    </Dialog>
  );
};

export default AuthModal;
