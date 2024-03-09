import { ReactNode, useEffect, useState } from 'react'
import styles from './RegisterCard.module.scss'
import Text from '../../Atoms/Text';

type RegisterCardType = {
  label: string;
  description: string;
  icon: ReactNode;
  onClick: VoidFunction
  isActive?: boolean
}

export default function RegisterCard({ label, description, icon, onClick, isActive = false }: RegisterCardType) {
  const [mobileWindow, setMobileWindow] = useState<boolean>(window.innerWidth <= 720);

  useEffect(() => {
    const handleResize = () => {
      setMobileWindow(window.innerWidth <= 720);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`${styles.container} ${isActive && styles.isActiveContainer}`} onClick={onClick}>
      <div className={styles.iconContent}>
        {icon}
      </div>
      <Text fontSize='large' fontWeight='semibold'>{label}</Text>
      {!mobileWindow && <Text fontSize='mediumSmall' fontWeight='regular'>{description}</Text>}
    </div>
  )
}
