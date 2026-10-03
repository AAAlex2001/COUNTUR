"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { User } from "./types";

type UserValue = {
  user: User | null;
  setUser: (user: User | null) => void;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

const UserContext = createContext<UserValue | null>(null);

type UserProviderProps = {
  initialUser: User | null;
  children: ReactNode;
};

/** Хранит текущего покупателя и состояние окна входа. Покупатель известен с сервера сразу. */
export const UserProvider = ({ initialUser, children }: UserProviderProps) => {
  const [user, setUser] = useState(initialUser);
  const [authOpen, setAuthOpen] = useState(false);

  const value = {
    user,
    setUser,
    authOpen,
    openAuth: () => setAuthOpen(true),
    closeAuth: () => setAuthOpen(false),
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/** Покупатель из UserProvider и управление окном входа. */
export const useUser = (): UserValue => {
  const value = useContext(UserContext);

  if (!value) {
    throw new Error("useUser можно вызывать только внутри UserProvider");
  }

  return value;
};
