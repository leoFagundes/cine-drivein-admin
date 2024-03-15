import HomeTemplate from "../../Components/Templates/HomeTemplate";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <section className={styles.homeContainer}>
      <HomeTemplate />
    </section>
  );
}
