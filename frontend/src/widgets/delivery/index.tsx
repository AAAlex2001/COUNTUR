import { EstimateForm } from "@/features/delivery-estimate";
import { TELEGRAM_SUPPORT_URL } from "@/shared/config/telegram";
import Button from "@/shared/ui/button";
import SectionHeading from "@/shared/ui/section-heading";
import styles from "./style.module.scss";

type DeliveryProps = {
  calculatorAvailable: boolean;
};

/** Показать доставку и оплату. */
export default function Delivery({ calculatorAvailable }: DeliveryProps) {
  return (
    <section className={styles.page}>
      <SectionHeading as="h1" title="Доставка и оплата" />
      <p>Доставляем комплектующие по России. Стоимость и срок зависят от города и размеров посылки.</p>
      {calculatorAvailable && <EstimateForm />}

      <SectionHeading title="Оплата заказа" />
      <Button href={TELEGRAM_SUPPORT_URL} variant="outline" newTab>
        Уточнить условия оплаты
      </Button>
    </section>
  );
}
