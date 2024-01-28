import styles from './Sidebar.module.scss';
import LogoImage from "../../Atoms/LogoImage";
export const Sidebar = () => {
  return (
    <div className={styles.container}>
        <LogoImage size={"40px"}/>
    </div>
  )
}