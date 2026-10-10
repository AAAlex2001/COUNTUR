import type { Editor } from "@tiptap/react";
import type { ReactNode } from "react";
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
} from "@/shared/ui/icons";

export type ToolbarAction = {
  label: string;
  content: ReactNode;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
};

/** Кнопки оформления по группам: заголовки, начертание, блоки. */
export const TOOLBAR_GROUPS: ToolbarAction[][] = [
  [
    {
      label: "Заголовок раздела",
      content: "H2",
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
      run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Подзаголовок",
      content: "H3",
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
      run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "Жирный",
      content: <BoldIcon />,
      isActive: (editor) => editor.isActive("bold"),
      run: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Курсив",
      content: <ItalicIcon />,
      isActive: (editor) => editor.isActive("italic"),
      run: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Подчёркнутый",
      content: <UnderlineIcon />,
      isActive: (editor) => editor.isActive("underline"),
      run: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
  ],
  [
    {
      label: "Маркированный список",
      content: <ListIcon />,
      isActive: (editor) => editor.isActive("bulletList"),
      run: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Нумерованный список",
      content: <ListOrderedIcon />,
      isActive: (editor) => editor.isActive("orderedList"),
      run: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Выделенный блок",
      content: <QuoteIcon />,
      isActive: (editor) => editor.isActive("blockquote"),
      run: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
  ],
];
