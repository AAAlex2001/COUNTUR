import Image from "next/image";
import Badge from "@/shared/ui/badge";
import FileButton from "@/shared/ui/file-button";
import IconButton from "@/shared/ui/icon-button";
import { ArrowRightIcon, TrashIcon } from "@/shared/ui/icons";
import Panel from "@/shared/ui/panel";
import styles from "./style.module.scss";

const IMAGE_TYPES = "image/jpeg,image/png,image/webp";

type ImageGridProps = {
  images: { id: number | string; url: string }[];
  onAdd: (files: File[]) => void;
  onMove: (index: number, shift: number) => void;
  onRemove: (index: number) => void;
  pending?: boolean;
};

/** Блок фото товара: загрузка, порядок стрелками и удаление. Первое фото — главное. */
const ImageGrid = ({ images, onAdd, onMove, onRemove, pending }: ImageGridProps) => (
  <Panel
    title="Фото"
    action={
      <FileButton accept={IMAGE_TYPES} multiple loading={pending} onSelect={onAdd}>
        Загрузить фото
      </FileButton>
    }
  >
    <p className={styles.hint}>JPEG, PNG или WebP до 5 МБ. Первое фото — главное.</p>

    <ul className={styles.images}>
      {images.map((image, index) => (
        <li className={styles.image} key={image.id}>
          <div className={styles.preview}>
            <Image src={image.url} alt="" fill sizes="160px" unoptimized className={styles.photo} />
            {index === 0 && <Badge className={styles.main}>Главное</Badge>}
          </div>

          <div className={styles.actions}>
            <IconButton
              tone="outline"
              size="sm"
              ariaLabel="Передвинуть влево"
              disabled={pending || index === 0}
              onClick={() => onMove(index, -1)}
            >
              <ArrowRightIcon className={styles.left} />
            </IconButton>

            <IconButton
              tone="outline"
              size="sm"
              ariaLabel="Передвинуть вправо"
              disabled={pending || index === images.length - 1}
              onClick={() => onMove(index, 1)}
            >
              <ArrowRightIcon />
            </IconButton>

            <IconButton
              className={styles.remove}
              tone="danger"
              size="sm"
              ariaLabel="Удалить фото"
              disabled={pending}
              onClick={() => onRemove(index)}
            >
              <TrashIcon />
            </IconButton>
          </div>
        </li>
      ))}
    </ul>
  </Panel>
);

export default ImageGrid;
