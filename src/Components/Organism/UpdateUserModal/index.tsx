import styles from './UpdateUserModal.module.scss'
import { MouseEvent } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type ModalType = {
  isOpen: boolean;
  onClose: VoidFunction;
  onClick: (id: string) => void
}

export default function UpdateUserModal({ onClose, isOpen, onClick }: ModalType) {
  const handleCloseModalWith = (event: MouseEvent) => {
    event.preventDefault();
    event.target === event.currentTarget && onClose();
  }

  return (
    <>
      {
        isOpen && <div onClick={handleCloseModalWith} className={styles.container}>
          <div className={styles.modalContainer}>
            <FontAwesomeIcon onClick={onClose} className={styles.closeModalIcon} size="lg" icon={faXmark} />
          </div>
        </div>
      }
    </>
  )
}
