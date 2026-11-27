import { CATALOG_PATH } from "@/entities/product";
import { ASSEMBLY_HELP_URL } from "@/shared/config/telegram";
import Button from "@/shared/ui/button";
import { ArrowRightIcon, WrenchIcon } from "@/shared/ui/icons";
import styles from "../../style.module.scss";

type HeroActionsProps = {
  catalogLabel: string;
  supportLabel: string;
};

/** Показывает кнопки первого экрана, для которых администратор задал подписи. */
export default function HeroActions({ catalogLabel, supportLabel }: HeroActionsProps) {
  if (!catalogLabel && !supportLabel) return null;

  return (
    <div className={styles.actions}>
      {catalogLabel && (
        <Button className={styles.action} href={CATALOG_PATH}>
          <ArrowRightIcon className={styles.icon} />
          {catalogLabel}
        </Button>
      )}

      {supportLabel && (
        <Button className={styles.action} variant="outline" href={ASSEMBLY_HELP_URL} newTab>
          <WrenchIcon className={styles.icon} />
          {supportLabel}
        </Button>
      )}
    </div>
  );
}
