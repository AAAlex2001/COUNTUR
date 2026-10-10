"use client";

import type { Editor } from "@tiptap/react";
import { useState } from "react";
import { LinkIcon, RedoIcon, UndoIcon } from "@/shared/ui/icons";
import { TOOLBAR_GROUPS } from "../../model/actions";
import LinkModal from "../link-modal";
import ToolButton from "../tool-button";
import styles from "./style.module.scss";

type ToolbarProps = {
  editor: Editor;
};

/** Панель редактора: оформление, ссылка и отмена шагов. Прилипает к верху при прокрутке. */
const Toolbar = ({ editor }: ToolbarProps) => {
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");

  const openLink = () => {
    setHref(editor.getAttributes("link").href ?? "");
    setLinkOpen(true);
  };

  /** Поставить ссылку на выделение или на ссылку под курсором; пустой адрес её снимает. */
  const saveLink = () => {
    const chain = editor.chain().focus().extendMarkRange("link");
    const url = href.trim();

    if (url) {
      chain.setLink({ href: url }).run();
    } else {
      chain.unsetLink().run();
    }

    setLinkOpen(false);
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Оформление текста">
      {TOOLBAR_GROUPS.map((group) => (
        <div className={styles.group} key={group[0].label}>
          {group.map((action) => (
            <ToolButton
              key={action.label}
              label={action.label}
              active={action.isActive(editor)}
              onClick={() => action.run(editor)}
            >
              {action.content}
            </ToolButton>
          ))}
        </div>
      ))}

      <div className={styles.group}>
        <ToolButton label="Ссылка" active={editor.isActive("link")} onClick={openLink}>
          <LinkIcon />
        </ToolButton>
      </div>

      <div className={styles.history}>
        <ToolButton
          label="Отменить"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <UndoIcon />
        </ToolButton>
        <ToolButton
          label="Повторить"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RedoIcon />
        </ToolButton>
      </div>

      <LinkModal
        open={linkOpen}
        href={href}
        onChange={setHref}
        onSave={saveLink}
        onClose={() => setLinkOpen(false)}
      />
    </div>
  );
};

export default Toolbar;
