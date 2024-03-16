import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";

export default function ItemsChart() {
  const [chartData, setChartData] = useState<{
    itemNames: string[];
    itemCounts: number[];
  }>({ itemNames: [], itemCounts: [] });

  useEffect(() => {
    async function fetchChartData() {
      try {
        const statistics = await StatisticsRepositories.getStatistics();
        const itemsData = statistics.flatMap((stat: any) => stat.items || []);
        const itemCountsMap = new Map<string, number>();

        itemsData.forEach((item: { itemName: string; quantity: number }) => {
          const { itemName, quantity } = item;
          itemCountsMap.set(
            itemName,
            (itemCountsMap.get(itemName) || 0) + quantity
          );
        });

        const itemNames = Array.from(itemCountsMap.keys());
        const itemCounts = Array.from(itemCountsMap.values());

        setChartData({ itemNames, itemCounts });
      } catch (error) {
        console.error("Erro ao buscar os dados dos itens:", error);
      }
    }

    fetchChartData();
  }, []);

  const colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#36dbb2",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
    "#66994D",
    "#B366CC",
    "#4D8000",
    "#B33300",
    "#CC80CC",
    "#66664D",
    "#991AFF",
    "#E666FF",
    "#4DB3FF",
    "#1AB399",
    "#E666B3",
    "#33991A",
    "#CC9999",
    "#B3B31A",
    "#00E680",
    "#4D8066",
    "#809980",
    "#E6FF80",
    "#1AFF33",
    "#999933",
    "#FF3380",
    "#CCCC00",
    "#66E64D",
    "#4D80CC",
    "#9900B3",
    "#E64D66",
    "#4DB380",
    "#FF4D4D",
    "#99E6E6",
    "#6666FF",
  ];

  const options = {
    chart: {
      type: "bar" as const,
      height: 350,
    },
    xaxis: {
      categories: chartData.itemNames,
      labels: {
        style: {
          colors: "#000000",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#000000",
        },
      },
    },
    title: {
      text: "Itens mais Vendidos",
      align: "center" as const,
      style: {
        fontSize: "16px",
        color: "#000000",
      },
    },
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    colors: colors.slice(0, chartData.itemNames.length),
    legend: {
      show: false,
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "#525252",
    },
  };

  return (
    <ApexCharts
      options={options}
      series={[{ name: "Quantidade", data: chartData.itemCounts }]}
      type="bar"
      height={350}
    />
  );
}
