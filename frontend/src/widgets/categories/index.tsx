import Link from "next/link";
import { CATALOG_PATH, categoryPath, type Category } from "@/entities/product";
import { ArrowUpRightIcon } from "@/shared/ui/icons";
import SectionHeading from "@/shared/ui/section-heading";
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from "./data";
import styles from "./style.module.scss";

type CategoriesProps = {
  categories: Category[];
};

/** Блок главной «Выберите категорию»: карточка на каждую категорию каталога. */
const Categories = ({ categories }: CategoriesProps) => (
  <section className={styles.categories}>
    <SectionHeading
      eyebrow="Каталог"
      title="Выберите категорию"
      actionLabel="Все категории"
      actionHref={CATALOG_PATH}
    />

    <ul className={styles.grid}>
      {categories.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug] ?? DEFAULT_CATEGORY_ICON;

        return (
          <li key={category.id}>
            <Link className={styles.card} href={categoryPath(category.slug)}>
              <Icon className={styles.icon} />

              <span className={styles.row}>
                <span className={styles.name}>{category.name}</span>
                <ArrowUpRightIcon className={styles.arrow} />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </section>
);

export default Categories;
