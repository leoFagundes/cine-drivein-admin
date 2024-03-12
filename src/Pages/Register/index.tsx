import styles from "./Register.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBurger, faWineBottle } from "@fortawesome/free-solid-svg-icons";
import RegisterCard from "../../Components/Molecules/RegisterCard";
import { ChangeEvent, useEffect, useState } from "react";
import RegisterFormTemplate from "../../Components/Templates/RegisterFormTemplate";
import { AdditionalItem, Item } from "../../Types/types";
import Alert from "../../Components/Molecules/Alert";
import AdditionalItemRepositories from "../../Services/repositories/AdditionalItemRepositories";
import { LoadingFullScreenTemplate } from "../../Components/Templates/LoadingFullScreenTemplate";
import ItemRepositories from "../../Services/repositories/ItemRepositories";

const ERROR_NAME_MESSAGE = "Nome inválido.";
const ERROR_DESCRIPTION_MESSAGE = "Descrição inválida.";
// const ERROR_PHOTO_MESSAGE = "Foto inválida.";
const ERROR_COD_ITEM_MESSAGE = "Código do item inválido.";
const ERROR_TYPE_MESSAGE = "Tipo inválido.";
const ERROR_VALUE_MESSAGE = "Valor inválido.";
const ERROR_QUANTITY_MESSAGE = "Quantidade inválida.";
const ERROR_COD_ITEM_ALREADY_EXIST = "Já existe um item com esse código.";

const ALERT_MESSAGE_SUBITEM_CREATED = "Subitem criado com sucesso.";
const ALERT_MESSAGE_ITEM_CREATED = "Item criado com sucesso.";

export default function Register() {
  const [isItemActive, setIsItemActive] = useState(false);
  const [isSubItemActive, setIsSubItemActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allItems, setAllItems] = useState<Item[]>();
  const [subitem, setSubitem] = useState<AdditionalItem>({
    name: "",
    description: "",
    photo: "",
  });
  const [subitemError, setSubitemError] = useState({
    nameError: "",
    descriptionError: "",
    photoError: "",
  });
  const [item, setItem] = useState<Item>({
    cod_item: "",
    name: "",
    type: "",
    description: "",
    value: 0,
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
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    message: string;
    type: string;
  }>({
    isOpen: false,
    message: "",
    type: "",
  });

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
    const fetchItems = async () => {
      try {
        const items = await ItemRepositories.getItems();
        setAllItems(items);
      } catch (error) {
        console.log("Não foi possível carregar os itens:", error);
      }
    };

    fetchItems();
  }, [setAllItems, setItem]);

  const validateSubitemForm = () => {
    let isValid = true;
    const newSubitemError = { ...subitemError };

    if (!subitem.name.trim()) {
      newSubitemError.nameError = ERROR_NAME_MESSAGE;
      isValid = false;
    } else {
      newSubitemError.nameError = "";
    }

    // if (!subitem.description.trim()) {
    //   newSubitemError.descriptionError = ERROR_DESCRIPTION_MESSAGE;
    //   isValid = false;
    // } else {
    //   newSubitemError.descriptionError = '';
    // }

    // if (!subitem.photo.trim()) {
    //   newSubitemError.photoError = ERROR_PHOTO_MESSAGE;
    //   isValid = false;
    // } else {
    //   newSubitemError.photoError = '';
    // }

    setSubitemError(newSubitemError);
    return isValid;
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

    if (item.value === 0) {
      newItemError.valueError = ERROR_VALUE_MESSAGE;
      isValid = false;
    } else {
      newItemError.valueError = "";
    }

    if (item.quantity === 0) {
      newItemError.quantityError = ERROR_QUANTITY_MESSAGE;
      isValid = false;
    } else {
      newItemError.quantityError = "";
    }

    setItemError(newItemError);
    return isValid;
  };

  const handleSubmitSubitem = async () => {
    if (!validateSubitemForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    setIsLoading(true);

    try {
      await AdditionalItemRepositories.createAdditionalItem(subitem);
      setIsSubItemActive(false);
      showAlert(ALERT_MESSAGE_SUBITEM_CREATED, "success");
      setIsLoading(false);
      setSubitem({
        name: "",
        description: "",
        photo: "",
      });
      console.log("Subitem criado com sucesso");
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao criar subitem:", error);
    }
  };

  const handleSubmitItem = async () => {
    if (!validateItemForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    if (
      allItems?.some(
        (itemToFind: Item) => itemToFind.cod_item === item.cod_item
      )
    ) {
      setItemError({
        ...itemError,
        cod_itemError: ERROR_COD_ITEM_ALREADY_EXIST,
      });
      return;
    }

    setIsLoading(true);

    try {
      await ItemRepositories.createItem(item);
      setIsItemActive(false);
      showAlert(ALERT_MESSAGE_ITEM_CREATED, "success");
      setIsLoading(false);
      setItem({
        cod_item: "",
        name: "",
        type: "",
        description: "",
        value: 0,
        quantity: 0,
        photo: "",
        isVisible: true,
        additionals: [],
        additionals_sauces: [],
        additionals_drinks: [],
        additionals_sweets: [],
      });
      console.log("Item criado com sucesso");
    } catch (error) {
      setIsLoading(false);
      console.error("Erro ao criar item:", error);
    }
  };

  return (
    <section className={styles.registerContainer}>
      <div className={styles.registerContent}>
        <div className={styles.cards}>
          <RegisterCard
            label="Cadastrar Subitem"
            description="Cadastre um subitem que poderá ser vinculado a um item em sua criação"
            icon={<FontAwesomeIcon size="3x" icon={faWineBottle} />}
            onClick={() => {
              setIsSubItemActive(!isSubItemActive);
              setIsItemActive(false);
            }}
            isActive={isSubItemActive}
          />
          <RegisterCard
            label="Cadastrar Item"
            description="Cadastre um item para aparecer no cardápio (o item já poderá ser visto pelos usuários)"
            icon={<FontAwesomeIcon size="3x" icon={faBurger} />}
            onClick={() => {
              setIsItemActive(!isItemActive);
              setIsSubItemActive(false);
            }}
            isActive={isItemActive}
          />
        </div>
        {isLoading && <LoadingFullScreenTemplate />}
        {isSubItemActive && (
          <RegisterFormTemplate
            label="Cadastro de subitem"
            inputs={[
              {
                value: subitem.name,
                placeholder: "Nome",
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  setSubitem({ ...subitem, name: e.target.value });
                  setSubitemError({ ...subitemError, nameError: "" });
                },
                type: "text",
                errorLabel: subitemError.nameError,
              },
              {
                value: subitem.description,
                placeholder: "Descrição (para filtro)",
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  setSubitem({ ...subitem, description: e.target.value });
                  setSubitemError({ ...subitemError, descriptionError: "" });
                },
                type: "text",
                errorLabel: subitemError.descriptionError,
              },
              {
                value: subitem.photo,
                placeholder: "Foto",
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  setSubitem({ ...subitem, photo: e.target.value });
                  setSubitemError({ ...subitemError, photoError: "" });
                },
                type: "text",
                errorLabel: subitemError.photoError,
              },
            ]}
            buttonOnClick={handleSubmitSubitem}
            buttonLabel="Enviar"
          />
        )}
        {isItemActive && (
          <RegisterFormTemplate
            label="Cadastro de item"
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
                value: item.photo,
                placeholder: "Foto",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setItem({ ...item, photo: e.target.value });
                  setItemError({ ...itemError, photoError: "" });
                },
                type: "text",
                errorLabel: itemError.photoError,
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
                value: item.quantity !== 0 ? item.quantity.toString() : "",
                placeholder: "Quantidade",
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setItem({ ...item, quantity: parseInt(e.target.value) });
                  setItemError({ ...itemError, quantityError: "" });
                },
                type: "number",
                errorLabel: itemError.quantityError,
              },
            ]}
            withSubitem
            itemWithSubitems={item}
            setItemWithSubitems={setItem}
            buttonOnClick={handleSubmitItem}
            buttonLabel="Enviar"
          />
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
    </section>
  );
}
