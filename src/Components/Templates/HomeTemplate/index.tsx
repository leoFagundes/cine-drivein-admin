import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../Atoms/Button";
import Text from "../../Atoms/Text";
import styles from "./HomeTemplate.module.scss";
import ScheduleRepositories from "../../../Services/repositories/ScheduleRepositories";
import { Order, Schedule, Statistics } from "../../../Types/types";
import { LoadingFullScreenTemplate } from "../LoadingFullScreenTemplate";
import AccessLimitedToAdmins from "../../Organism/AccessLimitedToAdmins";
import InvoicingChart from "../../Atoms/InvoicingChart";
import OrdersChart from "../../Atoms/OrdersChart";
import DeleteModal from "../../Organism/DeleteModal";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";

export default function HomeTemplate() {
  const [schedule, setSchedule] = useState<Schedule>();
  const [isLoading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
  useEffect(() => {
    fetchOrderStatus();
  }, []);

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

      let finishedCount = 0;
      let canceledCount = 0;
      let totalValue = 0;

      orders.forEach((order: Order) => {
        if (order.status === "finished") {
          finishedCount++;
          totalValue += order.total_value;
        } else if (order.status === "canceled") {
          canceledCount++;
          totalValue += order.total_value;
        }
      });

      await deleteAllOrders();

      await createStatistics({
        canceledOrders: canceledCount,
        finishedOrders: finishedCount,
        invoicing: totalValue,
      });

      setIsDeleteModalOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao excluir as comandas e gerar estatísticas:", error);
      setLoading(false);
    }
  };

  const deleteAllOrders = async () => {
    try {
      const orders = await OrderRepositories.getOrders();
      orders.forEach(async (order: Order) => {
        if (order._id) {
          await OrderRepositories.deleteOrder(order._id);
        }
      });
      console.log("Todas as comandas excluídas com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir as comandas:", error);
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
          serviceFeeTotal += order.service_fee;
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
              <Button label="Gerar relatório" onClick={() => ""} />
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
            </div>
          )}
        </div>
      </div>
      <DeleteModal
        onClick={() => deleteOrdersAndGenerateStatistcs()}
        itemType="conjunto de comandas"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
    </>
  );
}
