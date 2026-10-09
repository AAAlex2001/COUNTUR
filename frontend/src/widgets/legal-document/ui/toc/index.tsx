"use client";

import cn from "classnames";
import { useState } from "react";
import type { DocumentSection } from "../../model/types";
import styles from "./style.module.scss";

type TocProps = {
  sections: DocumentSection[];
};

/** Оглавление документа: нумерованные ссылки на разделы, выбранный подсвечен. */
const Toc = ({ sections }: TocProps) => {
  const [active, setActive] = useState(sections[0]?.id);

  return (
    <nav className={styles.toc} aria-label="Содержание">
      <p className={styles.title}>Содержание</p>

      {sections.map((section, index) => (
        <a
          key={section.id}
          className={cn(styles.item, section.id === active && styles.active)}
          href={`#${section.id}`}
          onClick={() => setActive(section.id)}
        >
          <span className={styles.number}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.label}>{section.title}</span>
        </a>
      ))}
    </nav>
  );
};

export default Toc;
