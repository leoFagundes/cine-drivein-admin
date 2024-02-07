import styles from './HorizontalItem.module.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Text from "../../Atoms/Text";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

type HorizontalItemType = {
  pageKey?: string;
  isSelected: boolean;
  label: string;
  icon: IconProp;
  onClick: VoidFunction;
  marginTop: string;
}
export const HorizontalItem = ({pageKey, label, icon, onClick, marginTop, isSelected}: HorizontalItemType) => {
  const containerClassName = isSelected ? styles.sidebarItemContainerActivate : styles.sidebarItemContainer;
  const iconClassName = isSelected ? styles.iconContainerActivate : styles.iconContainer;

  return (
  <div onClick={onClick} style={{marginTop}} className={containerClassName}>
    <div className={iconClassName}>
      <FontAwesomeIcon size="lg" icon={icon}/>
    </div>
    <Text>{label}</Text>
  </div>
)};