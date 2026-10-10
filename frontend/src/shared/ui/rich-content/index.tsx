import cn from "classnames";
import styles from "./style.module.scss";

/** Класс оформления текста. Им же размечена область редактора, чтобы правка выглядела как сайт. */
export const RICH_CONTENT_CLASS = styles.content;

type RichContentProps = {
  html: string;
  className?: string;
};

/** Текст из редактора на странице сайта. HTML приходит с бэкенда уже очищенным. */
const RichContent = ({ html, className }: RichContentProps) => (
  <div className={cn(styles.content, className)} dangerouslySetInnerHTML={{ __html: html }} />
);

export default RichContent;
