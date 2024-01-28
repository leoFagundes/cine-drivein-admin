import React, { useEffect, } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import style from "./Alert.module.scss";

type Props = {
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>
  mensagem: string;
  tempoExibicao: number;
  onClose: () => void;
  type: "success" | "danger";
};

export default function Alert({
  showAlert,
  setShowAlert,
  mensagem,
  tempoExibicao,
  onClose,
  type,
}: Props) {

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowAlert(false);
      onClose();
    }, tempoExibicao);

    return () => clearTimeout(timeout);
  }, [tempoExibicao, onClose, setShowAlert]);

  return showAlert ? (
    <div
      className={`${style.alert} ${type === "success" ? style.success : style.danger}`}
    >
      <p>{mensagem}</p>
      <FontAwesomeIcon className={style.closeIco} icon={faXmark} onClick={() => setShowAlert(false)} />
    </div>
  ) : null;
}
