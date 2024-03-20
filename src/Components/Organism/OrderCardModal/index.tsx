import { MouseEvent } from "react";
import styles from "./OrderCardModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Order } from "../../../Types/types";
import OrderCard from "../OrderCard";

type ModalType = {
  isOpen: boolean;
  order: Order | undefined;
  onClose: VoidFunction;
  onClickCancelOrder?: (id: string | undefined) => void;
  onClickDeleteOrder?: (id: string | undefined) => void;
  onClickFinishOrder?: (order: Order | undefined) => void;
};

export default function OrderCardModal({
  onClose,
  isOpen,
  order,
  onClickCancelOrder,
  onClickDeleteOrder,
  onClickFinishOrder,
}: ModalType) {
  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  return (
    <>
      {isOpen && order && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            {order.status === "finished" || order.status === "canceled" ? (
              <OrderCard
                order={order}
                onClickDeleteOrder={onClickDeleteOrder}
              />
            ) : (
              <OrderCard
                order={order}
                onClickCancelOrder={onClickCancelOrder}
                onClickFinishOrder={onClickFinishOrder}
              />
            )}
          </div>
          <FontAwesomeIcon
            onClick={onClose}
            className={styles.closeModalIcon}
            size="lg"
            icon={faXmark}
          />
        </div>
      )}
    </>
  );
}
