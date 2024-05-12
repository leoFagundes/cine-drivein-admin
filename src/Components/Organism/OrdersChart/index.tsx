import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";
import styles from "./OrdersChart.module.scss";
import Text from "../../Atoms/Text";

export default function OrdersChart() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [chartData, setChartData] = useState<{
    dates: string[];
    finishedOrdersData: number[];
    canceledOrdersData: number[];
  }>({
    dates: [],
    finishedOrdersData: [],
    canceledOrdersData: [],
  });

  useEffect(() => {
    // Calcula a data de 7 dias atrás a partir de hoje
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo.toISOString().split("T")[0]);

    // Define a data de endDate como o dia de hoje
    const today = new Date();
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const statistics = await StatisticsRepositories.getStatistics();

        // Filtrando os dados com base nas datas selecionadas
        const filteredData = statistics.filter((stat: any) => {
          const createdAtDate = new Date(stat.createdAt);
          return (
            createdAtDate >= new Date(startDate) &&
            createdAtDate <= new Date(endDate)
          );
        });

        const dates = filteredData.map((stat: any) => stat.createdAt);
        const finishedOrdersData = filteredData.map(
          (stat: any) => stat.finishedOrders
        );
        const canceledOrdersData = filteredData.map(
          (stat: any) => stat.canceledOrders
        );
        setChartData({ dates, finishedOrdersData, canceledOrdersData });
      } catch (error) {
        console.error("Erro ao buscar os dados de pedidos:", error);
      }
    }

    // Verifica se startDate e endDate estão definidos antes de buscar os dados
    if (startDate && endDate) {
      fetchChartData();
    }
  }, [startDate, endDate]);

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value);
  };

  const options = {
    chart: {
      type: "area" as const,
      height: 350,
    },
    xaxis: {
      categories: chartData.dates.map((date) => {
        const dateObj = new Date(date);
        // Convertendo para hora local
        const localDate = new Date(
          dateObj.toLocaleString("en-US", { timeZone: "UTC" })
        );
        return `${localDate.toLocaleDateString()} ${localDate.getHours()}:${localDate.getMinutes()}`;
      }),
      labels: {
        style: {
          colors: "#000000", // Define a cor das legendas do eixo Y
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000000", // Define a cor das legendas do eixo Y
        },
      },
    },
    title: {
      text: "Pedidos Finalizados e Cancelados por Dia",
      align: "center" as const,
      style: {
        fontSize: "16px",
        color: "#000000",
      },
    },
    colors: ["#0088c2", "#ff5555"], // Define as cores para as séries de dados (finalizados e cancelados)
    legend: {
      labels: {
        colors: "#000000", // Define a cor do texto da legenda
      },
    },
    tooltip: {
      theme: "dark", // Define o tema do tooltip como escuro
    },
    grid: {
      borderColor: "#525252", // Define a cor das linhas de grade do gráfico
    },
  };

  return (
    <>
      <div className={styles.scheduleManage}>
        <div className={styles.date}>
          <Text fontSize="small" fontColor="background-secondary-color">
            Data de início:
          </Text>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div className={styles.date}>
          <Text fontSize="small" fontColor="background-secondary-color">
            Data de término:
          </Text>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>
      <ApexCharts
        options={options}
        series={[
          { name: "Pedidos Finalizados", data: chartData.finishedOrdersData },
          { name: "Pedidos Cancelados", data: chartData.canceledOrdersData },
        ]}
        type="area"
        height={350}
      />
    </>
  );
}
