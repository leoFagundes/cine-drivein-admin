import { AdditionalItem } from "../../../Types/types";
import styles from "./SubitemCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faTrash } from "@fortawesome/free-solid-svg-icons";
import Text from "../../Atoms/Text";

type SubitemCardType = {
  subitem: AdditionalItem;
  handleDeleteClick: (id: string) => void;
  handleChangeVisibilitySubitemClick: (
    id: string,
    visibleStatus: boolean
  ) => void;
};

export default function SubitemCard({
  subitem,
  handleDeleteClick,
  handleChangeVisibilitySubitemClick,
}: SubitemCardType) {
  return (
    <div
      className={`${styles.container} ${
        subitem.isVisible === false && styles.invisibleItem
      }`}
    >
      <div className={styles.subitemInfo}>
        <Text fontWeight="medium" fontColor="background-secondary-color">
          {subitem.name}
        </Text>
        <Text
          fontWeight="regular"
          fontSize="small"
          fontColor="placeholder-color"
        >
          {subitem.description && `(${subitem.description})`}
        </Text>
      </div>
      <div className={styles.icons}>
        {subitem.isVisible ? (
          <FontAwesomeIcon
            onClick={() =>
              handleChangeVisibilitySubitemClick(
                subitem._id ? subitem._id : "",
                !subitem.isVisible
              )
            }
            size={"lg"}
            icon={faEye}
            color="black"
          />
        ) : (
          <FontAwesomeIcon
            onClick={() =>
              handleChangeVisibilitySubitemClick(
                subitem._id ? subitem._id : "",
                !subitem.isVisible
              )
            }
            size={"lg"}
            icon={faEyeSlash}
            color="black"
          />
        )}

        <FontAwesomeIcon
          className={styles.deleteIcon}
          onClick={() => handleDeleteClick(subitem._id ? subitem._id : "")}
          size={"lg"}
          icon={faTrash}
          color="black"
        />
      </div>
    </div>
  );
}
