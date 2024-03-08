import { useEffect, useState } from "react";
import Text from "../../Components/Atoms/Text";
import styles from "./Stock.module.scss";
import ItemRepositories from "../../Services/repositories/ItemRepositories";
import { AdditionalItem, Item } from "../../Types/types";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import { Input } from "../../Components/Atoms/Input/Input";
import { Dropdown } from "../../Components/Atoms/Dropdown";
import ItemCard from "../../Components/Organism/ItemCard";
import Alert from "../../Components/Molecules/Alert";
import DeleteModal from "../../Components/Organism/DeleteModal";
import AdditionalItemRepositories from "../../Services/repositories/AdditionalItemRepositories";
import SubitemCard from "../../Components/Organism/SubitemCard";

const sort_options = ["Crescente", "Decrescente"];
const visibility_options = ["Visível", "Invisível"];

export default function Stock() {
  const [items, setItems] = useState<Item[]>([]);
  const [subItems, setSubItems] = useState<AdditionalItem[]>([]);
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedVisibility, setSelectedVisibility] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [curretnClickedItem, setCurrentClickedItem] = useState<
    Item | AdditionalItem
  >();
  const [isActive, setIsActive] = useState({
    itemActive: true,
    subitemActive: false,
  });

  const closeAlert = () => {
    setShowDeleteAlert(false);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const types = await ItemRepositories.getUniqueTypes();
        const fetchedItems = await ItemRepositories.getItems();
        const fetchedSubItems =
          await AdditionalItemRepositories.getAdditionalItems();
        setUniqueTypes(types);
        setItems(fetchedItems);
        setSubItems(fetchedSubItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter itens:", error);
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChangeVisibilityClick = async (
    id: string,
    visibleStatus: boolean
  ) => {
    try {
      const updatedItems = items.map((item) =>
        item._id === id ? { ...item, isVisible: visibleStatus } : item
      );

      setItems(updatedItems);

      await ItemRepositories.updateItem(id, { isVisible: visibleStatus });
    } catch (error) {
      console.error("Erro ao atualizar a visibilidade do item:", error);
    }
  };

  const handleDeleteClick = async (id: string, type: "item" | "subitem") => {
    if (type === "item") {
      try {
        await ItemRepositories.deleteItem(id);
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        setShowDeleteAlert(true);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Erro ao deletar o item:", error);
      }
    } else {
      try {
        await AdditionalItemRepositories.deleteAdditionalItem(id);
        const updatedSubitems = subItems.filter((item) => item._id !== id);
        setSubItems(updatedSubitems);
        setShowDeleteAlert(true);
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Erro ao deletar o item:", error);
      }
    }
  };

  const filteredItems = items
    .filter((item) => {
      return (
        (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.cod_item.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedType ? item.type === selectedType : true) &&
        (selectedVisibility
          ? selectedVisibility === "Visível"
            ? item.isVisible
            : !item.isVisible
          : true)
      );
    })
    .sort((a, b) => {
      if (selectedSort === "Crescente") {
        return a.quantity - b.quantity;
      } else if (selectedSort === "Decrescente") {
        return b.quantity - a.quantity;
      } else {
        return 0;
      }
    });

  const filteredSubitems = subItems.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) return <LoadingFullScreenTemplate />;

  return (
    <section className={styles.stockContainer}>
      <Text fontSize="extraLarge" fontWeight="semibold">
        Estoque
      </Text>
      <div className={styles.manageVisibilyState}>
        <div
          onClick={() => {
            setIsActive({
              itemActive: true,
              subitemActive: false,
            });
          }}
          className={isActive.itemActive ? styles.isActive : ""}
        >
          <Text fontWeight="semibold">Itens</Text>
        </div>
        <div
          onClick={() => {
            setIsActive({
              itemActive: false,
              subitemActive: true,
            });
          }}
          className={isActive.subitemActive ? styles.isActive : ""}
        >
          <Text fontWeight="semibold">Subitens</Text>
        </div>
      </div>
      <div className={styles.stockContent}>
        {isActive.itemActive ? (
          <>
            <div className={styles.filters}>
              <Input
                type="text"
                placeholder="Nome ou código"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Dropdown
                options={uniqueTypes}
                value={selectedType}
                placeholder="Tipo de Item"
                onChange={(value) => setSelectedType(value)}
              />
              <Dropdown
                options={sort_options}
                value={selectedSort}
                placeholder="Ordenar Quantidade"
                onChange={(value) => setSelectedSort(value)}
              />
              <Dropdown
                options={visibility_options}
                value={selectedVisibility}
                placeholder="Visibilidade"
                onChange={(value) => setSelectedVisibility(value)}
              />
            </div>
            <div className={styles.items}>
              {filteredItems.map((item) => (
                <div key={item._id}>
                  <ItemCard
                    handleUpdateClick={() => console.log("UpdateItem")}
                    handleDeleteClick={() => {
                      setCurrentClickedItem(item);
                      setIsDeleteModalOpen(true);
                    }}
                    handleChangeVisibilityClick={() =>
                      handleChangeVisibilityClick(
                        item._id ? item._id : "",
                        !item.isVisible
                      )
                    }
                    item={item}
                  />
                </div>
              ))}
            </div>
          </>
        ) : isActive.subitemActive ? (
          <>
            <div className={styles.filters}>
              <Input
                type="text"
                placeholder="Nome ou código"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.items}>
              {filteredSubitems.map((subitem) => (
                <SubitemCard
                  key={subitem._id}
                  subitem={subitem}
                  handleDeleteClick={() => {
                    setCurrentClickedItem(subitem);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <DeleteModal
        onClick={() =>
          handleDeleteClick(
            curretnClickedItem?._id ? curretnClickedItem._id : "",
            isActive.itemActive ? "item" : "subitem"
          )
        }
        itemId={curretnClickedItem?.name ? curretnClickedItem.name : ""}
        itemType="item"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
      <Alert
        isAlertOpen={showDeleteAlert}
        setIsAlertOpen={setShowDeleteAlert}
        message={`Item excluído com sucesso.`}
        alertDisplayTime={3000}
        onClose={closeAlert}
        type="success"
      />
    </section>
  );
}
