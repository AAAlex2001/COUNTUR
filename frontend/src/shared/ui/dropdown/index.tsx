"use client";

import cn from "classnames";
import { useRef, useState } from "react";
import { useClickOutside } from "@/shared/lib/use-click-outside";
import { ChevronDownIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

export type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  className?: string;
};

/** Выпадающий список с одним выбранным значением. */
const Dropdown = ({ value, options, onChange, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

  useClickOutside(rootRef, () => setOpen(false));

  const choose = (next: string) => {
    setOpen(false);
    onChange(next);
  };

  return (
    <div className={cn(styles.dropdown, className)} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.label}>{selected?.label}</span>
        <ChevronDownIcon className={cn(styles.chevron, open && styles.rotated)} />
      </button>

      {open && (
        <ul className={styles.menu}>
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                className={cn(styles.option, option.value === value && styles.selected)}
                onClick={() => choose(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
