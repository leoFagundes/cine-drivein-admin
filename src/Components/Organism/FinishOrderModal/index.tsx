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
    discount: "",
  });

  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    if (event.target === event.currentTarget) {
      onClose();
      setChecked(true);
      setInputValues({
        credit: "",
        debit: "",
        money: "",
        discount: "",
      });
    }
  };

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };

  const calculateTotalValue = () => {
    const totalDebit = parseFloat(inputValues.debit) || 0;
    const totalCredit = parseFloat(inputValues.credit) || 0;
    const totalMoney = parseFloat(inputValues.money) || 0;
    const discount = parseFloat(inputValues.discount) || 0;
    const total = totalDebit + totalCredit + totalMoney - discount;
    return total.toFixed(2);
  };

  const totalValue = parseFloat(String(orderData?.total_value || 0));
  const serviceFee = isChecked
    ? parseFloat(String(orderData?.service_fee || 0))
    : 0;

  const totalToPay = (totalValue + serviceFee).toFixed(2);

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

  const handleSubmit = async () => {
    const totalDebit = parseFloat(inputValues.debit) || 0;
    const totalCredit = parseFloat(inputValues.credit) || 0;
    const totalMoney = parseFloat(inputValues.money) || 0;
    const discount = parseFloat(inputValues.discount) || 0;

    if (!validateForm()) {
      console.log("Formulário Inválido.");
      return;
    }

    setIsLoading(true);
    try {
      await OrderRepositories.updateOrder(orderData?._id || "", {
        ...orderData,
        status: "finished",
        credit_payment: totalCredit,
        debit_payment: totalDebit,
        money_payment: totalMoney,
        discount: discount,
        service_fee_paid: isChecked,
      });
      setInputValues({
        credit: "",
        debit: "",
        money: "",
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

  return (
    <>
      {isOpen && (
        <div onClick={handleCloseModalWith} className={styles.container}>
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
                    placeholder="Dinheiro / Pix"
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
                  /{totalToPay}
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
        </div>
      )}
    </>
  );
}
