import { useEffect, useState } from "react";
import Text from "../../Components/Atoms/Text";
import styles from "./Orders.module.scss";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import OrdersTemplate from "../../Components/Templates/OrdersTemplate";
import OrderRepositories from "../../Services/repositories/OrderRepositories";
import { Order, ItemInOrder } from "../../Types/types";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import { connectWithPrinter, printOrder } from "../../Services/printer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";

const UPDATE_TIME = 3;

type OrderCardType = {
  order: Order;
  onClickCancelOrder?: (id: string | undefined) => void;
  onClickDeleteOrder?: (id: string | undefined) => void;
  onClickFinishOrder?: (order: Order | undefined) => void;
};

type GroupedOrderItem = {
  item: ItemInOrder["item"];
  quantity: number;
  totalValue: number;
  observations: string[];
  additional: string;
  additional_sauce: string;
  additional_drink: string;
  additional_sweet: string;
};

type GroupedItems = {
  [key: string]: {
    quantity: number;
    totalValue: number;
    observations: string[];
    additional: string;
    additional_sauce: string;
    additional_drink: string;
    additional_sweet: string;
  };
};

export default function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  // const [fetchCompleted, setFetchCompleted] = useState(false);
  const [alreadyPrinted, setAlreadyPrinted] = useState(() => {
    const storedList = localStorage.getItem("listAlreadyPrinted");
    return storedList ? JSON.parse(storedList) : [];
  });
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSoundSetting = localStorage.getItem("soundEnabled");
    return savedSoundSetting ? JSON.parse(savedSoundSetting) : true;
  });

  const newOrderSound = new Audio("/assets/audio/neworder.mp3");

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    connectWithPrinter(setConnectedPrinter);
  }, []);

  useEffect(() => {
    localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Procurando novos pedidos...");
        const fetchedOrders = await OrderRepositories.getOrders();
        setIsLoading(false);

        const newOrders = fetchedOrders.filter(
          (order: Order) =>
            !alreadyPrinted.includes(order._id) && order.status === "active"
        );

        if (newOrders.length > 0) {
          console.log("Novos pedidos recebidos: ", newOrders);

          if (soundEnabled) {
            newOrderSound
              .play()
              .catch((error) => console.error("Erro ao tocar o som:", error));
          }
          newOrders.forEach((newOrder: Order) => {
            if (connectedPrinter) {
              // Função de impressão do pedido
              printOrder(
                connectedPrinter,
                newOrder,
                groupOrderItems(newOrder.items)
              );

              const existingPrinted = JSON.parse(
                localStorage.getItem("listAlreadyPrinted") || "[]"
              );

              const updatedPrintedList = [...existingPrinted, newOrder._id];

              localStorage.setItem(
                "listAlreadyPrinted",
                JSON.stringify(updatedPrintedList)
              );

              // Após imprimir, adicionar o pedido à lista de impressos
              setAlreadyPrinted((prev: string[]) => [...prev, newOrder._id]);
            } else {
              console.warn(
                "Impressora não conectada. Tentativa de impressão abortada."
              );
            }
          });
        }
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Erro ao obter itens:", error);
        setIsLoading(false);
      }
    };

    const intervalId = setInterval(fetchItems, UPDATE_TIME * 1000);

    return () => clearInterval(intervalId);
  }, [alreadyPrinted, connectedPrinter, soundEnabled]);

  const groupOrderItems = (orderItems: ItemInOrder[]): GroupedOrderItem[] => {
    const groupedItems: GroupedItems = {};

    orderItems.forEach((orderItem) => {
      const key = JSON.stringify({
        ...orderItem.item,
        observation: orderItem.observation,
        additional: orderItem.additional,
        additional_sauce: orderItem.additional_sauce,
        additional_drink: orderItem.additional_drink,
        additional_sweet: orderItem.additional_sweet,
      });
      if (groupedItems[key]) {
        groupedItems[key].quantity++;
        groupedItems[key].totalValue += orderItem.item.value;
        if (
          orderItem.observation &&
          !groupedItems[key].observations.includes(orderItem.observation)
        ) {
          groupedItems[key].observations.push(orderItem.observation);
        }
      } else {
        groupedItems[key] = {
          quantity: 1,
          totalValue: orderItem.item.value,
          observations: orderItem.observation ? [orderItem.observation] : [],
          additional: orderItem.additional ? orderItem.additional : "",
          additional_sauce: orderItem.additional_sauce
            ? orderItem.additional_sauce
            : "",
          additional_drink: orderItem.additional_drink
            ? orderItem.additional_drink
            : "",
          additional_sweet: orderItem.additional_sweet
            ? orderItem.additional_sweet
            : "",
        };
      }
    });

    return Object.entries(groupedItems).map(([key, value]) => ({
      item: JSON.parse(key),
      quantity: value.quantity,
      totalValue: value.totalValue,
      observations: value.observations,
      additional: value.additional,
      additional_sauce: value.additional_sauce,
      additional_drink: value.additional_drink,
      additional_sweet: value.additional_sweet,
    }));
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.orderContainer}>
      <AccessLimitedToAdmins />
      <OrdersTemplate
        orders={orders}
        setOrders={setOrders}
        setAlreadyPrinted={setAlreadyPrinted}
      />
      <div
        onClick={() => setSoundEnabled(!soundEnabled)}
        className={styles.toggleButtons}
      >
        {soundEnabled ? (
          <div className={styles.icon}>
            <FontAwesomeIcon icon={faMusic} />
          </div>
        ) : (
          <div className={styles.icon}>
            <hr />
            <FontAwesomeIcon icon={faMusic} />
          </div>
        )}
      </div>
    </section>
  );
}
