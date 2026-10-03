"use client";

import { useCart, type Cart } from "@/entities/cart";
import { CATALOG_PATH } from "@/entities/product";
import { useUser, type User } from "@/entities/user";
import { LoginPrompt } from "@/features/auth";
import { ContactsForm, useCheckout } from "@/features/checkout";
import Button from "@/shared/ui/button";
import EmptyState from "@/shared/ui/empty-state";
import { CartIcon } from "@/shared/ui/icons";
import Loader from "@/shared/ui/loader";
import Steps from "@/shared/ui/steps";
import { CHECKOUT_STEPS } from "./data";
import OrderSummary from "./ui/order-summary";
import styles from "./style.module.scss";

type CheckoutStepsProps = {
  user: User;
  cart: Cart;
};

/** Шаги оформления: заголовок текущего шага, его форма и состав заказа. */
const CheckoutSteps = ({ user, cart }: CheckoutStepsProps) => {
  const { state, changeContacts, changeConsent, submitContacts, openStep } = useCheckout(user);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.titles}>
          <p className={styles.eyebrow}>Оформление заказа</p>
          <h1 className={styles.title}>{CHECKOUT_STEPS[state.step].title}</h1>
        </div>

        <p className={styles.counter}>
          Шаг {state.step + 1} из {CHECKOUT_STEPS.length}
        </p>
      </div>

      <Steps steps={CHECKOUT_STEPS.map((step) => step.label)} current={state.step} />

      <div className={styles.columns}>
        {state.step === 0 ? (
          <ContactsForm
            contacts={state.contacts}
            consent={state.consent}
            onChange={changeContacts}
            onConsentChange={changeConsent}
            onSubmit={submitContacts}
          />
        ) : (
          <div className={styles.stub}>
            <p className={styles.stubText}>Этот шаг ещё в разработке.</p>
            <Button variant="outline" onClick={() => openStep(0)}>
              Назад к контактам
            </Button>
          </div>
        )}

        <OrderSummary className={styles.summary} cart={cart} />
      </div>
    </>
  );
};

/** Оформление заказа: доступно после входа и только с непустой корзиной. */
const Checkout = () => {
  const { user } = useUser();
  const { cart, loaded } = useCart();

  if (!loaded) {
    return <Loader size="lg" />;
  }

  return (
    <section className={styles.checkout}>
      {!user && (
        <LoginPrompt
          title="Войдите, чтобы оформить заказ"
          text="Заказ привяжется к аккаунту — так его проще отследить."
        />
      )}

      {user && cart.items.length === 0 && (
        <EmptyState
          icon={<CartIcon />}
          title="Оформлять пока нечего"
          text="Добавьте товары в корзину — и возвращайтесь к оформлению."
          action={
            <Button variant="outline" href={CATALOG_PATH}>
              Перейти в каталог
            </Button>
          }
        />
      )}

      {user && cart.items.length > 0 && <CheckoutSteps user={user} cart={cart} />}
    </section>
  );
};

export default Checkout;
