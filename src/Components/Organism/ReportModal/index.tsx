import { MouseEvent, useEffect, useState } from "react";
import styles from "./ReportModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { AdditionalItem, Item, Order } from "../../../Types/types";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import Button from "../../Atoms/Button";
import Text from "../../Atoms/Text";
import {
  connectWithPrinter,
  printDailyReport,
} from "../../../Services/printer";
import CheckBox from "../../Atoms/CheckBox";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
};

type GroupedItems = {
  allItems: {
    [codItem: string]: {
      name: string;
      quantity: number;
      cod_item: string;
      additional: string | undefined;
      additional_drink: string | undefined;
      additional_sauce: string | undefined;
      additional_sweet: string | undefined;
    }[];
  };
};

export default function ReportModal({ onClose, isOpen }: ModalType) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  useEffect(() => {
    connectWithPrinter(setConnectedPrinter);
  }, []);

  const groupItemsByServiceFee = (orders: Order[]): GroupedItems => {
    const groupedItems: GroupedItems = { allItems: {} };

    const finishedOrders = orders.filter(
      (order) => order.status === "finished"
    );

    finishedOrders.forEach((order) => {
      order.items.forEach((itemInOrder) => {
        const {
          additional,
          additional_drink,
          additional_sauce,
          additional_sweet,
        } = itemInOrder;

        const { cod_item, name } = itemInOrder.item;

        // Aqui a quantidade correta (1 por padrão)
        const quantity = 1;

        if (!groupedItems.allItems[cod_item]) {
          groupedItems.allItems[cod_item] = [];
        }

        const existingItem = groupedItems.allItems[cod_item].find(
          (i) =>
            i.additional === additional &&
            i.additional_drink === additional_drink &&
            i.additional_sauce === additional_sauce &&
            i.additional_sweet === additional_sweet
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          groupedItems.allItems[cod_item].push({
            name,
            quantity,
            cod_item,
            additional,
            additional_drink,
            additional_sauce,
            additional_sweet,
          });
        }
      });
    });

    return groupedItems;
  };

  const getAdditionalItemsToDetailedReport = (
    itemsByCodeitem: GroupedItems["allItems"][string]
  ): string[] => {
    const additionalGrouped: Record<string, Record<string, number>> = {};

    itemsByCodeitem.forEach((item) => {
      const additions = [
        { category: "Adicional", value: item.additional },
        { category: "Molho", value: item.additional_sauce },
        { category: "Bebida", value: item.additional_drink },
        { category: "Doce", value: item.additional_sweet },
      ] as const;

      additions.forEach(({ category, value }) => {
        const validValue = value?.trim();
        if (validValue) {
          if (!additionalGrouped[category]) {
            additionalGrouped[category] = {};
          }

          // soma usando a quantidade do item
          additionalGrouped[category][validValue] =
            (additionalGrouped[category][validValue] || 0) + item.quantity;
        }
      });
    });

    return Object.entries(additionalGrouped).map(([category, items]) => {
      const formattedItems = Object.entries(items)
        .map(([name, count]) => `${count}x ${name}`)
        .join(", ");
      return `${category}: ${formattedItems}`;
    });
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
    const totalPix = finishedOrders.reduce(
      (acc, order) => acc + order.pix_payment,
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
    const totalDiscount = finishedOrders.reduce(
      (acc, order) => acc + order.discount,
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
    return {
      totalMoney,
      totalPix,
      totalCredit,
      totalDebit,
      subtotal,
      serviceFee,
      total,
      totalDiscount,
    };
  };

  // Chamar a função para calcular as somas
  const {
    totalMoney,
    totalPix,
    totalCredit,
    totalDebit,
    subtotal,
    serviceFee,
    total,
    totalDiscount,
  } = calculateSums();

  const groupedItems = groupItemsByServiceFee(orders);

  const handlePrintReport = (isDetailedReport = false) => {
    printDailyReport(
      connectedPrinter,
      calculateSums(),
      groupedItems,
      isDetailedReport
    );
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
                <strong>Total em pix:</strong> R$ {totalPix.toFixed(2)}
              </Text>
              <Text>
                <strong>Total em crédito:</strong> R$ {totalCredit.toFixed(2)}
              </Text>
              <Text>
                <strong>Total em débito:</strong> R$ {totalDebit.toFixed(2)}
              </Text>
              {/* <Text>
                <strong>Total em descontos:</strong> R${" "}
                {totalDiscount.toFixed(2)}
              </Text> */}
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

                {showDetailedReport ? (
                  <>
                    {Object.entries(groupedItems.allItems)
                      .sort(
                        ([, itemsA], [, itemsB]) =>
                          itemsB.reduce((sum, i) => sum + i.quantity, 0) -
                          itemsA.reduce((sum, i) => sum + i.quantity, 0)
                      )
                      .map(([codItem, items]) => {
                        const totalQuantity = items.reduce(
                          (sum, i) => sum + i.quantity,
                          0
                        );

                        const additionalReport =
                          getAdditionalItemsToDetailedReport(items);

                        return (
                          <div key={codItem}>
                            <Text fontSize="mediumSmall">
                              {totalQuantity}x {items[0].name} ({" "}
                              {items[0].cod_item} )
                            </Text>
                            <br />
                            <div
                              style={{
                                whiteSpace: "pre-line",
                                fontSize: "0.8rem",
                                marginBottom: "4px",
                              }}
                            >
                              {additionalReport.length
                                ? additionalReport.join("\n") + "\n"
                                : ""}
                            </div>
                          </div>
                        );
                      })}
                  </>
                ) : (
                  <>
                    {Object.entries(groupedItems.allItems)
                      .sort(
                        ([, itemsA], [, itemsB]) =>
                          itemsB.reduce((sum, i) => sum + i.quantity, 0) -
                          itemsA.reduce((sum, i) => sum + i.quantity, 0)
                      )
                      .map(([codItem, items]) => {
                        const totalQuantity = items.reduce(
                          (sum, i) => sum + i.quantity,
                          0
                        );

                        return (
                          <div key={codItem}>
                            <Text fontSize="mediumSmall">
                              {totalQuantity}x {items[0].name} ({" "}
                              {items[0].cod_item} )
                            </Text>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            </div>
            <div className={styles.buttons}>
              {/* <Button
                onClick={() => onClose()}
                label="Fechar"
                backGroundColor="invalid-color"
              /> */}
              {!connectedPrinter && (
                <div className={styles.printButtons}>
                  <Button
                    onClick={() => handlePrintReport(false)}
                    label="Imprimir"
                  />
                  <Button
                    onClick={() => handlePrintReport(true)}
                    label="Imprimir Detalhado"
                  />

                  <div className={styles.detailedCheckbox}>
                    <CheckBox
                      checked={showDetailedReport}
                      onChange={() =>
                        setShowDetailedReport(!showDetailedReport)
                      }
                      id="showDetailedReport"
                    />
                    Mostrar relatório detalhado
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
