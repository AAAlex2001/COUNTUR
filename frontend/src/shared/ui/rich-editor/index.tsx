"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import cn from "classnames";
import { RICH_CONTENT_CLASS } from "@/shared/ui/rich-content";
import Toolbar from "./ui/toolbar";
import styles from "./style.module.scss";

/** Только то, что умеет показать сайт и пропускает очистка на бэкенде. */
const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
  }),
];

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
};

/**
 * Редактор текста на TipTap. Неуправляемый: value читается один раз при создании,
 * дальше каждое изменение приходит в onChange готовым HTML.
 */
const RichEditor = ({ value, onChange, ariaLabel }: RichEditorProps) => {
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: value,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: cn(RICH_CONTENT_CLASS, styles.area),
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel,
      },
    },
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  });

  return (
    <div className={styles.editor}>
      {editor ? (
        <>
          <Toolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className={styles.placeholder} />
      )}
    </div>
  );
};

export default RichEditor;
