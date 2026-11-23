import { HeroContentEditor, HeroImageEditor, PromotionEditor } from "@/features/landing-admin";
import styles from "./style.module.scss";

/** Раздел админки с настройками главной страницы. */
const AdminLanding = () => (
  <section className={styles.landing}>
    <h1 className={styles.title}>Главная страница</h1>
    <HeroContentEditor />
    <HeroImageEditor />
    <PromotionEditor />
  </section>
);

export default AdminLanding;
