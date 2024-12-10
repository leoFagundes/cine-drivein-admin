import { MouseEvent, useState } from "react";
import styles from "./FinishOrderModal.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Order } from "../../../Types/types";
import { Input } from "../../Atoms/Input/Input";
import Button from "../../Atoms/Button";
import Text from "../../Atoms/Text";
import Caption from "../../Molecules/Caption";
import CheckBox from "../../Atoms/CheckBox";
import OrderRepositories from "../../../Services/repositories/OrderRepositories";
import { LoadingFullScreenTemplate } from "../../Templates/LoadingFullScreenTemplate";
import ItemRepositories from "../../../Services/repositories/ItemRepositories";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  orderData?: Order;
  orders: Order[];
  setOrders?: React.Dispatch<React.SetStateAction<Order[]>>;
  showAlert?: (message: string, type: string) => void;
};

const FINISH_ORDER_MESSAGE = "Pedido finalizado com sucesso";

export default function FinishOrderModal({
  onClose,
  isOpen,
  orderData,
  orders,
  setOrders,
  showAlert,
}: ModalType) {
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setChecked] = useState(true);
  const [inputValues, setInputValues] = useState({
    credit: "",
    debit: "",
    money: "",
    pix: "",
    discount: "",
  });

  const handleCloseModalWith = () => {
    onClose();
    setChecked(true);
    setInputValues({
      credit: "",
      debit: "",
      money: "",
      pix: "",
      discount: "",
    });
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const calculateTotalValue = () => {
    const totalDebit = parseFloat(inputValues.debit) || 0;
    const totalCredit = parseFloat(inputValues.credit) || 0;
    const totalMoney = parseFloat(inputValues.money) || 0;
    const totalPix = parseFloat(inputValues.pix) || 0;

    const subtotal = totalDebit + totalCredit + totalMoney + totalPix;

    const total = subtotal;
    return total.toFixed(2);
  };

  const discount = parseFloat(inputValues.discount) || 0;
  const totalValue = parseFloat(String(orderData?.total_value || 0));
  const serviceFee = isChecked ? parseFloat(String(totalValue * 0.1 || 0)) : 0;

  const totalToPay = (totalValue + serviceFee - discount).toFixed(2);

  const validateForm = () => {
    let isValid = true;
    if (parseFloat(calculateTotalValue()) > parseFloat(totalToPay)) {
      return false;
    }
    if (parseFloat(calculateTotalValue()) < 0) {
      return false;
    }
    return isValid;
  };

  const changeQuantityStock = async () => {
    // Mapear os itens para agrupar por ID e calcular a quantidade a ser reduzida
    const quantityToReduce: Record<string, number> = {};

    for (const item of orderData?.items || []) {
      if (!item.item._id) return;
      const itemId = item.item._id;
      quantityToReduce[itemId] = (quantityToReduce[itemId] || 0) + 1;
    }

    // Processar cada item único e reduzir a quantidade acumulada
    for (const [itemId, reduceBy] of Object.entries(quantityToReduce)) {
      try {
        // Obter o item do banco de dados
        const existingItem = await ItemRepositories.getItemById(itemId);

        if (!existingItem) {
          console.error(`Item com ID ${itemId} não encontrado.`);
          continue;
        }

        // Ignorar se o tipo do item for um dos citados abaixo
        if (
          existingItem.type === "Porções" ||
          existingItem.type === "Lanches" ||
          existingItem.type === "Vegetarianos" ||
          existingItem.type === "Molhos" ||
          existingItem.type === "Combos"
        ) {
          console.log(
            `Item ${existingItem.name} do tipo '${existingItem.type}' não será alterado.`
          );
          continue;
        }

        // Atualizar a quantidade e visibilidade
        await ItemRepositories.updateItem(itemId, {
          quantity: existingItem.quantity - reduceBy,
          isVisible: existingItem.quantity - reduceBy <= 2 ? false : true,
        });
        console.log(
          `Quantidade atualizada para o item ${existingItem.name}. Reduzido em ${reduceBy}.`
        );
      } catch (error) {
        console.error(`Erro ao processar o item ${itemId}:`, error);
      }
    }
  };

  const handleSubmit = async () => {
    const totalDebit = parseFloat(inputValues.debit) || 0;
    const totalCredit = parseFloat(inputValues.credit) || 0;
    const totalMoney = parseFloat(inputValues.money) || 0;
    const totalPix = parseFloat(inputValues.pix) || 0;
    const discount = parseFloat(inputValues.discount) || 0;

    if (!validateForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    setIsLoading(true);
    try {
      changeQuantityStock();
      await OrderRepositories.updateOrder(orderData?._id || "", {
        ...orderData,
        status: "finished",
        credit_payment: totalCredit,
        debit_payment: totalDebit,
        money_payment: totalMoney,
        pix_payment: totalPix,
        discount: discount,
        total_value: totalValue - discount,
        service_fee: serviceFee,
        service_fee_paid: isChecked,
      });
      setInputValues({
        credit: "",
        debit: "",
        money: "",
        pix: "",
        discount: "",
      });
      const updatedOrders = orders.filter(
        (order) => order._id !== orderData?._id
      );
      setOrders && setOrders(updatedOrders);
      setChecked(true);
      setIsLoading(false);
      showAlert && showAlert(FINISH_ORDER_MESSAGE, "success");
      onClose();
    } catch (error) {
      console.error("Não foi possível finalizar o pedido", error);
      setIsLoading(false);
    }
  };

  const handleCopyClick = (textToCopy: string) => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showAlert &&
          showAlert("Texto copiado para a área de transferência", "success");
        console.log("Texto copiado para a área de transferência: ", textToCopy);
      })
      .catch((error) => {
        console.error("Erro ao copiar o texto: ", error);
      });
  };

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.modalContainer}>
            {!isLoading ? (
              <>
                <FontAwesomeIcon
                  onClick={handleCloseModalWith}
                  className={styles.closeModalIcon}
                  size="lg"
                  icon={faXmark}
                />
                <Text fontSize="mediumLarge" fontWeight="semibold">
                  Finalização do pedido {orderData?.order_number}
                </Text>
                <div className={styles.inputs}>
                  <Input
                    type="number"
                    placeholder="Débito"
                    value={inputValues.debit}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        debit: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Crédito"
                    value={inputValues.credit}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        credit: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Dinheiro"
                    value={inputValues.money}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        money: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Pix"
                    value={inputValues.pix}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        pix: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="🔖 Desconto "
                    value={inputValues.discount}
                    onChange={(e) =>
                      setInputValues({
                        ...inputValues,
                        discount: e.target.value,
                      })
                    }
                  />
                  <div className={styles.checkboxContainer}>
                    <Caption
                      fontSize="mediumSmall"
                      label="Taxa de serviço foi paga? "
                      onClick={handleCheckboxChange}
                      onClickCheckBox={handleCheckboxChange}
                      checkboxRight={
                        <CheckBox
                          id="serviceFeeCheckbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                      }
                    />
                  </div>
                </div>
                <Text marginTop="22px">
                  Total a pagar:{" "}
                  <Text
                    fontColor={
                      parseFloat(calculateTotalValue()) >
                        parseFloat(totalToPay) ||
                      parseFloat(calculateTotalValue()) < 0
                        ? "invalid-color"
                        : parseFloat(calculateTotalValue()) ===
                          parseFloat(totalToPay)
                        ? "primary-color"
                        : "main-white"
                    }
                  >
                    R$ {calculateTotalValue()}
                  </Text>
                  /
                  <span
                    className={styles.textToCopy}
                    title="Copiar para área de transferência"
                    onClick={() => handleCopyClick(totalToPay)}
                  >
                    {totalToPay}
                  </span>
                </Text>
                <Button
                  onClick={() => handleSubmit()}
                  label="Finalizar Pedido"
                  backGroundColor={
                    parseFloat(calculateTotalValue()) >
                      parseFloat(totalToPay) ||
                    parseFloat(calculateTotalValue()) < 0
                      ? "invalid-color"
                      : "primary-color"
                  }
                />
              </>
            ) : (
              <LoadingFullScreenTemplate />
            )}
          </div>
          <span className={styles.observation}>
            Observação: Utilize o ponto (.) como separador para casas decimais.
          </span>
        </div>
      )}
    </>
  );
}
