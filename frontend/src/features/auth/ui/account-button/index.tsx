"use client";

import cn from "classnames";
import { useUser } from "@/entities/user";
import Button from "@/shared/ui/button";
import { UserIcon } from "@/shared/ui/icons";
import Modal from "@/shared/ui/modal";
import { useAccount } from "../../model/use-account";
import styles from "./style.module.scss";

type AccountButtonProps = {
  className?: string;
};

/** Иконка аккаунта в шапке: без входа открывает окно входа, после входа — окно с выходом. */
const AccountButton = ({ className }: AccountButtonProps) => {
  const { user, openAuth } = useUser();
  const { state, open, close, exit } = useAccount();

  return (
    <>
      <button
        type="button"
        className={cn(styles.button, className)}
        aria-label={user ? "Аккаунт" : "Войти"}
        onClick={user ? open : openAuth}
      >
        <UserIcon className={styles.icon} />
      </button>

      {user && (
        <Modal
          open={state.open}
          title="Аккаунт"
          onClose={close}
          footer={
            <Button variant="outline" loading={state.pending} onClick={exit}>
              Выйти
            </Button>
          }
        >
          <p className={styles.name}>{user.name}</p>
          <p className={styles.email}>{user.email}</p>
        </Modal>
      )}
    </>
  );
};

export default AccountButton;
