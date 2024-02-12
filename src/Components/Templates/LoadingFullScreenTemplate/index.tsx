import styles from './LoadingFullScreenTemplate.module.scss';
import { Loading } from "../../Atoms/Loading";

export const LoadingFullScreenTemplate = () => (
  <div className={styles.container}>
    <Loading />
  </div>
);