import styles from './Sidebar.module.scss';
import LogoImage from "../../Atoms/LogoImage";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faScroll,
  faBoxesStacked,
  faUserGroup,
  faBoxesPacking,
  faRightFromBracket,
  faBars,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { HorizontalItem } from "../../Molecules/HorizontalItem";

export const Sidebar = () => {
  const [page, setPage] = useState('home');
  const [isDisplayOn, setIsDisplayOn] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const isOpen = isDisplayOn || width > 720;

  const sideBarElementsInfo = [{
    key: 'home',
    label: 'Home',
    icon: faHouse,
    onClick: () => setPage('home'),
  }, {
    key: 'order',
    label: 'Pedidos',
    icon: faScroll,
    onClick: () => setPage('order'),
  }, {
    key: 'stock',
    label: 'Estoque',
    icon: faBoxesStacked,
    onClick: () => setPage('stock'),
  }, {
    key: 'register',
    label: 'Cadastro',
    icon: faBoxesPacking,
    onClick: () => setPage('register'),
  }, {
    key: 'users',
    label: 'Usuários',
    icon: faUserGroup,
    onClick: () => setPage('users'),
  }, {
    label: 'Sair',
    icon: faRightFromBracket,
    onClick: () => setIsDisplayOn(false),
  }];


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const variants = {
    open: { left: 0 },
    closed: { left: '-300px' },
  }

  return (
    <>
      <button onClick={() => setIsDisplayOn(true)} className={styles.hamburguerContainer}>
        <FontAwesomeIcon size="3x" icon={faBars}/>
      </button>

      <motion.div
        className={styles.container}
        animate={isOpen ? "open" : "closed"}
        variants={variants}
      >
        <div className={styles.closeIconContainer}>
          <FontAwesomeIcon onClick={() => setIsDisplayOn(false)} size="2xl" icon={faXmark} />
        </div>

        <LogoImage size="70px" />
        {
          sideBarElementsInfo.map((item, index) => {
            const marginTop = index === 0 ? '32px' : '24px';
            const IS_SELECTED = page === item.key;

            return (
              <HorizontalItem
                pageKey={item.key}
                isSelected={IS_SELECTED}
                label={item.label}
                icon={item.icon}
                onClick={item.onClick}
                marginTop={marginTop}
              />
            )
          })
        }
      </motion.div>
    </>
  )
}