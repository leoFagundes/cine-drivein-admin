import { MouseEvent } from "react";
import styles from "./DeleteModal.module.scss";
import Text from "../../Atoms/Text";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../Atoms/Button";
import AccessLimitedToAdmins from "../AccessLimitedToAdmins";

type DeleteModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  itemType: string;
  onClick: VoidFunction;
  impactLabel?: string;
  buttonLabel?: string;
};

export default function DeleteModal({
  itemType,
  onClose,
  isOpen,
  onClick,
  impactLabel = "excluir",
  buttonLabel = "Excluir",
}: DeleteModalType) {
  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  };

  return (
    <>
      {isOpen && (
        <div onClick={handleCloseModalWith} className={styles.container}>
          <AccessLimitedToAdmins />
          <div className={styles.modalContainer}>
            <Text fontWeight="semibold" fontColor="placeholder-color">
              Você realmente deseja <span>{impactLabel}</span> esse {itemType}?
            </Text>
            <Text fontColor="placeholder-color">
              Essa ação não poderá ser revertida
            </Text>
            <div className={styles.modalButtons}>
              {/* <Button onClick={onClose} label='Cancelar' /> */}
              <Button
                onClick={onClick}
                backGroundColor="invalid-color"
                label={buttonLabel}
              />
            </div>
            <FontAwesomeIcon
              onClick={onClose}
              className={styles.closeModalIcon}
              size="lg"
              icon={faXmark}
            />
          </div>
        </div>
      )}
    </>
  );
}
