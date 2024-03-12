import { useEffect, useState } from "react";
import Text from "../../Components/Atoms/Text";
import styles from "./Orders.module.scss";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import OrdersTemplate from "../../Components/Templates/OrdersTemplate";
import OrderRepositories from "../../Services/repositories/OrderRepositories";
import { Order } from "../../Types/types";

const UPDATE_TIME = 15;

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

  useEffect(() => {
    setIsLoading(true);
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
                console.log("imprimrir aqui", newOrder.spot);
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

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.orderContainer}>
      <OrdersTemplate
        orders={orders}
        setOrders={setOrders}
        setAlreadyPrinted={setAlreadyPrinted}
      />
      <Timer seconds={UPDATE_TIME} reset={fetchCompleted} />{" "}
    </section>
  );
}
