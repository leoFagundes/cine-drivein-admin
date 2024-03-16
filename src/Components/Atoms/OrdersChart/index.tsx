import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";

export default function OrdersChart() {
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
    async function fetchChartData() {
      try {
        const statistics = await StatisticsRepositories.getStatistics();

        const dates = statistics.map((stat: any) => stat.createdAt);
        const finishedOrdersData = statistics.map(
          (stat: any) => stat.finishedOrders
        );
        const canceledOrdersData = statistics.map(
          (stat: any) => stat.canceledOrders
        );
        setChartData({ dates, finishedOrdersData, canceledOrdersData });
      } catch (error) {
        console.error("Erro ao buscar os dados de pedidos:", error);
      }
    }

    fetchChartData();
  }, []);

  const options = {
    chart: {
      type: "area" as const,
      height: 350,
    },
    xaxis: {
      categories: chartData.dates.map((date) => {
        const dateObj = new Date(date);
        // Formatando a data para incluir hora e minuto
        return `${dateObj.toLocaleDateString()} ${dateObj.getHours()}:${dateObj.getMinutes()}`;
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
    <ApexCharts
      options={options}
      series={[
        { name: "Pedidos Finalizados", data: chartData.finishedOrdersData },
        { name: "Pedidos Cancelados", data: chartData.canceledOrdersData },
      ]}
      type="area"
      height={350}
    />
  );
}
