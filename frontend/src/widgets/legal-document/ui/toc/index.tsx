"use client";

import cn from "classnames";
import { useState } from "react";
import type { Heading } from "../../lib/headings";
import styles from "./style.module.scss";

type TocProps = {
  headings: Heading[];
};

/** Оглавление документа: нумерованные ссылки на разделы, выбранный подсвечен. */
const Toc = ({ headings }: TocProps) => {
  const [active, setActive] = useState(headings[0]?.id);

  return (
    <nav className={styles.toc} aria-label="Содержание">
      <p className={styles.title}>Содержание</p>

      {headings.map((heading, index) => (
        <a
          key={heading.id}
          className={cn(styles.item, heading.id === active && styles.active)}
          href={`#${heading.id}`}
          onClick={() => setActive(heading.id)}
        >
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.label}>{heading.title}</span>
        </a>
      ))}
    </nav>
  );
};

export default Toc;
