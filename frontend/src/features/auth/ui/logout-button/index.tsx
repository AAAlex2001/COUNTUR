"use client";

import { LogOutIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import { useLogout } from "../../model/use-logout";
import styles from "./style.module.scss";

/** Пункт «Выйти из аккаунта» для меню личного кабинета. */
const LogoutButton = () => {
  const { state, exit } = useLogout();

  return (
    <button type="button" className={styles.button} disabled={state.pending} onClick={exit}>
      {state.pending ? <Loader /> : <LogOutIcon className={styles.icon} />}
      Выйти из аккаунта
    </button>
  );
};

export default LogoutButton;
