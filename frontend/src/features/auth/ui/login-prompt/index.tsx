"use client";

import { useUser } from "@/entities/user";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import { UserIcon } from "@/shared/ui/icons";

type LoginPromptProps = {
  title: string;
  text: string;
};

/** Заглушка страницы, которой нужен аккаунт: объяснение и кнопка, открывающая окно входа. */
const LoginPrompt = ({ title, text }: LoginPromptProps) => {
  const { openAuth } = useUser();

  return (
    <EmptyState
      icon={<UserIcon />}
      title={title}
      text={text}
      action={<Button onClick={openAuth}>Войти или зарегистрироваться</Button>}
    />
  );
};

export default LoginPrompt;
