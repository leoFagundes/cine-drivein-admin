import { useEffect, useState } from "react";
import Text from "../../Components/Atoms/Text";
import styles from "./Orders.module.scss";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import OrdersTemplate from "../../Components/Templates/OrdersTemplate";
import OrderRepositories from "../../Services/repositories/OrderRepositories";
import { Order, ItemInOrder } from "../../Types/types";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";
import { connectWithPrinter, printOrder } from "../../Services/printer";

const UPDATE_TIME = 15;

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

function Timer({ seconds, reset }: { seconds: number; reset: boolean }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [reset, seconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : seconds));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return (
    <div className={styles.timer}>
      <Text fontSize="small" fontWeight="semibold">
        Próxima atualização:
      </Text>
      <Text
        fontSize="small"
        fontColor={timeLeft <= 5 ? "invalid-color" : "main-white"}
      >
        {timeLeft} segundos
      </Text>
    </div>
  );
}

export default function Orders() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetchCompleted, setFetchCompleted] = useState(false);
  const [alreadyPrinted, setAlreadyPrinted] = useState(() => {
    const storedList = localStorage.getItem("listAlreadyPrinted");
    return storedList ? JSON.parse(storedList) : [];
  });
  const [connectedPrinter, setConnectedPrinter] = useState(null);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    connectWithPrinter(setConnectedPrinter);
  }, []);

  useEffect(() => {
    localStorage.setItem("listAlreadyPrinted", JSON.stringify(alreadyPrinted));
  }, [alreadyPrinted]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log("Procurando novos pedidos...");
        const fetchedOrders = await OrderRepositories.getOrders();
        setIsLoading(false);
        setFetchCompleted((prev) => !prev);
        if (fetchedOrders.length > orders.length) {
          // Verifica se há novos pedidos
          const newOrders = fetchedOrders.filter(
            (order: Order) => !orders.some((o) => o._id === order._id)
          );
          if (newOrders.length > 0) {
            newOrders.forEach((newOrder: Order) => {
              if (!alreadyPrinted.includes(newOrder._id)) {
                console.log("Novos pedidos recebidos:");
                console.log(newOrder);
                // console.log("imprimir aqui", newOrder.spot);
                printOrder(
                  connectedPrinter,
                  newOrder,
                  groupOrderItems(newOrder.items)
                );
                console.log(groupOrderItems(newOrder.items));
                setAlreadyPrinted((prevAlreadyPrinted: string[]) => [
                  ...prevAlreadyPrinted,
                  newOrder._id,
                ]);
              }
            });
            setIsLoading(true);
            setOrders(fetchedOrders);
          }
        }
      } catch (error) {
        console.error("Erro ao obter itens:", error);
        setIsLoading(false);
      }
    };

    // Define a função para buscar novos pedidos a cada 15 segundos
    const intervalId = setInterval(fetchItems, UPDATE_TIME * 1000);

    // Executa a função uma vez para verificar se há novos pedidos imediatamente após o componente montar
    fetchItems();

    // Retorna uma função de limpeza para cancelar o setInterval quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [orders, alreadyPrinted]);

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
      <Timer seconds={UPDATE_TIME} reset={fetchCompleted} />{" "}
    </section>
  );
}
