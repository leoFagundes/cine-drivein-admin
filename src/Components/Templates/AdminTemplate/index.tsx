import {Sidebar} from "../../Organism/Sidebar";
import styles from './AdminTemplate.module.scss';
import {ReactNode} from "react";

type AdminTemplateType = {
  children?: ReactNode;
}
export const AdminTemplate = ({children}: AdminTemplateType) => {
  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <div className={styles.elementsContainer}>
          {children}
        </div>
      </div>
    </>
  )
}