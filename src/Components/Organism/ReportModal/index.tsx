import { MouseEvent, useEffect, useState } from "react";
import styles from "./ReportModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Order } from "../../../Types/types";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import Button from "../../Atoms/Button";
import Text from "../../Atoms/Text";
import {
  connectWithPrinter,
  printDailyReport,
} from "../../../Services/printer";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
};

type GroupedItems = {
  allItems: {
    [codItem: string]: { name: string; quantity: number; cod_item: string }[];
  };
};

export default function ReportModal({ onClose, isOpen }: ModalType) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState(null);

  useEffect(() => {
    connectWithPrinter(setConnectedPrinter);
  }, []);

  const groupItemsByServiceFee = (orders: Order[]): GroupedItems => {
    const groupedItems: GroupedItems = {
      allItems: {},
    };

    // Filtra apenas as orders com status "finished"
    const finishedOrders = orders.filter(
      (order) => order.status === "finished"
    );

    finishedOrders.forEach((order) => {
      order.items.forEach((itemInOrder) => {
        const { cod_item, name, quantity } = itemInOrder.item;

        if (!groupedItems.allItems[cod_item]) {
          groupedItems.allItems[cod_item] = [];
        }

        groupedItems.allItems[cod_item].push({ name, quantity, cod_item });
      });
    });

    return groupedItems;
  };

  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersRequest = await OrderRepositories.getOrders();
        setOrders(ordersRequest);
        console.log("Pedidos carregados com sucesso.");
      } catch (error) {
        console.error(
          "Erro ao carregar os pedidos para o relatório final.",
          error
        );
      }
    };

    fetchOrders();
  }, []);

  // Função para calcular as somas
  const calculateSums = () => {
    // Filtra as ordens nos estados "finished" e "canceled"
    const finishedOrders = orders.filter(
      (order) => order.status === "finished"
    );

    // Calcula as somas
    const totalMoney = finishedOrders.reduce(
      (acc, order) => acc + order.money_payment,
      0
    );
    const totalCredit = finishedOrders.reduce(
      (acc, order) => acc + order.credit_payment,
      0
    );
    const totalDebit = finishedOrders.reduce(
      (acc, order) => acc + order.debit_payment,
      0
    );
    const subtotal = finishedOrders.reduce(
      (acc, order) => acc + order.total_value,
      0
    );
    const serviceFee = finishedOrders.reduce(
      (acc, order) => acc + (order.service_fee_paid ? order.service_fee : 0),
      0
    );
    const total = subtotal + serviceFee;

    // Retornar as somas calculadas
    return { totalMoney, totalCredit, totalDebit, subtotal, serviceFee, total };
  };

  // Chamar a função para calcular as somas
  const { totalMoney, totalCredit, totalDebit, subtotal, serviceFee, total } =
    calculateSums();

  const groupedItems = groupItemsByServiceFee(orders);

  const handlePrintReport = () => {
    printDailyReport(connectedPrinter, calculateSums(), groupedItems);
  };

  return (
    <>
      {isOpen && orders && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            <FontAwesomeIcon
              onClick={onClose}
              className={styles.closeModalIcon}
              size="lg"
              icon={faXmark}
            />
            <Text fontWeight="bold" fontSize="large">
              Relatório diário
            </Text>
            <div className={styles.infoReport}>
              <Text>
                <strong>Total em dinheiro:</strong> R$ {totalMoney.toFixed(2)}
              </Text>
              <Text>
                <strong>Total em crédito:</strong> R$ {totalCredit.toFixed(2)}
              </Text>
              <Text>
                <strong>Total em débito:</strong> R$ {totalDebit.toFixed(2)}
              </Text>
              <Text>
                <strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}
              </Text>
              <Text>
                <strong>Taxa de serviço:</strong> R$ {serviceFee.toFixed(2)}
              </Text>
              <Text>
                <strong>Total:</strong> R$ {total.toFixed(2)}
              </Text>
            </div>

            <div className={styles.infoItemReport}>
              <div>
                <Text fontSize="mediumLarge" fontWeight="bold">
                  Itens dos pedidos finalizados
                </Text>
                {Object.entries(groupedItems.allItems).map(
                  ([codItem, items]) => (
                    <div key={codItem}>
                      <Text fontSize="mediumSmall">
                        {items.length}x {items[0].name} ( {items[0].cod_item} )
                      </Text>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className={styles.buttons}>
              <Button
                onClick={() => onClose()}
                label="Fechar"
                backGroundColor="invalid-color"
              />
              {connectedPrinter && (
                <Button onClick={handlePrintReport} label="Imprimir" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
