import { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StatisticsRepositories from "../../../Services/repositories/statisticsRepositories";
import styles from "./ItemsChart.module.scss";
import Text from "../../Atoms/Text";

export default function ItemsChart() {
  const [chartData, setChartData] = useState<{
    itemNames: string[];
    itemCounts: number[];
  }>({ itemNames: [], itemCounts: [] });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Define a data de início como 7 dias atrás e a data de término como o dia de hoje
  useEffect(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setStartDate(sevenDaysAgo.toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
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

        const itemsData = filteredData.flatMap((stat: any) => stat.items || []);
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

  const handleItemClick = (itemName: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(itemName)) {
        newSelectedItems.delete(itemName);
      } else {
        newSelectedItems.add(itemName);
      }
      return newSelectedItems;
    });
  };

  const filteredItemNames = chartData.itemNames.filter(
    (name) =>
      !selectedItems.has(name) &&
      name.toLowerCase().includes(filterText.toLowerCase())
  );
  const filteredItemCounts = chartData.itemCounts.filter(
    (_, index) =>
      !selectedItems.has(chartData.itemNames[index]) &&
      chartData.itemNames[index]
        .toLowerCase()
        .includes(filterText.toLowerCase())
  );

  // Função para marcar todos os itens
  const selectAllItems = () => {
    setSelectedItems(new Set(chartData.itemNames));
  };

  // Função para desmarcar todos os itens
  const clearAllItems = () => {
    setSelectedItems(new Set());
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const colors = [
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#f18226",
    "#48d648",
    "#B34D4D",
    "#80B300",
    "#df4e4e",
    "#6680B3",
    "#66991A",
    "#ec63ca",
    "#CCFF1A",
    "#FF1A66",
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
      categories: filteredItemNames,
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
        series={[{ name: "Quantidade", data: filteredItemCounts }]}
        type="bar"
        height={350}
      />
      <div className={styles.container}>
        <div className={styles.defaultButtons}>
          <button onClick={selectAllItems} className={`${styles.button}`}>
            Marcar Todos
          </button>
          <button onClick={clearAllItems} className={`${styles.button}`}>
            Desmarcar Todos
          </button>
          <input
            type="text"
            placeholder="Filtrar itens..."
            value={filterText}
            onChange={handleFilterChange}
            className={styles.filterInput}
          />
        </div>
        {chartData.itemNames.map((itemName) => (
          <button
            key={itemName}
            onClick={() => handleItemClick(itemName)}
            className={`${styles.button} ${
              selectedItems.has(itemName) ||
              !itemName.toLowerCase().includes(filterText.toLowerCase())
                ? styles.filteredButton
                : ""
            }`}
          >
            {itemName}
          </button>
        ))}
      </div>
    </>
  );
}
