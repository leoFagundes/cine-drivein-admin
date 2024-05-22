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
import UpdateItemModal from "../../Components/Organism/UpdateItemModal";
import { useLocation, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faE, faEye } from "@fortawesome/free-solid-svg-icons";
import AccessLimitedToAdmins from "../../Components/Organism/AccessLimitedToAdmins";

const sort_options = ["Crescente", "Decrescente"];
const visibility_options = ["Visível", "Invisível"];

const ITEM_UPDATED = "Dados do item alterados com sucesso.";

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [curretnClickedItem, setCurrentClickedItem] = useState<Item>();
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });
  const [curretnClickedAdditionalItem, setCurrentClickedAdditionalItem] =
    useState<AdditionalItem>();
  const [isActive, setIsActive] = useState({
    itemActive: true,
    subitemActive: false,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");

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
    if (from === "201:ItemUpdated") {
      showAlert(ITEM_UPDATED, "success");
      navigate("/", { replace: true });
    }
  }, [from, navigate]);

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

  const handleChangeVisibilitySubitemClick = async (
    id: string,
    visibleStatus: boolean
  ) => {
    try {
      const updatedSubItems = subItems.map((subitem) =>
        subitem._id === id ? { ...subitem, isVisible: visibleStatus } : subitem
      );

      setSubItems(updatedSubItems);

      await AdditionalItemRepositories.updateAdditionalItem(id, {
        isVisible: visibleStatus,
      });
    } catch (error) {
      console.error("Erro ao atualizar a visibilidade do subitem:", error);
    }
  };

  const handleDeleteClick = async (id: string, type: "item" | "subitem") => {
    setIsLoading(true);
    if (type === "item") {
      try {
        const item = await ItemRepositories.getItemById(id);
        if (item.photo) {
          const photoFileName = item.photo.split("/").pop();
          await ItemRepositories.deleteItemImage(photoFileName);
        }
        await ItemRepositories.deleteItem(id);
        const updatedItems = items.filter((item) => item._id !== id);
        setItems(updatedItems);
        showAlert("Item excluído com sucesso.", "success");
        setIsDeleteModalOpen(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao deletar o item:", error);
        setIsLoading(false);
      }
    } else {
      try {
        await AdditionalItemRepositories.deleteAdditionalItem(id);
        const updatedSubitems = subItems.filter((item) => item._id !== id);
        setSubItems(updatedSubitems);
        showAlert("Item excluído com sucesso.", "success");
        setIsDeleteModalOpen(false);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao deletar o item:", error);
        setIsLoading(false);
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
      <AccessLimitedToAdmins />
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
                    handleUpdateClick={() => {
                      setCurrentClickedItem(item);
                      setIsUpdateModalOpen(true);
                    }}
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
                placeholder="Nome"
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
                    setCurrentClickedAdditionalItem(subitem);
                    setIsDeleteModalOpen(true);
                  }}
                  handleChangeVisibilitySubitemClick={() =>
                    handleChangeVisibilitySubitemClick(
                      subitem._id ? subitem._id : "",
                      !subitem.isVisible
                    )
                  }
                />
              ))}
            </div>
          </>
        ) : (
          ""
        )}
        {isActive.subitemActive && (
          <div className={styles.eyeWarning}>
            <Text fontColor="gray-color" fontSize="small">
              <i>
                <strong>Observação:</strong> A funcionalidade de visibilidade (
                <FontAwesomeIcon
                  className={styles.deleteIcon}
                  size={"sm"}
                  icon={faEye}
                  color="white"
                />
                ) para os <strong>subitens</strong> não irá retirar a opção do
                menu, serve apenas como um controle local.
              </i>
            </Text>
          </div>
        )}
      </div>
      <DeleteModal
        onClick={() =>
          handleDeleteClick(
            isActive.itemActive
              ? curretnClickedItem?._id
                ? curretnClickedItem?._id
                : ""
              : curretnClickedAdditionalItem?._id
              ? curretnClickedAdditionalItem?._id
              : "",
            isActive.itemActive ? "item" : "subitem"
          )
        }
        itemType="item"
        onClose={() => setIsDeleteModalOpen(false)}
        isOpen={isDeleteModalOpen}
      />
      <UpdateItemModal
        currentItem={curretnClickedItem}
        onClose={() => setIsUpdateModalOpen(false)}
        isOpen={isUpdateModalOpen}
        setIsLoading={setIsLoading}
      />
      <Alert
        isAlertOpen={alertInfo.isOpen}
        setIsAlertOpen={closeAlert}
        message={alertInfo.message}
        alertDisplayTime={5000}
        onClose={closeAlert}
        type={alertInfo.type}
      />
    </section>
  );
}
