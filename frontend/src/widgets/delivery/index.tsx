import { EstimateForm } from "@/features/delivery-estimate";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import Button from "@/shared/ui/button";
import styles from "./style.module.scss";

type DeliveryProps = {
  calculatorAvailable: boolean;
};

/** Показывает условия доставки, связь по вопросам оплаты и доступный калькулятор. */
export default function Delivery({ calculatorAvailable }: DeliveryProps) {
  return (
    <section className={styles.page}>
      <h1>Доставка и оплата</h1>
      <p>Доставляем комплектующие по России. Стоимость и срок зависят от города и размеров посылки.</p>
      {calculatorAvailable && <EstimateForm />}

      <h2>Оплата заказа</h2>
      <Button href={TELEGRAM_SUPPORT_URL} variant="outline" newTab>
        Уточнить условия оплаты
      </Button>
    </section>
  );
}
