import { Item } from "../../../Types/types";
import styles from "./ItemCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faEye,
  faEyeSlash,
  faTrash,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import Text from "../../Atoms/Text";
import { useEffect, useState } from "react";

type ItemCardType = {
  item: Item;
  handleDeleteClick: (id: string) => void;
  handleUpdateClick: (id: string) => void;
  handleChangeVisibilityClick: (id: string, visibleStatus: boolean) => void;
};

export default function ItemCard({
  item,
  handleDeleteClick,
  handleUpdateClick,
  handleChangeVisibilityClick,
}: ItemCardType) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 720);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 720);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  console.log(window.innerWidth);

  return (
    <div
      className={`${styles.container} ${
        item.isVisible === false && styles.invisibleItem
      }`}
    >
      <div className={styles.itemImage}>
        {item.photo ? (
          <div style={{ backgroundImage: `url("${item.photo}")` }} />
        ) : (
          <FontAwesomeIcon
            size={window.innerWidth > 720 ? "3x" : "xl"}
            icon={faImages}
            color="black"
          />
        )}
      </div>
      {isLargeScreen ? (
        <div className={styles.itemInfo}>
          <div className={styles.itemTitle}>
            <Text fontWeight="semibold" fontSize="mediumLarge">
              {item.name}
            </Text>
          </div>
          <div>
            <span>
              <Text fontWeight="medium" fontSize="medium">
                Código:
              </Text>
              <Text fontWeight="regular" fontSize="mediumSmall">
                {item.cod_item}
              </Text>
            </span>
            <span>
              <Text fontWeight="medium" fontSize="medium">
                Quantidade:
              </Text>
              <Text fontWeight="regular" fontSize="mediumSmall">
                {item.quantity}
              </Text>
            </span>
            <span>
              <Text fontWeight="medium" fontSize="medium">
                Tipo:
              </Text>
              <Text fontWeight="regular" fontSize="mediumSmall">
                {item.type}
              </Text>
            </span>
            <span>
              <Text fontWeight="medium" fontSize="medium">
                Valor:
              </Text>
              <Text fontWeight="regular" fontSize="mediumSmall">
                R$ {item.value}
              </Text>
            </span>
          </div>
        </div>
      ) : (
        <div className={styles.itemInfo}>
          <Text fontWeight="semibold" fontSize="mediumSmall">
            {item.name}
          </Text>
          <span>
            <Text fontWeight="medium" fontSize="mediumSmall">
              Código:
            </Text>
            <Text fontWeight="regular" fontSize="small">
              {item.cod_item}
            </Text>
          </span>
          <span>
            <Text fontWeight="medium" fontSize="mediumSmall">
              Quantidade:
            </Text>
            <Text fontWeight="regular" fontSize="small">
              {item.quantity}
            </Text>
          </span>
        </div>
      )}
      <div className={styles.itemManage}>
        {item.isVisible ? (
          <FontAwesomeIcon
            onClick={() =>
              handleChangeVisibilityClick(
                item._id ? item._id : "",
                !item.isVisible
              )
            }
            size={isLargeScreen ? "lg" : "sm"}
            icon={faEye}
            color="black"
          />
        ) : (
          <FontAwesomeIcon
            onClick={() =>
              handleChangeVisibilityClick(
                item._id ? item._id : "",
                !item.isVisible
              )
            }
            size={isLargeScreen ? "lg" : "sm"}
            icon={faEyeSlash}
            color="black"
          />
        )}
        <FontAwesomeIcon
          onClick={() => handleUpdateClick(item._id ? item._id : "")}
          size={isLargeScreen ? "lg" : "sm"}
          icon={faPenToSquare}
          color="black"
          className={styles.updateIcon}
        />
        <FontAwesomeIcon
          onClick={() => handleDeleteClick(item._id ? item._id : "")}
          size={isLargeScreen ? "lg" : "sm"}
          icon={faTrash}
          color="black"
          className={styles.deleteIcon}
        />
      </div>
    </div>
  );
}
