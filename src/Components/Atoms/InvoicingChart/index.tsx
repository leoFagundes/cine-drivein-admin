import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";

export default function InvoicingChart() {
  const [chartData, setChartData] = useState<{
    dates: string[];
    invoicingData: number[];
  }>({ dates: [], invoicingData: [] });

  useEffect(() => {
    async function fetchChartData() {
      try {
        const statistics = await StatisticsRepositories.getStatistics();
        const dates = statistics.map((stat: any) => stat.createdAt);
        const invoicingData = statistics.map((stat: any) => stat.invoicing);
        setChartData({ dates, invoicingData });
      } catch (error) {
        console.error("Erro ao buscar os dados de faturamento:", error);
      }
    }

    fetchChartData();
  }, []);

  const options = {
    chart: {
      type: "line" as const,
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
      text: "Faturamento por Dia",
      align: "center" as const,
      style: {
        fontSize: "16px",
        color: "#000000",
      },
    },
    colors: ["#0088c2"], // Define a cor da linha do gráfico de faturamento
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
      series={[{ name: "Faturamento", data: chartData.invoicingData }]}
      type="line"
      height={350}
    />
  );
}
