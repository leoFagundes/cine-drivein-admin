import { ItemInOrder, Order } from "../../../Types/types";
import Text from "../../Atoms/Text";
import styles from "./OrderCard.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faTrash,
  faPrint,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../Atoms/Button";
import { useEffect, useState } from "react";
import { connectWithPrinter, printOrder } from "../../../Services/printer";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

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

export default function OrderCard({
  order,
  onClickCancelOrder,
  onClickDeleteOrder,
  onClickFinishOrder,
}: OrderCardType) {
  const createdAtDate = new Date(order.createdAt ? order.createdAt : "");

  const hora = createdAtDate.getHours().toString().padStart(2, "0");
  const minuto = createdAtDate.getMinutes().toString().padStart(2, "0");
  const segundo = createdAtDate.getSeconds().toString().padStart(2, "0");
  const horaFormatada = `${hora}:${minuto}:${segundo}`;

  const [connectedPrinter, setConnectedPrinter] = useState(null);

  const [alreadyPrinted, setAlreadyPrinted] = useState(() => {
    const storedList = localStorage.getItem("listAlreadyPrinted");
    return storedList ? JSON.parse(storedList) : [];
  });

  useEffect(() => {
    connectWithPrinter(setConnectedPrinter);
  }, []);

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

  const renderOrderItems = (groupedOrderItems: GroupedOrderItem[]) => {
    return (
      <div className={styles.orderItems}>
        {groupedOrderItems.map((groupedOrderItem, index) => (
          <div key={index} className={styles.orderItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemImage}>
                {groupedOrderItem.item.photo ? (
                  <div
                    style={{
                      backgroundImage: `url("${groupedOrderItem.item.photo}")`,
                    }}
                  />
                ) : (
                  <FontAwesomeIcon size="xl" icon={faImages} color="black" />
                )}
              </div>
              <Text
                fontWeight="semibold"
                fontSize="mediumSmall"
                fontColor="background-secondary-color"
                fontAlign="left"
              >
                {groupedOrderItem.quantity}x {groupedOrderItem.item.name}
              </Text>
            </div>
            <div className={styles.itemInfo}>
              {groupedOrderItem.observations.map((observation, index) => (
                <Text
                  key={index}
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                  fontAlign="left"
                >
                  <strong>Observação:</strong> {observation}
                </Text>
              ))}
              {groupedOrderItem.additional && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Adicional:</strong> {groupedOrderItem.additional}
                </Text>
              )}
              {groupedOrderItem.additional_sauce && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Molho:</strong> {groupedOrderItem.additional_sauce}
                </Text>
              )}
              {groupedOrderItem.additional_drink && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Bebida:</strong> {groupedOrderItem.additional_drink}
                </Text>
              )}
              {groupedOrderItem.additional_sweet && (
                <Text
                  fontWeight="medium"
                  fontSize="mediumSmall"
                  fontColor="background-secondary-color"
                >
                  <strong>Doce:</strong> {groupedOrderItem.additional_sweet}
                </Text>
              )}
              <Text
                fontWeight="medium"
                fontSize="mediumSmall"
                fontColor="background-secondary-color"
              >
                <strong>Valor:</strong> R${" "}
                {groupedOrderItem.totalValue.toFixed(2)}
              </Text>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handlePrinter = () => {
    connectWithPrinter(setConnectedPrinter);
    // console.log("imprimir aqui", order.spot);
    printOrder(connectedPrinter, order, groupOrderItems(order.items));

    if (!alreadyPrinted.includes(order._id)) {
      setAlreadyPrinted([...alreadyPrinted, order._id]);
      localStorage.setItem(
        "listAlreadyPrinted",
        JSON.stringify([...alreadyPrinted, order._id])
      );
    }
  };

  const handleGoToWhatsappChat = () => {
    const phoneClean = order.phone.replace(/\D/g, "");
    window.open(
      `http://api.whatsapp.com/send?1=pt_BR&phone=+55${phoneClean}`,
      "_blank"
    );
  };

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
        } ${order.status === "finished" && styles.isFinished} `}
      >
        <div className={styles.orderInfo}>
          <Text
            fontSize="mediumLarge"
            fontWeight="semibold"
            fontColor="background-secondary-color"
          >
            Vaga {order.spot}{" "}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Nome:</strong> {order.username}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Telefone:</strong> {order.phone}
          </Text>
          <Text fontSize="small" fontColor="background-secondary-color">
            Criado em {horaFormatada}
          </Text>
        </div>
        <div className={styles.line} />
        {order.items && renderOrderItems(groupOrderItems(order.items))}
        <div className={styles.line} />
        <div className={styles.orderValue}>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Valor:</strong> R$ {order.total_value.toFixed(2)}
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Taxa de serviço:</strong>{" "}
            <Text
              fontSize="mediumSmall"
              fontColor={
                order.status === "finished"
                  ? order.service_fee_paid
                    ? "primary-color"
                    : "invalid-color"
                  : "background-secondary-color"
              }
            >
              R$ {order.service_fee.toFixed(2)}
            </Text>
          </Text>
          <Text fontSize="mediumSmall" fontColor="background-secondary-color">
            <strong>Valor total:</strong> R${" "}
            {(order.total_value + order.service_fee).toFixed(2)}
          </Text>
        </div>
        {order.status === "active" && (
          <div className={styles.buttons}>
            <Button
              onClick={() =>
                onClickCancelOrder ? onClickCancelOrder(order._id) : ""
              }
              label="Cancelar pedido"
              backGroundColor="invalid-color"
              marginTop="0"
            />
            <Button
              onClick={() =>
                onClickFinishOrder ? onClickFinishOrder(order) : ""
              }
              label="Finalizar pedido"
              marginTop="0"
            />
          </div>
        )}
        {order.status === "finished" && (
          <Text fontColor="primary-color" fontWeight="bold">
            PEDIDO FINALIZADO
          </Text>
        )}
        {order.status === "canceled" && (
          <Text fontColor="invalid-color" fontWeight="bold">
            PEDIDO CANCELADO
          </Text>
        )}

        <div className={styles.orderIcons}>
          {order.status === "active" && connectedPrinter && (
            <FontAwesomeIcon
              className={styles.printIcon}
              onClick={handlePrinter}
              size="lg"
              icon={faPrint}
              color="black"
              title="Imprimir comanda"
            />
          )}
          {(order.status === "canceled" || order.status === "finished") && (
            <FontAwesomeIcon
              className={styles.deleteIcon}
              onClick={() =>
                onClickDeleteOrder ? onClickDeleteOrder(order._id) : ""
              }
              size="lg"
              icon={faTrash}
              color="black"
            />
          )}
          <FontAwesomeIcon
            className={styles.wppIcon}
            onClick={handleGoToWhatsappChat}
            size="lg"
            icon={faWhatsapp}
            color="black"
            title={`Iniciar conversa com ${order.username}`}
          />
        </div>
      </div>
    </div>
  );
}
