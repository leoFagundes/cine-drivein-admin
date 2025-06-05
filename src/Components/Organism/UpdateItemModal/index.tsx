import styles from "./UpdateItemModal.module.scss";
import { MouseEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Item } from "../../../Types/types";
import RegisterFormTemplate from "../../Templates/RegisterFormTemplate";
import ItemRepositories from "../../../Services/repositories/ItemRepositories";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  currentItem?: Item;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  showAlert?: VoidFunction;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ERROR_NAME_MESSAGE = "Nome inválido.";
const ERROR_DESCRIPTION_MESSAGE = "Descrição inválida.";
// const ERROR_PHOTO_MESSAGE = "Foto inválida.";
const ERROR_COD_ITEM_MESSAGE = "Código do item inválido.";
const ERROR_TYPE_MESSAGE = "Tipo inválido.";
const ERROR_VALUE_MESSAGE = "Valor inválido.";
const ERROR_QUANTITY_MESSAGE = "Quantidade inválida.";
const ERROR_COD_ITEM_ALREADY_EXIST = "Já existe um item com esse código.";

export default function UpdateItemModal({
  onClose,
  isOpen,
  items,
  setItems,
  currentItem,
  setIsLoading,
}: ModalType) {
  const [uniqueTypes, setUniqueTypes] = useState<string[]>([]);
  const [item, setItem] = useState<Item>({
    cod_item: "",
    name: "",
    type: "",
    description: "",
    value: 0,
    visibleValueToClient: 0,
    quantity: 0,
    photo: "",
    isVisible: true,
    additionals: [],
    additionals_sauces: [],
    additionals_drinks: [],
    additionals_sweets: [],
  });
  const [itemError, setItemError] = useState({
    cod_itemError: "",
    nameError: "",
    typeError: "",
    descriptionError: "",
    valueError: "",
    quantityError: "",
    photoError: "",
  });

  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  useEffect(() => {
    const fetchUniqueTypes = async () => {
      try {
        const types = await ItemRepositories.getUniqueTypes();
        setUniqueTypes(types);
      } catch (error) {
        console.error("Erro ao obter tipos únicos:", error);
      }
    };

    if (currentItem) {
      setItem(currentItem);
    }

    fetchUniqueTypes();
  }, [isOpen, currentItem]);

  const handleSelectSuggestion = (selectedValue: string) => {
    setItem({ ...item, type: selectedValue });
  };

  const validateItemForm = () => {
    let isValid = true;
    const newItemError = { ...itemError };

    if (!item.name.trim()) {
      newItemError.nameError = ERROR_NAME_MESSAGE;
      isValid = false;
    } else {
      newItemError.nameError = "";
    }

    if (!item.description.trim()) {
      newItemError.descriptionError = ERROR_DESCRIPTION_MESSAGE;
      isValid = false;
    } else {
      newItemError.descriptionError = "";
    }

    // if (!item.photo.trim()) {
    //   newItemError.photoError = ERROR_PHOTO_MESSAGE;
    //   isValid = false;
    // } else {
    //   newItemError.photoError = '';
    // }

    if (!item.cod_item.trim()) {
      newItemError.cod_itemError = ERROR_COD_ITEM_MESSAGE;
      isValid = false;
    } else {
      newItemError.cod_itemError = "";
    }

    if (!item.type.trim()) {
      newItemError.typeError = ERROR_TYPE_MESSAGE;
      isValid = false;
    } else {
      newItemError.typeError = "";
    }

    // if (item.value >= 0) {
    //   newItemError.valueError = "";
    // } else {
    //   newItemError.valueError = ERROR_VALUE_MESSAGE;
    //   isValid = false;
    // }

    if (
      !isNaN(item.quantity) &&
      item.quantity !== null &&
      item.quantity !== 0
    ) {
      newItemError.quantityError = "";
    } else {
      newItemError.quantityError = ERROR_QUANTITY_MESSAGE;
      isValid = false;
    }

    setItemError(newItemError);
    return isValid;
  };

  const handleSubmitItem = async () => {
    if (!validateItemForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    const allItems = await ItemRepositories.getItems();

    if (
      allItems?.some(
        (itemToFind: Item) =>
          itemToFind.cod_item === item.cod_item &&
          itemToFind._id !== currentItem?._id
      )
    ) {
      setItemError({
        ...itemError,
        cod_itemError: ERROR_COD_ITEM_ALREADY_EXIST,
      });
      return;
    }

    setIsLoading && setIsLoading(true);

    if (currentItem?._id) {
      try {
        let updatedItem = { ...item };
        if (isNaN(item.value)) {
          updatedItem = { ...item, value: 0 };
        }
        await ItemRepositories.updateItem(currentItem._id, updatedItem);
        setIsLoading && setIsLoading(false);
        setItem({
          cod_item: "",
          name: "",
          type: "",
          description: "",
          value: 0,
          visibleValueToClient: 0,
          quantity: 0,
          photo: "",
          isVisible: true,
          additionals: [],
          additionals_sauces: [],
          additionals_drinks: [],
          additionals_sweets: [],
        });
        console.log("Dados do item alterados com sucesso");

        setItems((prevItems) =>
          prevItems.map((item) =>
            item._id === currentItem._id ? { ...items, ...updatedItem } : item
          )
        );

        // window.location.href = `${window.location.pathname}?from=201:ItemUpdated`;
      } catch (error) {
        setIsLoading && setIsLoading(false);
        console.error("Erro ao alterar dados do item:", error);
      }
    }

    onClose();
  };

  return (
    <>
      {isOpen && currentItem && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            <FontAwesomeIcon
              onClick={onClose}
              className={styles.closeModalIcon}
              size="lg"
              icon={faXmark}
            />
            <RegisterFormTemplate
              label={`Alterar dados de ${currentItem.name}`}
              inputs={[
                {
                  value: item.name,
                  placeholder: "Nome",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, name: e.target.value });
                    setItemError({ ...itemError, nameError: "" });
                  },
                  type: "text",
                  errorLabel: itemError.nameError,
                },
                {
                  value: item.description,
                  placeholder: "Descrição",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, description: e.target.value });
                    setItemError({ ...itemError, descriptionError: "" });
                  },
                  type: "text",
                  errorLabel: itemError.descriptionError,
                },
                {
                  value: item.cod_item,
                  placeholder: "Código do Item",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, cod_item: e.target.value });
                    setItemError({ ...itemError, cod_itemError: "" });
                  },
                  type: "text",
                  errorLabel: itemError.cod_itemError,
                },
                {
                  value: item.type,
                  placeholder: "Tipo",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, type: e.target.value });
                    setItemError({ ...itemError, typeError: "" });
                  },
                  type: "text",
                  errorLabel: itemError.typeError,
                  suggestions: uniqueTypes,
                  onSelectSuggestion: handleSelectSuggestion,
                },
                {
                  value: item.value !== 0 ? item.value.toString() : "",
                  placeholder: "Valor",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, value: parseFloat(e.target.value) });
                    setItemError({ ...itemError, valueError: "" });
                  },
                  type: "number",
                  errorLabel: itemError.valueError,
                },
                {
                  value:
                    item.visibleValueToClient && item.visibleValueToClient !== 0
                      ? item.visibleValueToClient.toString()
                      : "",
                  placeholder: "Valor visivel para o cliente",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({
                      ...item,
                      visibleValueToClient: parseFloat(e.target.value),
                    });
                  },
                  type: "number",
                  errorLabel: "",
                },
                {
                  value: item.quantity !== 0 ? item.quantity.toString() : "",
                  placeholder: "Quantidade (desativado)",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setItem({ ...item, quantity: parseInt(e.target.value) });
                    setItemError({ ...itemError, quantityError: "" });
                  },
                  type: "number",
                  errorLabel: itemError.quantityError,
                },
                // {
                //   value: "",
                //   placeholder: "Foto",
                //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                //     const file = e.target.files?.[0];
                //     if (file) {
                //       setItem({ ...item, photo: file });
                //       setItemError({ ...itemError, photoError: "" });
                //     }
                //   },
                //   type: "file",
                //   errorLabel: itemError.photoError,
                // },
              ]}
              withSubitem
              itemWithSubitems={item}
              setItemWithSubitems={setItem}
              buttonOnClick={handleSubmitItem}
              buttonLabel="Enviar"
              blockSubitems
            />
          </div>
        </div>
      )}
    </>
  );
}
