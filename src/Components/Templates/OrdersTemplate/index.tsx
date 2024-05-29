import { useState, useEffect } from "react";
import { Order } from "../../../Types/types";
import styles from "./OrdersTemplate.module.scss";
import Text from "../../Atoms/Text";
import OrderCard from "../../Organism/OrderCard";
import { Input } from "../../Atoms/Input/Input";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import { LoadingFullScreenTemplate } from "../LoadingFullScreenTemplate";
import Alert from "../../Molecules/Alert";
import DeleteModal from "../../Organism/DeleteModal";
import FinishOrderModal from "../../Organism/FinishOrderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faTrash,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import OrderMobileCard from "../../Organism/OrderMobileCard";
import OrderCardModal from "../../Organism/OrderCardModal";
import Button from "../../Atoms/Button";

type OrdersType = {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  setAlreadyPrinted: React.Dispatch<any>;
};

const CANCEL_ORDER_MESSAGE = "Pedido cancelado com sucesso.";
const DELETE_ORDER_MESSAGE = "Pedido deletado com sucesso.";
const CANCEL_ALL_ORDERS_MESSAGE = "Pedidos cancelados com sucesso.";
const DELETE_ALL_CANCELED_ORDERS_MESSAGE =
  "Pedidos cancelados excluídos com sucesso.";

export default function OrdersTemplate({
  orders,
  setOrders,
  setAlreadyPrinted,
}: OrdersType) {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState({
    activeOrders: true,
    finishedCanceledOrders: false,
  });
  const [curretnClickedItem, setCurrentClickedItem] = useState<Order>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [isCancelAllOrdensModalOpen, setIsCancelAllOrdensModalOpen] =
    useState(false);
  const [
    isDeleteAllCanceledOrdersModalOpen,
    setIsDeleteAllCanceledOrdersModalOpen,
  ] = useState(false);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchSpot, setSearchSpot] = useState("");
  const [searchOrderNumber, setSearchOrderNumber] = useState("");
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });

  const showAlert = (message: string, type: string) => {
    setAlertInfo({
      isOpen: true,
      message: message,
      type: type,
    });
  };

  const closeAlert = () => {
    setAlertInfo({
      isOpen: false,
      message: "",
      type: "",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchSpot = order.spot.toString().includes(searchSpot);
      const matchOrderNumber = order.order_number
        .toString()
        .includes(searchOrderNumber);
      return matchSpot && matchOrderNumber;
    });
    setFilteredOrders(filtered);
  }, [orders, searchSpot, searchOrderNumber, isActive]);

  const onClickDeleteAllCanceledOrders = async () => {
    setIsLoading(true);
    try {
      // Filtra todas as ordens canceladas
      const canceledOrders = orders.filter(
        (order) => order.status === "canceled"
      );

      // Deleta cada ordem cancelada
      for (let i = 0; i < canceledOrders.length; i++) {
        const id = canceledOrders[i]._id;
        if (id) {
          await OrderRepositories.deleteOrder(id);
        }
      }

      // Atualiza o estado das ordens removendo as ordens canceladas
      const updatedOrders = orders.filter(
        (order) => order.status !== "canceled"
      );
      setOrders(updatedOrders);

      // Remove IDs das ordens deletadas de alreadyPrinted
      setAlreadyPrinted((prevList: string[]) =>
        prevList.filter(
          (id) => !canceledOrders.some((order) => order._id === id)
        )
      );

      setIsOrderModalOpen(false);
      setIsDeleteModalOpen(false);
      setIsLoading(false);

      showAlert(DELETE_ALL_CANCELED_ORDERS_MESSAGE, "success");
    } catch (error) {
      console.error("Erro ao deletar os pedidos cancelados:", error);
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const onClickDeleteOrder = async (id: string | undefined) => {
    if (id) {
      setIsLoading(true);
      try {
        await OrderRepositories.deleteOrder(id);

        setAlreadyPrinted((prevList: string[]) =>
          prevList.filter((item) => item !== id)
        );

        const updatedOrders = orders.filter((order) => order._id !== id);
        setOrders(updatedOrders);
        setIsOrderModalOpen(false);
        setIsLoading(false);
        showAlert(DELETE_ORDER_MESSAGE, "success");
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Erro ao deletar o pedido:", error);
        setIsLoading(false);
        setIsDeleteModalOpen(false);
      }
    }
  };

  const onClickCancelAllOrders = async () => {
    setIsLoading(true);
    try {
      const cancelOrders = orders.filter((order) => order.status === "active");

      // Cancelar todas as ordens ativas
      for (let i = 0; i < cancelOrders.length; i++) {
        const id = cancelOrders[i]._id;
        if (id) {
          await OrderRepositories.updateOrder(id, {
            status: "canceled",
          });
        }
      }

      // Atualizar o estado das ordens
      const updatedOrders = orders.map((order) =>
        order.status === "active" ? { ...order, status: "canceled" } : order
      ) as Order[]; // Certifique-se de que o tipo é Order[]

      setOrders(updatedOrders);
      setIsOrderModalOpen(false);
      setIsLoading(false);
      showAlert(CANCEL_ALL_ORDERS_MESSAGE, "success");
    } catch (error) {
      console.error("Erro ao cancelar os pedidos:", error);
      setIsLoading(false);
    }
  };

  const onClickCancelOrder = async (id: string | undefined) => {
    if (id) {
      setIsLoading(true);
      try {
        await OrderRepositories.updateOrder(id, { status: "canceled" });
        const updatedOrders = orders.filter((order) => order._id !== id);
        setOrders(updatedOrders);
        setIsOrderModalOpen(false);
        setIsLoading(false);
        showAlert(CANCEL_ORDER_MESSAGE, "success");
      } catch (error) {
        console.error("Erro ao cancelar o pedido:", error);
        setIsLoading(false);
      }
    }
  };

  const onClickFinishOrder = (order: Order | undefined) => {
    if (order) {
      setIsFinishModalOpen(true);
      setCurrentClickedItem(order);
    }
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <div className={styles.container}>
      <div className={styles.manageVisibilyState}>
        <div
          onClick={() => {
            setIsActive({
              activeOrders: true,
              finishedCanceledOrders: false,
            });
          }}
          className={`${isActive.activeOrders ? styles.isActive : ""} ${
            styles.manageViewCard
          }`}
        >
          <Text fontWeight="semibold">Pedidos Ativos</Text>
        </div>
        <div
          onClick={() => {
            setIsActive({
              activeOrders: false,
              finishedCanceledOrders: true,
            });
          }}
          className={`${
            isActive.finishedCanceledOrders ? styles.isActive : ""
          } ${styles.manageViewCard}`}
        >
          <Text fontWeight="semibold">Pedidos Finalizados</Text>
        </div>
      </div>
      <div className={styles.ordersContent}>
        {isActive.activeOrders ? (
          <div
            onClick={() => setIsCancelAllOrdensModalOpen(true)}
            className={styles.cancelDeleteOrdersLink}
          >
            <FontAwesomeIcon size="sm" icon={faBan} />
            <Text fontColor="gray-color" isLink>
              Cancelar todos os pedidos{" "}
            </Text>
          </div>
        ) : (
          <div
            onClick={() => setIsDeleteAllCanceledOrdersModalOpen(true)}
            className={styles.cancelDeleteOrdersLink}
          >
            <FontAwesomeIcon size="sm" icon={faTrash} />
            <Text fontColor="gray-color" isLink>
              Excluir pedidos cancelados
            </Text>
          </div>
        )}
        <div className={styles.filterInputs}>
          <Input
            type="number"
            placeholder="Filtrar por vaga"
            value={searchSpot}
            onChange={(e) => setSearchSpot(e.target.value)}
          />
          {windowWidth >= 721 && (
            <Input
              type="number"
              placeholder="Filtrar por número do pedido"
              value={searchOrderNumber}
              onChange={(e) => setSearchOrderNumber(e.target.value)}
            />
          )}
        </div>
        <div className={styles.orderItems}>
          {isActive.activeOrders &&
          filteredOrders.filter((order) => order.status === "active").length >
            0 ? (
            filteredOrders
              .filter((order) => order.status === "active")
              .map((order, index) => (
                <div key={index}>
                  {windowWidth >= 721 ? (
                    <OrderCard
                      order={order}
                      onClickCancelOrder={onClickCancelOrder}
                      onClickFinishOrder={onClickFinishOrder}
                    />
                  ) : (
                    <OrderMobileCard
                      order={order}
                      setIsOrderModalOpen={setIsOrderModalOpen}
                      setCurrentClickedItem={setCurrentClickedItem}
                    />
                  )}
                </div>
              ))
          ) : (
            <div className={styles.noContent}>
              {isActive.activeOrders && (
                <Text fontSize="mediumLarge" fontWeight="semibold">
                  <FontAwesomeIcon
                    className={styles.closeModalIcon}
                    size="2xl"
                    icon={faTriangleExclamation}
                  />{" "}
                  Não há pedidos ativos no momento.
                </Text>
              )}
            </div>
          )}
          {isActive.finishedCanceledOrders &&
          filteredOrders.filter(
            (order) =>
              order.status === "finished" || order.status === "canceled"
          ).length > 0 ? (
            filteredOrders
              .filter(
                (order) =>
                  order.status === "finished" || order.status === "canceled"
              )
              .map((order, index) => (
                <div key={index}>
                  {windowWidth >= 721 ? (
                    <OrderCard
                      order={order}
                      onClickDeleteOrder={() => {
                        setIsDeleteModalOpen(true);
                        setCurrentClickedItem(order);
                      }}
                    />
                  ) : (
                    <OrderMobileCard
                      order={order}
                      setIsOrderModalOpen={setIsOrderModalOpen}
                      setCurrentClickedItem={setCurrentClickedItem}
                    />
                  )}
                </div>
              ))
          ) : (
            <div className={styles.noContent}>
              {isActive.finishedCanceledOrders && (
                <Text fontSize="mediumLarge" fontWeight="semibold">
                  <FontAwesomeIcon
                    className={styles.closeModalIcon}
                    size="2xl"
                    icon={faTriangleExclamation}
                  />{" "}
                  Não há pedidos finalizados ou cancelados no momento.
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        onClick={() =>
          onClickDeleteOrder(
            curretnClickedItem?._id ? curretnClickedItem._id : ""
          )
        }
        itemType="pedido"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
      <DeleteModal
        onClick={() => {
          onClickCancelAllOrders();
          setIsCancelAllOrdensModalOpen(false);
        }}
        itemType="conjunto de pedidos ativos"
        onClose={() => setIsCancelAllOrdensModalOpen(false)}
        isOpen={isCancelAllOrdensModalOpen}
        impactLabel="cancelar"
        buttonLabel="Cancelar Pedidos"
      />
      <DeleteModal
        onClick={() => {
          onClickDeleteAllCanceledOrders();
          setIsDeleteAllCanceledOrdersModalOpen(false);
        }}
        itemType="conjunto de pedidos ativos"
        onClose={() => setIsDeleteAllCanceledOrdersModalOpen(false)}
        isOpen={isDeleteAllCanceledOrdersModalOpen}
      />
      <OrderCardModal
        isOpen={isOrderModalOpen}
        order={curretnClickedItem}
        onClose={() => setIsOrderModalOpen(false)}
        onClickCancelOrder={onClickCancelOrder}
        onClickFinishOrder={onClickFinishOrder}
        onClickDeleteOrder={() => {
          setIsDeleteModalOpen(true);
        }}
      />
      <FinishOrderModal
        orderData={curretnClickedItem}
        orders={orders}
        setOrders={setOrders}
        onClose={() => setIsFinishModalOpen(false)}
        isOpen={isFinishModalOpen}
        showAlert={showAlert}
      />
      <Alert
        isAlertOpen={alertInfo.isOpen}
        setIsAlertOpen={closeAlert}
        message={alertInfo.message}
        alertDisplayTime={3000}
        onClose={closeAlert}
        type={alertInfo.type}
      />
    </div>
  );
}
