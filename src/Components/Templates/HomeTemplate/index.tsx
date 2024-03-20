import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../Atoms/Button";
import Text from "../../Atoms/Text";
import styles from "./HomeTemplate.module.scss";
import ScheduleRepositories from "../../../Services/repositories/ScheduleRepositories";
import { Order, Schedule, Statistics } from "../../../Types/types";
import { LoadingFullScreenTemplate } from "../LoadingFullScreenTemplate";
import AccessLimitedToAdmins from "../../Organism/AccessLimitedToAdmins";
import DeleteModal from "../../Organism/DeleteModal";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import Alert from "../../Molecules/Alert";
import ItemsChart from "../../Organism/ItemsChart";
import OrdersChart from "../../Organism/OrdersChart";
import InvoicingChart from "../../Organism/InvoicingChart";
import ReportModal from "../../Organism/ReportModal";

const WITHOUT_ENOUGHT_COMMANDS = "Não há comandas para realizar essa ação.";
const DELETED_COMMANDS =
  "Comandas deletadas com sucesso e gráficos atualizados. Recarregue a página.";
const SYSTTEM_OPEN = "Sistema foi aberto com sucesso.";
const SYSTTEM_CLOSE = "Sistema foi fechado com sucesso.";
const SCHEDULE_UPDATED = "Horários atualizados.";
const RESET_STATISTICS = "Estatísticas resetadas. Recarregue a página.";
const RESET_CHAR_ITEM = "Gráfico de itens zerado. Recarregue a página.";
const THEREARE_ACTIVE_COMMANDS = "Existem comandas ativas.";

export default function HomeTemplate() {
  const [schedule, setSchedule] = useState<Schedule>();
  const [isLoading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState({
    active: 0,
    finished: 0,
    canceled: 0,
    total: 0,
    finishedByPayment: {
      cash: 0,
      credit: 0,
      debit: 0,
      serviceFee: 0,
    },
  });
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    fetchOrderStatus();
  }, []);

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
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [windowWidth]);

  const handleOpeningTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (schedule) {
      setSchedule({
        ...schedule,
        openingTime: value,
      });
    }
  };

  const handleClosingTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (schedule) {
      setSchedule({
        ...schedule,
        closingTime: value,
      });
    }
  };

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const fetchedSchedule = await ScheduleRepositories.getSchedule();
        setSchedule(fetchedSchedule);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar home page.");
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const changeOpeningStatus = async () => {
    if (schedule?._id) {
      setLoading(true);
      try {
        await ScheduleRepositories.updateSchedule({
          isOpen: !schedule.isOpen,
        });
        setSchedule({
          ...schedule,
          isOpen: !schedule.isOpen,
        });
        setLoading(false);
        showAlert(schedule.isOpen ? SYSTTEM_CLOSE : SYSTTEM_OPEN, "success");
      } catch (error) {
        console.error("Erro ao alterar o status de abertura do sistema.");
        setLoading(false);
      }
    }
  };

  const changeScheduleTime = async () => {
    if (schedule?._id) {
      setLoading(true);
      try {
        await ScheduleRepositories.updateSchedule({
          openingTime: schedule.openingTime,
          closingTime: schedule.closingTime,
        });
        setSchedule({
          ...schedule,
          openingTime: schedule.openingTime,
          closingTime: schedule.closingTime,
        });
        setLoading(false);
        showAlert(SCHEDULE_UPDATED, "success");
      } catch (error) {
        console.error("Erro ao alterar o horário de funcionamento do sistema.");
        setLoading(false);
      }
    }
  };

  const deleteOrdersAndGenerateStatistcs = async () => {
    setLoading(true);
    try {
      const orders = await OrderRepositories.getOrders();

      if (orders.length < 1) {
        setLoading(false);
        setIsDeleteModalOpen(false);
        showAlert(WITHOUT_ENOUGHT_COMMANDS, "danger");
        return;
      }

      if (orders.some((order: Order) => order.status === "active")) {
        setLoading(false);
        setIsDeleteModalOpen(false);
        showAlert(THEREARE_ACTIVE_COMMANDS, "danger");
        return;
      }

      let finishedCount = 0;
      let canceledCount = 0;
      let totalValue = 0;
      const itemQuantitiesMap = new Map<string, number>();

      orders.forEach((order: Order) => {
        if (order.status === "finished") {
          finishedCount++;
          totalValue += order.debit_payment;
          totalValue += order.credit_payment;
          totalValue += order.money_payment;
          if (order.service_fee_paid) {
            totalValue -= order.service_fee;
          }
        } else if (order.status === "canceled") {
          canceledCount++;
        }

        order.items.forEach((itemInOrder) => {
          const itemName = itemInOrder.item.name;

          // Se o item já estiver no mapa, adicione 1 à quantidade existente
          if (itemQuantitiesMap.has(itemName)) {
            const existingQuantity = itemQuantitiesMap.get(itemName) || 0;
            itemQuantitiesMap.set(itemName, existingQuantity + 1);
          } else {
            // Caso contrário, inicie a contagem com 1 para o novo item
            itemQuantitiesMap.set(itemName, 1);
          }
        });
      });

      // Converter o mapa para um array de objetos { itemName: string, quantity: number }
      const itemQuantities = Array.from(itemQuantitiesMap.entries()).map(
        ([itemName, quantity]) => ({
          itemName,
          quantity,
        })
      );

      setIsDeleteModalOpen(false);

      await deleteAllOrders();

      await createStatistics({
        canceledOrders: canceledCount,
        finishedOrders: finishedCount,
        invoicing: totalValue,
        items: itemQuantities,
      });

      showAlert(DELETED_COMMANDS, "success");
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir as comandas e gerar estatísticas:", error);
      setLoading(false);
    }
  };

  const deleteAllOrders = async () => {
    setLoading(true);
    try {
      const orders = await OrderRepositories.getOrders();
      orders.forEach(async (order: Order) => {
        if (order._id) {
          await OrderRepositories.deleteOrder(order._id);
        }
      });
      console.log("Todas as comandas excluídas com sucesso!");
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir as comandas:", error);
      setLoading(false);
    }
  };

  const createStatistics = async (statisticsData: Statistics) => {
    try {
      await StatisticsRepositories.createStatistic(statisticsData);
      console.log("Nova estatística criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar nova estatística:", error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const orders = await OrderRepositories.getOrders();

      // Inicialize as variáveis de contagem
      let activeCount = 0;
      let finishedCount = 0;
      let canceledCount = 0;
      let cashCount = 0;
      let creditCount = 0;
      let debitCount = 0;
      let serviceFeeTotal = 0;

      orders.forEach((order: Order) => {
        if (order.status === "active") {
          activeCount++;
        } else if (order.status === "finished") {
          finishedCount++;

          cashCount += order.money_payment;
          creditCount += order.credit_payment;
          debitCount += order.debit_payment;
          if (order.service_fee_paid) {
            serviceFeeTotal += order.service_fee;
          }
        } else if (order.status === "canceled") {
          canceledCount++;
        }
      });

      const totalOrders = orders.length;

      setOrderStatus({
        active: activeCount,
        finished: finishedCount,
        canceled: canceledCount,
        total: totalOrders,
        finishedByPayment: {
          cash: cashCount,
          credit: creditCount,
          debit: debitCount,
          serviceFee: serviceFeeTotal,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar as comandas:", error);
    }
  };

  function confirmItemChartReset() {
    if (window.confirm("Tem certeza que deseja zerar o gráfico?")) {
      resetItemChart();
    }
  }

  const resetItemChart = async () => {
    setLoading(true);
    try {
      const statistics = await StatisticsRepositories.getStatistics();
      statistics.forEach(async (statistic: Statistics) => {
        if (statistic._id) {
          await StatisticsRepositories.updateStatistic(statistic._id, {
            ...statistic,
            items: [],
          });
        }
      });
      console.log("Gráfico de itens resetado");
      setLoading(false);
      showAlert(RESET_CHAR_ITEM, "success");
    } catch (error) {
      console.error("Erro ao excluir dados do gráfico de itens:", error);
      setLoading(false);
    }
  };

  function confirmChartsReset() {
    if (window.confirm("Tem certeza que deseja zerar TODOS os gráficos?")) {
      resetAllStatistics();
    }
  }

  const resetAllStatistics = async () => {
    setLoading(true);
    try {
      const statistics = await StatisticsRepositories.getStatistics();
      statistics.forEach(async (statistic: Order) => {
        if (statistic._id) {
          await StatisticsRepositories.deleteStatistic(statistic._id);
        }
      });
      console.log("Gráficos resetados!");
      setLoading(false);
      showAlert(RESET_STATISTICS, "success");
    } catch (error) {
      console.error("Erro ao resetar gráficos:", error);
      setLoading(false);
    }
  };

  if (isLoading) return <LoadingFullScreenTemplate />;

  const isOpen = schedule?.isOpen;
  const openingButtoncolor = isOpen ? "primary-color" : "invalid-color";
  const openingButtonStatus = isOpen ? "Aberto" : "Fechado";
  const openingButtonLabel = isOpen ? "Fechar Sistema" : "Abrir Sistema";

  return (
    <>
      <AccessLimitedToAdmins />
      <div className={styles.container}>
        <Text fontWeight="semibold" fontSize="large">
          Controle do Sistema
        </Text>
        <div className={styles.homeContent}>
          <div className={styles.scheduleControlContainer}>
            <div
              className={`${!isOpen && styles.isCloseBorder} ${
                styles.boxTemplate
              } ${styles.openingControl}`}
            >
              <Text>
                Controle de abertura -{" "}
                <Text fontWeight="semibold" fontColor={openingButtoncolor}>
                  {openingButtonStatus}
                </Text>
              </Text>
              <Button
                onClick={() => changeOpeningStatus()}
                backGroundColor={openingButtoncolor}
                label={openingButtonLabel}
              />
            </div>
            <div className={`${styles.boxTemplate} ${styles.scheduleControl}`}>
              <div className={styles.shceduleBoxInputTime}>
                <input
                  type="text"
                  id="openingTime"
                  value={schedule?.openingTime}
                  onChange={handleOpeningTimeChange}
                  maxLength={5}
                  pattern="[0-2][0-9]:[0-5][0-9]"
                  placeholder="hh:mm"
                  className={styles.scheduleInputTime}
                />
                <label htmlFor="openingTime">Horário de Abertura</label>
              </div>

              <div className={styles.shceduleBoxInputTime}>
                <input
                  type="text"
                  id="closingTime"
                  value={schedule?.closingTime}
                  onChange={handleClosingTimeChange}
                  maxLength={5}
                  pattern="[0-2][0-9]:[0-5][0-9]"
                  placeholder="hh:mm"
                  className={styles.scheduleInputTime}
                />
                <label htmlFor="closingTime">Horário de Fechamento</label>
              </div>
              <Button
                onClick={() => changeScheduleTime()}
                label={"Alterar horários"}
                marginTop="14px"
              />
            </div>
          </div>
          <div className={styles.reportControlContainer}>
            <div className={`${styles.boxTemplate}`}>
              <Text fontSize="mediumLarge" fontWeight="semibold">
                Gerar Relatório de fim do dia
              </Text>
              <Text marginBottom="12px" marginTop="12px" fontSize="small">
                Status das comandas já finalizada. Irá gerar um relatório
                referente a todos os pedidos finalizados do dia.
              </Text>
              <div className={styles.statusContent}>
                <Text fontSize="small">
                  <strong>Total Dinheiro:</strong> R${" "}
                  {orderStatus.finishedByPayment.cash.toFixed(2)}
                </Text>
                <Text fontSize="small">
                  <strong>Total Crédito:</strong> R${" "}
                  {orderStatus.finishedByPayment.credit.toFixed(2)}
                </Text>
                <Text fontSize="small">
                  <strong>Total Débito:</strong> R${" "}
                  {orderStatus.finishedByPayment.debit.toFixed(2)}
                </Text>
                <Text fontSize="small">
                  <strong>Total da Taxa de Serviço:</strong> R${" "}
                  {orderStatus.finishedByPayment.serviceFee.toFixed(2)}
                </Text>
              </div>
              <Button
                label="Gerar relatório"
                onClick={() => setIsReportModalOpen(true)}
              />
            </div>
            <div className={`${styles.boxTemplate}`}>
              <Text fontSize="mediumLarge" fontWeight="semibold">
                Status de comandas
              </Text>
              <Text marginBottom="12px" marginTop="12px" fontSize="small">
                Status das comandas atuais. Exclua as comandas ao final do
                expediente e adicione o dia de hoje às estatísticas.
              </Text>
              <div className={styles.statusContent}>
                <Text fontSize="small">
                  <strong>Comandas Ativas:</strong> {orderStatus.active}
                </Text>
                <Text fontSize="small">
                  <strong>Comandas Finalizadas:</strong> {orderStatus.finished}
                </Text>
                <Text fontSize="small">
                  <strong>Comandas Canceladas:</strong> {orderStatus.canceled}
                </Text>
                <Text fontSize="small">
                  <strong>Total de Comandas:</strong> {orderStatus.total}
                </Text>
              </div>
              <Button
                label="Excluir comandas"
                onClick={() => setIsDeleteModalOpen(true)}
              />
            </div>
          </div>
          {windowWidth > 721 && (
            <div className={`${styles.ChartContainer}`}>
              <div className={styles.char}>
                <InvoicingChart />
              </div>
              <div className={styles.char}>
                <OrdersChart />
              </div>
              <div className={styles.char}>
                <div
                  className={styles.resetGraphic}
                  onClick={() => confirmItemChartReset()}
                >
                  <Text
                    fontWeight="semibold"
                    fontSize="small"
                    fontColor="background-secondary-color"
                  >
                    <FontAwesomeIcon
                      size="sm"
                      icon={faRotateLeft}
                      color="black"
                    />{" "}
                    Zerar gráfico
                  </Text>
                </div>
                <ItemsChart />
              </div>
              <div
                className={styles.resetAllStatistics}
                onClick={() => confirmChartsReset()}
              >
                <Text
                  fontWeight="semibold"
                  fontSize="small"
                  fontColor="main-white"
                >
                  <FontAwesomeIcon
                    size="sm"
                    icon={faRotateLeft}
                    color="white"
                  />{" "}
                  Resetar todas as estatísticas
                </Text>
              </div>
            </div>
          )}
        </div>
        <Alert
          isAlertOpen={alertInfo.isOpen}
          setIsAlertOpen={closeAlert}
          message={alertInfo.message}
          alertDisplayTime={3000}
          onClose={closeAlert}
          type={alertInfo.type}
        />
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
      <DeleteModal
        onClick={() => deleteOrdersAndGenerateStatistcs()}
        itemType="conjunto de comandas"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
    </>
  );
}
