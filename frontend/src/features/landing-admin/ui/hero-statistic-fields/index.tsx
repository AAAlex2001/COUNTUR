import type { HeroStatistic } from "@/entities/landing";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import styles from "./style.module.scss";

const MAX_STATISTICS = 8;

type HeroStatisticFieldsProps = {
  statistics: HeroStatistic[];
  onChange: (statistics: HeroStatistic[]) => void;
};

/** Редактирует значения и подписи показателей в порядке показа. */
const HeroStatisticFields = ({ statistics, onChange }: HeroStatisticFieldsProps) => {
  /** Заменяет показатель на выбранной позиции. */
  const updateStatistic = (index: number, statistic: HeroStatistic) => {
    const updated = statistics.slice();
    updated[index] = statistic;
    onChange(updated);
  };

  /** Удаляет показатель из черновика. */
  const removeStatistic = (index: number) => {
    onChange(statistics.filter((_, position) => position !== index));
  };

  /** Добавляет пустую строку для нового показателя. */
  const addStatistic = () => {
    onChange(statistics.concat({ value: "", label: "" }));
  };

  return (
    <section className={styles.statistics}>
      <h3 className={styles.title}>Показатели</h3>
      {statistics.map((statistic, index) => (
        <div className={styles.statistic} key={index}>
          <FieldGrid>
            <Field label="Значение">
              <Input
                ariaLabel={`Значение показателя ${index + 1}`}
                maxLength={40}
                value={statistic.value}
                onChange={(value) => updateStatistic(index, { value, label: statistic.label })}
              />
            </Field>
            <Field label="Подпись">
              <Input
                ariaLabel={`Подпись показателя ${index + 1}`}
                maxLength={60}
                value={statistic.label}
                onChange={(label) => updateStatistic(index, { value: statistic.value, label })}
              />
            </Field>
          </FieldGrid>
          <Button className={styles.action} variant="ghost" size="sm" onClick={() => removeStatistic(index)}>
            Удалить показатель
          </Button>
        </div>
      ))}

      <Button
        className={styles.action}
        variant="outline"
        disabled={statistics.length >= MAX_STATISTICS}
        onClick={addStatistic}
      >
        Добавить показатель
      </Button>
    </section>
  );
};

export default HeroStatisticFields;
