import { Order } from "../../../Types/types";
import Text from "../../Atoms/Text";
import styles from "./OrderMobileCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

type OrderMobileCardType = {
  order: Order;
  setIsOrderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentClickedItem: React.Dispatch<
    React.SetStateAction<Order | undefined>
  >;
};

export default function OrderMobileCard({
  order,
  setIsOrderModalOpen,
  setCurrentClickedItem,
}: OrderMobileCardType) {
  return (
    <div className={styles.container}>
      <Text
        fontColor={
          order.status === "canceled"
            ? "invalid-color"
            : order.status === "finished"
            ? "primary-color"
            : "main-white"
        }
        fontSize="extraLarge"
        fontWeight="bold"
      >
        {order.order_number}
      </Text>
      <div
        className={`${styles.orderContent} ${
          order.status === "canceled" && styles.isCanceled
        } ${order.status === "finished" && styles.isFinished}`}
      >
        <FontAwesomeIcon
          size="sm"
          icon={faArrowUpRightFromSquare}
          color="black"
          className={styles.openModalIcon}
          onClick={() => {
            setIsOrderModalOpen(true);
            setCurrentClickedItem(order);
          }}
        />
        <Text
          fontWeight="semibold"
          fontSize="mediumLarge"
          fontColor="background-secondary-color"
        >
          Vaga {order.spot}
        </Text>
        <Text fontColor="background-secondary-color">
          <Text fontWeight="semibold" fontColor="background-secondary-color">
            Valor total:{" "}
          </Text>
          R$ {(order.total_value + order.service_fee).toFixed(2)}
        </Text>
      </div>
    </div>
  );
}
