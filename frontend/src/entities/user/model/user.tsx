"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchMe } from "../api/auth";
import type { User } from "./types";

type UserValue = {
  user: User | null;
  loaded: boolean;
  setUser: (user: User | null) => void;
  authOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
};

const UserContext = createContext<UserValue | null>(null);

type UserProviderProps = {
  children: ReactNode;
};

/** Хранит текущего покупателя и состояние окна входа, раздаёт их всем компонентам. */
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  const value = {
    user,
    loaded,
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
