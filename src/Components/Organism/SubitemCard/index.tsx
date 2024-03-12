import { AdditionalItem } from "../../../Types/types";
import styles from "./SubitemCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Text from "../../Atoms/Text";

type SubitemCardType = {
  subitem: AdditionalItem;
  handleDeleteClick: (id: string) => void;
};

export default function SubitemCard({
  subitem,
  handleDeleteClick,
}: SubitemCardType) {
  return (
    <div className={styles.container}>
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

      <FontAwesomeIcon
        className={styles.deleteIcon}
        onClick={() => handleDeleteClick(subitem._id ? subitem._id : "")}
        size={"lg"}
        icon={faTrash}
        color="black"
      />
    </div>
  );
}
