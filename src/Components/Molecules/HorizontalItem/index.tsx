import styles from "./HorizontalItem.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Text from "../../Atoms/Text";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type HorizontalItemType = {
  pageKey?: string;
  isSelected: boolean;
  label: string;
  icon: IconProp;
  profileImage?: string;
  onClick: VoidFunction;
  marginTop: string;
};
export const HorizontalItem = ({
  pageKey,
  label,
  icon,
  profileImage,
  onClick,
  marginTop,
  isSelected,
}: HorizontalItemType) => {
  const containerClassName = isSelected
    ? styles.sidebarItemContainerActivate
    : styles.sidebarItemContainer;
  const iconClassName = isSelected
    ? styles.iconContainerActivate
    : styles.iconContainer;

  return (
    <div
      data-testid="testContainer"
      onClick={onClick}
      style={{ marginTop }}
      className={containerClassName}
    >
      {pageKey === "profile" && profileImage !== "" ? (
        <img
          className={styles.avatarProfileImage}
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profileImage}`}
          alt={`Profile Icon - ${label}`}
        />
      ) : (
        <div data-testid="testIco" className={iconClassName}>
          <FontAwesomeIcon size="lg" icon={icon} />
        </div>
      )}

      <Text>{label}</Text>
    </div>
  );
};
