import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import style from "./Alert.module.scss";

type AlertType = {
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  alertDisplayTime: number;
  onClose: () => void;
  type: string;
};

export default function Alert({
  isAlertOpen,
  setIsAlertOpen,
  message,
  alertDisplayTime,
  onClose,
  type,
}: AlertType) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAlertOpen(false);
      onClose();
    }, alertDisplayTime);

    return () => clearTimeout(timeout);
  }, [alertDisplayTime, onClose, setIsAlertOpen]);

  return isAlertOpen ? (
    <div
      className={`${style.alert} ${
        type === "success" ? style.success : style.danger
      }`}
    >
      <p>{message}</p>
      <FontAwesomeIcon
        data-testid="closeIco"
        className={style.closeIco}
        icon={faXmark}
        onClick={() => setIsAlertOpen(false)}
      />
    </div>
  ) : null;
}
