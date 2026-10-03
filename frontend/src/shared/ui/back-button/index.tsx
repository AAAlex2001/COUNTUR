"use client";

import { useRouter } from "next/navigation";
import Button from "@/shared/ui/button";
import { ArrowLeftIcon } from "@/shared/ui/icons";

type BackButtonProps = {
  className?: string;
};

/** Кнопка «Назад»: возвращает на предыдущую страницу браузера. */
const BackButton = ({ className }: BackButtonProps) => {
  const router = useRouter();

  return (
    <Button className={className} onClick={router.back}>
      <ArrowLeftIcon />
      Назад
    </Button>
  );
};

export default BackButton;
